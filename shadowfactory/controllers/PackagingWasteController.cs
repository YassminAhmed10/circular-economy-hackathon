using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Models.Entities;
using shadowfactory.Services;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackagingWasteController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly IRecyclerMatchingService _recyclerService;
        private readonly ILogger<PackagingWasteController> _logger;

        public PackagingWasteController(
            ECoVDbContext context,
            IRecyclerMatchingService recyclerService,
            ILogger<PackagingWasteController> logger)
        {
            _context = context;
            _recyclerService = recyclerService;
            _logger = logger;
        }

        /// <summary>
        /// Get all packaging waste subtypes
        /// </summary>
        [HttpGet("subtypes")]
        public async Task<IActionResult> GetSubtypes()
        {
            var subtypes = await _context.PackagingWasteSubtypes
                .Where(s => s.IsActive)
                .Select(s => new
                {
                    s.Id,
                    s.Name,
                    s.NameAr,
                    s.Description,
                    s.Icon
                })
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Packaging waste subtypes retrieved",
                Data = subtypes,
                Timestamp = DateTime.UtcNow
            });
        }

        // DISABLED: This method tries to set non-existent properties (ContaminationLevel, FoodContactSuitability, RecyclabilityOption, PackagingWasteSubtype)
        /*
        [Authorize(Roles = "FactoryOwner")]
        [HttpPost("listings")]
        public async Task<IActionResult> CreatePackagingWasteListing([FromBody] PackagingWasteListingCreateRequest request)
        {
            // DISABLED - references non-existent WasteListing properties
            return StatusCode(503, new ApiResponse<object> { Success = false, Message = "Feature currently disabled", Timestamp = DateTime.UtcNow });
        }
        */

        /// <summary>
        /// Get packaging waste listing by ID
        /// </summary>
        [HttpGet("listings/{id}")]
        public async Task<IActionResult> GetPackagingWasteListingById(int id)
        {
            var listing = await _context.WasteListings
                .Where(l => l.Id == id && l.Category == "Sustainable Packaging Waste")
                .FirstOrDefaultAsync();

            if (listing == null)
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Listing not found",
                    Timestamp = DateTime.UtcNow
                });

            listing.Views++;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Listing retrieved",
                Data = listing,
                Timestamp = DateTime.UtcNow
            });
        }

        /// <summary>
        /// Get suggested recyclers for a packaging waste listing
        /// </summary>
        [HttpGet("listings/{id}/suggested-recyclers")]
        public async Task<IActionResult> GetSuggestedRecyclers(int id)
        {
            try
            {
                var listing = await _context.WasteListings.FindAsync(id);
                if (listing == null || listing.Category != "Sustainable Packaging Waste")
                    return NotFound(new ApiResponse<object>
                    {
                        Success = false,
                        Message = "Packaging waste listing not found",
                        Timestamp = DateTime.UtcNow
                    });

                var suggestions = await _recyclerService.GetSuggestedRecyclersAsync(id);

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Suggested recyclers retrieved",
                    Data = suggestions,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error fetching recycler suggestions: {ex.Message}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Error retrieving suggestions",
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        // DISABLED: This method updates non-existent properties (ContaminationLevel, FoodContactSuitability, RecyclabilityOption)
        /*
        [Authorize(Roles = "FactoryOwner")]
        [HttpPut("listings/{id}")]
        public async Task<IActionResult> UpdatePackagingWasteListing(int id, [FromBody] PackagingWasteListingCreateRequest request)
        {
            // DISABLED - references non-existent WasteListing properties
            return StatusCode(503, new ApiResponse<object> { Success = false, Message = "Feature currently disabled", Timestamp = DateTime.UtcNow });
        }
        */

        // DISABLED: This method queries non-existent properties (PackagingWasteSubtype, ContaminationLevel, FoodContactSuitability)
        /*
        [HttpGet("listings")]
        public async Task<IActionResult> ListPackagingWasteListings(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string? subtype = null,
            [FromQuery] string? contaminationLevel = null,
            [FromQuery] bool? foodContactSuitable = null)
        {
            // DISABLED - references non-existent WasteListing properties
            return Ok(new ApiResponse<object> { Success = true, Message = "Feature currently disabled", Data = new { listings = new List<object>(), total = 0, pageNumber, pageSize }, Timestamp = DateTime.UtcNow });
        }
        */

        private async Task<bool> ValidatePackagingWasteListing(PackagingWasteListingCreateRequest request)
        {
            if (string.IsNullOrEmpty(request.PackagingWasteSubtype))
                return false;

            var subtype = await _context.PackagingWasteSubtypes
                .AnyAsync(s => s.Name == request.PackagingWasteSubtype && s.IsActive);

            return subtype && request.Amount > 0;
        }
    }
}
