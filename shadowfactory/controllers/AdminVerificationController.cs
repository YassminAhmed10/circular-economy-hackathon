using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models.DTOs;
using shadowfactory.Services.Interfaces;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [Authorize(Roles = "Admin")]
    public class AdminVerificationController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly IEmailService _emailService;
        private readonly ILogger<AdminVerificationController> _logger;

        public AdminVerificationController(
            ECoVDbContext context,
            IEmailService emailService,
            ILogger<AdminVerificationController> logger)
        {
            _context = context;
            _emailService = emailService;
            _logger = logger;
        }

        [HttpGet("verification-requests")]
        public async Task<IActionResult> GetVerificationRequests()
        {
            var pendingFactories = await _context.Factories
                .Where(f => !f.IsVerified && (f.Status == "Pending" || f.Status == "VerificationRequested"))
                .OrderByDescending(f => f.UpdatedAt)
                .Select(f => new PendingFactoryVerificationDto
                {
                    FactoryId = f.Id,
                    FactoryName = f.FactoryName,
                    IndustryType = f.IndustryType,
                    Location = f.Location,
                    Address = f.Address,
                    Email = f.Email,
                    Phone = f.Phone,
                    OwnerName = f.OwnerName,
                    OwnerPhone = f.OwnerPhone,
                    TaxNumber = f.TaxNumber,
                    RegistrationNumber = f.RegistrationNumber,
                    Status = f.Status,
                    RequestedAt = f.UpdatedAt
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<PendingFactoryVerificationDto>>
            {
                Success = true,
                Message = "Verification requests loaded successfully",
                Data = pendingFactories
            });
        }

        [HttpPut("verification-requests/{factoryId:long}/approve")]
        public async Task<IActionResult> ApproveFactory(long factoryId)
        {
            var factory = await _context.Factories.FirstOrDefaultAsync(f => f.Id == factoryId);
            if (factory == null)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Factory not found" });
            }

            factory.IsVerified = true;
            factory.Status = "approved";
            factory.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await _emailService.SendApprovalEmailAsync(factory.Email, factory.FactoryName);

            return Ok(new ApiResponse
            {
                Success = true,
                Message = "Factory approved successfully"
            });
        }

        [HttpPut("verification-requests/{factoryId:long}/reject")]
        public async Task<IActionResult> RejectFactory(long factoryId, [FromBody] VerificationDecisionRequest request)
        {
            var factory = await _context.Factories.FirstOrDefaultAsync(f => f.Id == factoryId);
            if (factory == null)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Factory not found" });
            }

            var reason = string.IsNullOrWhiteSpace(request.Reason)
                ? "Factory data is incomplete or invalid"
                : request.Reason.Trim();

            factory.IsVerified = false;
            factory.Status = "rejected";
            factory.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            await _emailService.SendRejectionEmailAsync(factory.Email, factory.FactoryName, reason);

            return Ok(new ApiResponse
            {
                Success = true,
                Message = "Factory rejected successfully"
            });
        }

        [HttpGet("listing-requests")]
        public async Task<IActionResult> GetListingRequests()
        {
            var pendingListings = await _context.WasteListings
                .Where(w => w.Status == "PendingApproval")
                .OrderByDescending(w => w.CreatedAt)
                .Select(w => new PendingListingApprovalDto
                {
                    ListingId = w.Id,
                    FactoryId = w.FactoryId,
                    FactoryName = w.FactoryName,
                    Type = w.Type,
                    Category = w.Category,
                    Amount = w.Amount,
                    Unit = w.Unit,
                    Price = w.Price,
                    Location = w.Location,
                    Description = w.Description,
                    ImageUrl = w.ImageUrl,
                    Status = w.Status,
                    RequestedAt = w.CreatedAt
                })
                .ToListAsync();

            return Ok(new ApiResponse<List<PendingListingApprovalDto>>
            {
                Success = true,
                Message = "Listing requests loaded successfully",
                Data = pendingListings
            });
        }

        [HttpPut("listing-requests/{listingId:long}/approve")]
        public async Task<IActionResult> ApproveListing(long listingId)
        {
            var listing = await _context.WasteListings.FirstOrDefaultAsync(w => w.Id == listingId);
            if (listing == null)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Listing not found" });
            }

            listing.Status = "Active";
            listing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse
            {
                Success = true,
                Message = "Listing approved and published successfully"
            });
        }

        [HttpPut("listing-requests/{listingId:long}/reject")]
        public async Task<IActionResult> RejectListing(long listingId, [FromBody] VerificationDecisionRequest request)
        {
            var listing = await _context.WasteListings.FirstOrDefaultAsync(w => w.Id == listingId);
            if (listing == null)
            {
                return NotFound(new ApiResponse { Success = false, Message = "Listing not found" });
            }

            listing.Status = "Rejected";
            listing.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse
            {
                Success = true,
                Message = "Listing rejected successfully"
            });
        }

        [HttpGet("notifications")]
        public async Task<IActionResult> GetAdminNotifications()
        {
            var verificationCount = await _context.Factories
                .CountAsync(f => !f.IsVerified && (f.Status == "Pending" || f.Status == "VerificationRequested"));

            var listingCount = await _context.WasteListings
                .CountAsync(w => w.Status == "PendingApproval");

            var notifications = new List<AdminNotificationDto>();

            if (verificationCount > 0)
            {
                notifications.Add(new AdminNotificationDto
                {
                    Type = "verification",
                    Title = "Factory verification requests",
                    Message = $"{verificationCount} factories are waiting for verification",
                    Count = verificationCount,
                    Timestamp = DateTime.UtcNow
                });
            }

            if (listingCount > 0)
            {
                notifications.Add(new AdminNotificationDto
                {
                    Type = "listing",
                    Title = "Marketplace listing requests",
                    Message = $"{listingCount} listings are waiting for approval",
                    Count = listingCount,
                    Timestamp = DateTime.UtcNow
                });
            }

            return Ok(new ApiResponse<List<AdminNotificationDto>>
            {
                Success = true,
                Message = "Notifications loaded successfully",
                Data = notifications.OrderByDescending(n => n.Timestamp).ToList()
            });
        }
    }

    public class PendingFactoryVerificationDto
    {
        public long FactoryId { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerPhone { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
    }

    public class VerificationDecisionRequest
    {
        public string? Reason { get; set; }
    }

    public class PendingListingApprovalDto
    {
        public long ListingId { get; set; }
        public long FactoryId { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RequestedAt { get; set; }
    }

    public class AdminNotificationDto
    {
        public string Type { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public int Count { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
