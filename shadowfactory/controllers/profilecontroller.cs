using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Models.Entities;
using shadowfactory.Services;
using shadowfactory.Services.Interfaces;
using ECoV.API.Services.Interfaces;
using System.Security.Claims;

namespace shadowfactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<ProfileController> _logger;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IFileService _fileService;
        private readonly IFactoryProfileService _factoryProfileService;

        public ProfileController(
            ECoVDbContext context,
            ILogger<ProfileController> logger,
            IEmailService emailService,
            IConfiguration configuration,
            IFileService fileService,
            IFactoryProfileService factoryProfileService)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
            _configuration = configuration;
            _fileService = fileService;
            _factoryProfileService = factoryProfileService;
        }

        // GET: api/profile/me
        [HttpGet("me")]
        public async Task<ActionResult<FactoryProfileDto>> GetMyProfile()
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr) || !long.TryParse(userIdStr, out long userId))
                    return Unauthorized(new { message = "Invalid token" });

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user?.FactoryId == null)
                    return BadRequest(new { message = "No factory linked to this account" });

                long factoryId = user.FactoryId.Value;

                // جلب المصنع مع تضمين المخلفات
                var factory = await _context.Factories
                    .Include(f => f.WastesForSale)
                        .ThenInclude(w => w.WasteType)
                    .Include(f => f.PurchaseRequests)
                        .ThenInclude(p => p.WasteType)
                    .FirstOrDefaultAsync(f => f.Id == factoryId);

                if (factory == null)
                    return NotFound(new { message = "Factory not found" });

                // إحصائيات افتراضية
                int activeListings = 0, completedOrders = 0;

                var profile = MapToProfileDto(factory, activeListings, completedOrders);
                return Ok(new ApiResponse<FactoryProfileDto>
                {
                    Success = true,
                    Message = "Profile retrieved successfully",
                    Data = profile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching profile");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // POST: api/profile/upload-logo
        [HttpPost("upload-logo")]
        public async Task<IActionResult> UploadLogo([FromBody] LogoUploadDto request)
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr) || !long.TryParse(userIdStr, out long userId))
                    return Unauthorized(new { message = "Invalid token" });

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user?.FactoryId == null)
                    return BadRequest(new { message = "No factory linked to this account" });

                var factory = await _context.Factories.FindAsync(user.FactoryId.Value);
                if (factory == null)
                    return NotFound(new { message = "Factory not found" });

                // رفع الصورة من Base64
                if (!string.IsNullOrEmpty(request.LogoBase64))
                {
                    var uploadResult = await _fileService.UploadBase64ImageAsync(
                        request.LogoBase64,
                        "logos",
                        $"{factory.Id}_{Guid.NewGuid()}.png"
                    );

                    if (!uploadResult.Success)
                    {
                        return BadRequest(new { message = "Failed to upload logo: " + uploadResult.Message });
                    }

                    // تحديث LogoUrl في قاعدة البيانات
                    factory.LogoUrl = uploadResult.FileUrl;
                    factory.UpdatedAt = DateTime.UtcNow;
                    await _context.SaveChangesAsync();

                    return Ok(new ApiResponse<FileUploadResponse>
                    {
                        Success = true,
                        Message = "Logo uploaded successfully",
                        Data = uploadResult
                    });
                }

                return BadRequest(new { message = "No logo data provided" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading logo");
                return StatusCode(500, new { message = "Error uploading logo: " + ex.Message });
            }
        }

        // PUT: api/profile/me
        [HttpPut("me")]
        public async Task<IActionResult> UpdateProfile([FromBody] FactoryProfileDto updateDto)
        {
            try
            {
                var factoryIdClaim = User.FindFirst("FactoryId")?.Value
                    ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(factoryIdClaim) || !long.TryParse(factoryIdClaim, out long factoryId))
                {
                    return Unauthorized(new { message = "Invalid token" });
                }

                if (factoryId != updateDto.FactoryId)
                    return BadRequest(new { message = "Factory ID mismatch" });

                var factory = await _context.Factories
                    .Include(f => f.WastesForSale)
                    .Include(f => f.PurchaseRequests)
                    .FirstOrDefaultAsync(f => f.Id == factoryId);

                if (factory == null)
                    return NotFound(new { message = "Factory not found" });

                // تحديث البيانات الأساسية
                factory.FactoryName = updateDto.FactoryName;
                factory.IndustryType = updateDto.IndustryType;
                factory.Location = updateDto.Location;
                factory.Address = updateDto.Address;
                factory.Phone = updateDto.Phone;
                factory.Email = updateDto.Email;
                factory.OwnerName = updateDto.OwnerName;
                factory.OwnerPhone = updateDto.OwnerPhone;
                factory.TaxNumber = updateDto.TaxNumber;
                factory.RegistrationNumber = updateDto.RegistrationNumber;
                factory.EstablishmentYear = updateDto.EstablishmentYear;
                factory.ProductionCapacity = updateDto.ProductionCapacity ?? 0;
                factory.DescriptionAr = updateDto.MainProducts;
                factory.UpdatedAt = DateTime.UtcNow;

                // تحديث المخلفات المعروضة للبيع
                if (updateDto.WastesForSale != null)
                {
                    _context.FactoryWastes.RemoveRange(factory.WastesForSale);
                    factory.WastesForSale.Clear();
                    foreach (var wasteDto in updateDto.WastesForSale)
                    {
                        factory.WastesForSale.Add(new FactoryWaste
                        {
                            WasteTypeId = wasteDto.WasteTypeId,
                            Quantity = wasteDto.Quantity,
                            Unit = wasteDto.Unit,
                            Frequency = wasteDto.Frequency,
                            Description = wasteDto.Description,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        });
                    }
                }

                // تحديث طلبات الشراء
                if (updateDto.PurchaseRequests != null)
                {
                    _context.FactoryPurchases.RemoveRange(factory.PurchaseRequests);
                    factory.PurchaseRequests.Clear();
                    foreach (var purchaseDto in updateDto.PurchaseRequests)
                    {
                        factory.PurchaseRequests.Add(new FactoryPurchase
                        {
                            WasteTypeId = purchaseDto.WasteTypeId,
                            Quantity = purchaseDto.Quantity,
                            Unit = purchaseDto.Unit,
                            Frequency = purchaseDto.Frequency,
                            Purpose = purchaseDto.Purpose,
                            CreatedAt = DateTime.UtcNow,
                            UpdatedAt = DateTime.UtcNow
                        });
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Profile updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile");
                return StatusCode(500, new { message = "Internal server error" });
            }
        }

        // POST: api/profile/request-verification
        [HttpPost("request-verification")]
        public async Task<IActionResult> RequestVerification()
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr) || !long.TryParse(userIdStr, out long userId))
                    return Unauthorized(new ApiResponse { Success = false, Message = "Invalid token" });

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user?.Factory == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "No factory linked to this account"
                    });
                }

                var factory = user.Factory;

                if (factory.IsVerified)
                {
                    return Ok(new ApiResponse
                    {
                        Success = true,
                        Message = "Factory is already verified"
                    });
                }

                factory.Status = "VerificationRequested";
                factory.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var adminEmail = _configuration["Application:SupportEmail"]
                    ?? _configuration["Email:SenderEmail"]
                    ?? "admin@ecov.local";

                var details =
                    $"FactoryId={factory.Id}, Name={factory.FactoryName}, Industry={factory.IndustryType}, " +
                    $"Location={factory.Location}, Email={factory.Email}, Phone={factory.Phone}, " +
                    $"Owner={factory.OwnerName}, Tax={factory.TaxNumber}, Reg={factory.RegistrationNumber}";

                await _emailService.SendAdminVerificationRequestEmailAsync(adminEmail, factory.FactoryName, details);
                await _emailService.SendVerificationRequestReceivedEmailAsync(factory.Email, factory.FactoryName);

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Verification request sent to admin successfully"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error requesting factory verification");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Failed to send verification request"
                });
            }
        }

        private FactoryProfileDto MapToProfileDto(Factory factory, int activeListings, int completedOrders)
        {
            var purposes = new List<string>();
            if (factory.WastesForSale != null && factory.WastesForSale.Any())
                purposes.Add("sell");
            if (factory.PurchaseRequests != null && factory.PurchaseRequests.Any())
                purposes.Add("buy");

            return new FactoryProfileDto
            {
                FactoryId = factory.Id,
                FactoryName = factory.FactoryName,
                IndustryType = factory.IndustryType,
                Location = factory.Location,
                Address = factory.Address,
                Phone = factory.Phone,
                Email = factory.Email,
                OwnerName = factory.OwnerName,
                OwnerPhone = factory.OwnerPhone,
                TaxNumber = factory.TaxNumber,
                RegistrationNumber = factory.RegistrationNumber,
                EstablishmentYear = factory.EstablishmentYear,
                ProductionCapacity = factory.ProductionCapacity,
                ProductionUnit = "ton",
                MainProducts = factory.DescriptionAr,
                Status = factory.Status,
                JoinedDate = factory.CreatedAt,
                Rating = factory.Rating ?? 4.5m,
                TotalReviews = factory.TotalReviews ?? 0,
                ActiveListings = activeListings,
                CompletedOrders = completedOrders,
                LogoUrl = factory.LogoUrl,
                IsVerified = factory.IsVerified,
                RegistrationPurpose = purposes,
                WastesForSale = factory.WastesForSale?.Select(w => new WasteItemDto
                {
                    WasteTypeId = w.WasteTypeId,
                    WasteTypeName = w.WasteType?.NameAr ?? "Unknown",
                    Quantity = w.Quantity,
                    Unit = w.Unit,
                    Frequency = w.Frequency,
                    Description = w.Description
                }).ToList() ?? new(),
                PurchaseRequests = factory.PurchaseRequests?.Select(p => new PurchaseItemDto
                {
                    WasteTypeId = p.WasteTypeId,
                    WasteTypeName = p.WasteType?.NameAr ?? "Unknown",
                    Quantity = p.Quantity,
                    Unit = p.Unit,
                    Frequency = p.Frequency,
                    Purpose = p.Purpose
                }).ToList() ?? new()
            };
        }

        // ════════════════════════════════════════════════════════════════════════════════════
        // 🏭 GET: api/profile/factory/{id}/comprehensive
        // العرض الشامل: جميع بيانات المصنع في ملف واحد
        // ════════════════════════════════════════════════════════════════════════════════════
        [HttpGet("factory/{id}/comprehensive")]
        public async Task<IActionResult> GetComprehensiveFactoryProfile(long id)
        {
            try
            {
                _logger.LogInformation($"📋 Fetching comprehensive profile for factory {id}");

                var profile = await _factoryProfileService.GetFactoryComprehensiveProfileAsync(id);

                if (profile?.BasicInfo == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = $"Factory with id {id} not found"
                    });
                }

                return Ok(new ApiResponse<FactoryComprehensiveProfileDto>
                {
                    Success = true,
                    Message = "Comprehensive factory profile retrieved successfully",
                    Data = profile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching comprehensive profile: {ex.Message}");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Error fetching factory profile"
                });
            }
        }

        // 🆕 GET: api/profile/factory/{email}
        // Fetch factory profile by email (for front-end enrichment)
        [HttpGet("factory/{email}")]
        [AllowAnonymous] // Allow anonymous access for public profile retrieval
        public async Task<IActionResult> GetFactoryByEmail(string email)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(email))
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Email parameter is required"
                    });

                _logger.LogInformation($"🔍 Searching factory by email: {email}");

                // Query factory by email
                var factory = await _context.Factories
                    .FirstOrDefaultAsync(f => f.Email.ToLower() == email.ToLower());

                if (factory == null)
                {
                    _logger.LogWarning($"⚠️ Factory not found with email: {email}");
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = $"No factory found with email: {email}"
                    });
                }

                _logger.LogInformation($"✅ Found factory: {factory.FactoryName} (ID: {factory.Id})");

                // Return factory data in standard format
                var factoryData = new
                {
                    factoryId = factory.Id,
                    factoryName = factory.FactoryName,
                    email = factory.Email,
                    phone = factory.Phone,
                    address = factory.Address,
                    location = factory.Location,
                    taxNumber = factory.TaxNumber,
                    registrationNumber = factory.RegistrationNumber,
                    logoUrl = factory.LogoUrl,
                    industryType = factory.IndustryType,
                    isVerified = factory.IsVerified,
                    ownerName = factory.OwnerName,
                    rating = factory.Rating ?? 4.5m,
                    totalReviews = factory.TotalReviews ?? 0
                };

                return Ok(new ApiResponse<dynamic>
                {
                    Success = true,
                    Message = "Factory profile retrieved successfully",
                    Data = factoryData
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching factory by email: {ex.Message}");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Error fetching factory profile"
                });
            }
        }

        // GET: api/profile/me/comprehensive
        [HttpGet("me/comprehensive")]
        public async Task<IActionResult> GetMyComprehensiveProfile()
        {
            try
            {
                var userIdStr = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdStr) || !long.TryParse(userIdStr, out long userId))
                    return Unauthorized(new ApiResponse { Success = false, Message = "Invalid token" });

                var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
                if (user?.FactoryId == null)
                    return BadRequest(new ApiResponse { Success = false, Message = "No factory linked to this account" });

                var profile = await _factoryProfileService.GetFactoryComprehensiveProfileAsync(user.FactoryId.Value);

                return Ok(new ApiResponse<FactoryComprehensiveProfileDto>
                {
                    Success = true,
                    Message = "Your comprehensive factory profile",
                    Data = profile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error fetching your comprehensive profile: {ex.Message}");
                return StatusCode(500, new ApiResponse { Success = false, Message = "Error fetching your profile" });
            }
        }

        // GET: api/profile/factory/search?name=...
        [HttpGet("factory/search")]
        [AllowAnonymous]
        public async Task<IActionResult> SearchFactoryByName([FromQuery] string name)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(name))
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Factory name parameter is required"
                    });

                _logger.LogInformation($"🔍 Searching factory by name: {name}");

                // Search by Arabic name or English name
                var factory = await _context.Factories
                    .FirstOrDefaultAsync(f => 
                        f.FactoryName.ToLower().Contains(name.ToLower()) ||
                        f.FactoryNameEn.ToLower().Contains(name.ToLower()));

                if (factory == null)
                {
                    _logger.LogWarning($"⚠️ Factory not found with name: {name}");
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = $"No factory found with name: {name}"
                    });
                }

                _logger.LogInformation($"✅ Found factory: {factory.FactoryName} (ID: {factory.Id})");

                // Return factory data
                var factoryData = new
                {
                    id = factory.Id,
                    factoryName = factory.FactoryName,
                    factoryNameEn = factory.FactoryNameEn,
                    industryType = factory.IndustryType,
                    location = factory.Location,
                    address = factory.Address,
                    phone = factory.Phone,
                    email = factory.Email,
                    website = factory.Website,
                    logoUrl = factory.LogoUrl,
                    ownerName = factory.OwnerName,
                    establishmentYear = factory.EstablishmentYear,
                    numberOfEmployees = factory.NumberOfEmployees ?? factory.EmployeeCount,
                    isVerified = factory.IsVerified
                };

                return Ok(new ApiResponse<dynamic>
                {
                    Success = true,
                    Message = "Factory found",
                    Data = factoryData
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"❌ Error searching factory: {ex.Message}");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Error searching factory"
                });
            }
        }
    }
}