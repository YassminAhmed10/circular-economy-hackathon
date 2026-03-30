using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Models.Entities;
using shadowfactory.Services.Interfaces;
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

        public ProfileController(
            ECoVDbContext context,
            ILogger<ProfileController> logger,
            IEmailService emailService,
            IConfiguration configuration)
        {
            _context = context;
            _logger = logger;
            _emailService = emailService;
            _configuration = configuration;
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
    }
}