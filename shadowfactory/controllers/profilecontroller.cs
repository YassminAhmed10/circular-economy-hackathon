using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

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
        /// Get user profile with factory details (TEMPORARY VERSION)
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized(new ApiResponse { Success = false, Message = "غير مصرح به" });

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound(new ApiResponse { Success = false, Message = "المستخدم غير موجود" });

                // TEMPORARY: Create profile without new columns
                var profile = new
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email,
                    // Phone will come from factory for now
                    Phone = user.Factory?.Phone ?? "",
                    Role = user.Role,
                    FactoryId = user.FactoryId,
                    // Use defaults for notification settings
                    EmailNotifications = true,
                    AppNotifications = true,
                    PublicProfile = true,
                    LastLogin = user.LastLogin,
                    CreatedAt = user.CreatedAt,
                    UpdatedAt = user.UpdatedAt,
                    Factory = user.Factory != null ? new
                    {
                        Id = user.Factory.Id,
                        FactoryName = user.Factory.FactoryName,
                        FactoryNameEn = user.Factory.FactoryNameEn,
                        IndustryType = user.Factory.IndustryType,
                        Location = user.Factory.Location,
                        Address = user.Factory.Address,
                        Phone = user.Factory.Phone,
                        Email = user.Factory.Email,
                        OwnerName = user.Factory.OwnerName,
                        TaxNumber = user.Factory.TaxNumber,
                        RegistrationDate = user.Factory.RegistrationDate,
                        Verified = user.Factory.Verified,
                        Status = user.Factory.Status,
                        EmailNotifications = true,
                        AppNotifications = true,
                        PublicProfile = true
                    } : null
                };

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "تم جلب بيانات الملف الشخصي",
                    Data = profile
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء جلب البيانات",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Update user profile (TEMPORARY - limited functionality)
        /// </summary>
        [HttpPut]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            try
            {
                var userId = GetUserId();
                if (userId == null)
                    return Unauthorized(new ApiResponse { Success = false, Message = "غير مصرح به" });

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null)
                    return NotFound(new ApiResponse { Success = false, Message = "المستخدم غير موجود" });

                // TEMPORARY: Only update basic fields
                if (!string.IsNullOrEmpty(request.FullName))
                    user.FullName = request.FullName;

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
                    Message = "حدث خطأ أثناء تحديث البيانات",
                    Errors = new List<string> { ex.Message }
                });
            }
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
                    return Unauthorized(new ApiResponse { Success = false, Message = "غير مصرح به" });

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user == null || !user.FactoryId.HasValue)
                    return Ok(new ApiResponse<ProfileStatsDto>
                    {
                        Success = true,
                        Message = "إحصائيات الملف",
                        Data = new ProfileStatsDto()
                    });

                var factoryId = user.FactoryId.Value;

                // Get active listings count
                var activeListings = await _context.WasteListings
                    .CountAsync(w => w.FactoryId == factoryId && w.Status == "Active");

                // Get completed transactions count
                var completedOrders = await _context.Transactions
                    .CountAsync(t => t.SellerFactoryId == factoryId && t.Status == "Completed");

                var stats = new ProfileStatsDto
                {
                    ActiveListings = activeListings,
                    CompletedOrders = completedOrders,
                    Rating = 4.8,
                    CustomerSatisfaction = 98
                };

                return Ok(new ApiResponse<ProfileStatsDto>
                {
                    Success = true,
                    Message = "إحصائيات الملف",
                    Data = stats
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting profile stats");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء جلب الإحصائيات",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        #region Helper Methods

        private long? GetUserId()
        {
            var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out long userId))
                return null;

            return userId;
        }

        #endregion
    }

    // Simplified DTOs for temporary use
    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string FactoryName { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
    }

    public class ProfileStatsDto
    {
        public int ActiveListings { get; set; }
        public int CompletedOrders { get; set; }
        public double Rating { get; set; }
        public int CustomerSatisfaction { get; set; }
    }
}