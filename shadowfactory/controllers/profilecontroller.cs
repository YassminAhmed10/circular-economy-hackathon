using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Services.Interfaces;
using System.Security.Claims;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ProfileController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<ProfileController> _logger;
        private readonly IAuditService _auditService;

        public ProfileController(
            ECoVDbContext context,
            ILogger<ProfileController> logger,
            IAuditService auditService)
        {
            _context = context;
            _logger = logger;
            _auditService = auditService;
        }

        /// <summary>
        /// Get user profile with factory details
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized(new ApiResponse { Success = false, Message = "??? ???? ??" });

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound(new ApiResponse { Success = false, Message = "???????? ??? ?????" });

                var profile = new ProfileDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    Phone = user.Phone ?? "",
                    Role = user.Role,
                    FactoryId = user.FactoryId,
                    EmailNotifications = user.EmailNotifications,
                    AppNotifications = user.AppNotifications,
                    PublicProfile = user.PublicProfile,
                    RegistrationDate = user.RegistrationDate ?? user.CreatedAt,
                    LastLogin = user.LastLogin,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    Factory = user.Factory != null ? new FactoryDto
                    {
                        Id = user.Factory.Id,
                        FactoryName = user.Factory.FactoryName,
                        FactoryNameEn = user.Factory.FactoryNameEn,
                        IndustryType = user.Factory.IndustryType,
                        Location = user.Factory.Location,
                        Address = user.Factory.Address,
                        Phone = user.Factory.Phone,
                        Fax = user.Factory.Fax,
                        Email = user.Factory.Email,
                        Website = user.Factory.Website,
                        OwnerName = user.Factory.OwnerName,
                        OwnerPhone = user.Factory.OwnerPhone,
                        OwnerEmail = user.Factory.OwnerEmail,
                        TaxNumber = user.Factory.TaxNumber,
                        RegistrationNumber = user.Factory.RegistrationNumber,
                        EstablishmentYear = user.Factory.EstablishmentYear,
                        EmployeeCount = user.Factory.EmployeeCount,
                        FactorySize = user.Factory.FactorySize ?? 0,
                        ProductionCapacity = user.Factory.ProductionCapacity,
                        LogoUrl = user.Factory.LogoUrl,
                        IsVerified = user.Factory.IsVerified,
                        Status = user.Factory.Status,
                        RegistrationDate = user.Factory.CreatedAt,
                        CreatedAt = user.Factory.CreatedAt,
                        UpdatedAt = user.Factory.UpdatedAt,
                        DescriptionAr = user.Factory.DescriptionAr,
                        DescriptionEn = user.Factory.DescriptionEn,
                        Rating = user.Factory.Rating,
                        TotalReviews = user.Factory.TotalReviews,
                        Latitude = user.Factory.Latitude,
                        Longitude = user.Factory.Longitude
                    } : null
                };

                return Ok(new ApiResponse<ProfileDto>
                {
                    Success = true,
                    Message = "?? ??? ?????? ????? ??????",
                    Data = profile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ??? ????????",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Update user profile
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized(new ApiResponse { Success = false, Message = "??? ???? ??" });

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound(new ApiResponse { Success = false, Message = "???????? ??? ?????" });

                // Update user fields
                if (!string.IsNullOrEmpty(request.FullName))
                    user.FullName = request.FullName;

                if (!string.IsNullOrEmpty(request.Phone))
                    user.Phone = request.Phone;

                user.EmailNotifications = request.EmailNotifications;
                user.AppNotifications = request.AppNotifications;
                user.PublicProfile = request.PublicProfile;

                // Update factory info if user has a factory
                if (user.FactoryId.HasValue && user.Factory != null)
                {
                    if (!string.IsNullOrEmpty(request.FactoryName))
                        user.Factory.FactoryName = request.FactoryName;

                    if (!string.IsNullOrEmpty(request.IndustryType))
                        user.Factory.IndustryType = request.IndustryType;

                    if (!string.IsNullOrEmpty(request.Location))
                        user.Factory.Location = request.Location;

                    if (!string.IsNullOrEmpty(request.Address))
                        user.Factory.Address = request.Address;

                    if (!string.IsNullOrEmpty(request.OwnerName))
                        user.Factory.OwnerName = request.OwnerName;

                    if (!string.IsNullOrEmpty(request.TaxNumber))
                        user.Factory.TaxNumber = request.TaxNumber;

                    user.Factory.UpdatedAt = DateTime.UtcNow;
                }

                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                // Return updated profile
                return await GetProfile();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating profile");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ????????",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Verify factory
        /// </summary>
        [HttpPut("verify-factory/{factoryId}")]
        [Authorize]
        public async Task<IActionResult> VerifyFactory(long factoryId)
        {
            var factory = await _context.Factories
                .FirstOrDefaultAsync(f => f.Id == factoryId);

            if (factory == null)
                return NotFound(new ApiResponse
                {
                    Success = false,
                    Message = "?????? ??? ?????"
                });

            factory.IsVerified = true;
            factory.Status = "approved";
            factory.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new ApiResponse
            {
                Success = true,
                Message = "?? ????? ?????? ?????"
            });
        }

        /// <summary>
        /// Get profile statistics
        /// </summary>
        [HttpGet("stats")]
        public async Task<IActionResult> GetProfileStats()
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized(new ApiResponse { Success = false, Message = "??? ???? ??" });

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null || !user.FactoryId.HasValue)
                    return Ok(new ApiResponse<ProfileStatsDto>
                    {
                        Success = true,
                        Message = "???????? ?????",
                        Data = new ProfileStatsDto()
                    });

                var factoryId = user.FactoryId.Value;

                // Get active listings count
                var activeListings = await _context.WasteListings
                    .CountAsync(w => w.FactoryId == factoryId && w.Status == "Active");

                // Get completed transactions count
                var completedOrders = await _context.Orders
                    .CountAsync(o => o.SellerFactoryId == factoryId && o.Status == "?????");

                var stats = new ProfileStatsDto
                {
                    ActiveListings = activeListings,
                    CompletedOrders = completedOrders,
                    Rating = user.Factory?.Rating ?? 0,
                    CustomerSatisfaction = user.Factory?.Rating.HasValue == true ? (int)(user.Factory.Rating * 20) : 98
                };

                return Ok(new ApiResponse<ProfileStatsDto>
                {
                    Success = true,
                    Message = "???????? ?????",
                    Data = stats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile stats");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ??? ??????????",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        #region Helper Methods

        private long? GetUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return null;

            return userId;
        }

        #endregion
    }
}

