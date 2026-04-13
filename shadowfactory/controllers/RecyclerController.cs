using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shadowfactory.Data;
using shadowfactory.Models.DTOs;
using shadowfactory.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace shadowfactory.controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecyclerController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<RecyclerController> _logger;

        public RecyclerController(ECoVDbContext context, ILogger<RecyclerController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Register a new recycler/converter
        /// </summary>
        [HttpPost("register")]
        public async Task<IActionResult> RegisterRecycler([FromBody] RecyclerRegistrationRequest request)
        {
            try
            {
                var recycler = new Recycler
                {
                    CompanyName = request.CompanyName,
                    CompanyNameAr = request.CompanyNameAr,
                    Description = request.Description,
                    DescriptionAr = request.DescriptionAr,
                    ContactEmail = request.ContactEmail,
                    ContactPhone = request.ContactPhone,
                    WhatsappNumber = request.WhatsappNumber,
                    Location = request.Location,
                    LocationAr = request.LocationAr,
                    Latitude = request.Latitude,
                    Longitude = request.Longitude,
                    LogoUrl = request.LogoUrl,
                    CertificationNumber = request.CertificationNumber,
                    IsVerified = false, // Requires admin approval
                    IsActive = true
                };

                _context.Recyclers.Add(recycler);
                await _context.SaveChangesAsync();

                // Add capabilities
                if (request.Capabilities != null && request.Capabilities.Any())
                {
                    foreach (var capRequest in request.Capabilities)
                    {
                        var capability = new RecyclerCapability
                        {
                            RecyclerId = recycler.Id,
                            InputWasteSubtypeId = capRequest.PackagingWasteSubtypeId,
                            OutputMaterialType = capRequest.OutputMaterialType,
                            OutputMaterialTypeAr = capRequest.OutputMaterialTypeAr,
                            CapacityPerMonth = capRequest.CapacityPerMonth,
                            CapacityUnit = capRequest.CapacityUnit,
                            CostPerUnit = capRequest.CostPerUnit,
                            LeadTime = capRequest.LeadTime,
                            ProcessDescription = capRequest.ProcessDescription
                        };

                        _context.RecyclerCapabilities.Add(capability);
                    }

                    await _context.SaveChangesAsync();
                }

                return CreatedAtAction(nameof(GetRecyclerById), new { id = recycler.Id }, new
                {
                    recycler.Id,
                    recycler.CompanyName,
                    recycler.IsVerified
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error registering recycler: {ex.Message}");
                return StatusCode(500, new ApiResponse<object>
                {
                    Success = false,
                    Message = "Error registering recycler",
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get recycler by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetRecyclerById(int id)
        {
            var recycler = await _context.Recyclers
                .Include(r => r.Capabilities)
                .ThenInclude(c => c.InputWasteSubtype)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (recycler == null)
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Recycler not found",
                    Timestamp = DateTime.UtcNow
                });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Recycler retrieved",
                Data = recycler,
                Timestamp = DateTime.UtcNow
            });
        }

        /// <summary>
        /// List verified recyclers (with optional filters)
        /// </summary>
        [HttpGet("")]
        public async Task<IActionResult> ListRecyclers(
            [FromQuery] int pageNumber = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] int? wasteSubtypeId = null,
            [FromQuery] double? latitude = null,
            [FromQuery] double? longitude = null,
            [FromQuery] int? radiusKm = null)
        {
            var query = _context.Recyclers
                .Where(r => r.IsActive && r.IsVerified);

            if (wasteSubtypeId.HasValue)
                query = query.Where(r => r.Capabilities.Any(c => c.InputWasteSubtypeId == wasteSubtypeId));

            query = query.Include(r => r.Capabilities);

            // Geographic filtering (if coordinates provided)
            if (latitude.HasValue && longitude.HasValue && radiusKm.HasValue)
            {
                var recyclers = query.ToList(); // To-memory for distance calculation
                recyclers = recyclers.Where(r =>
                {
                    if (!r.Latitude.HasValue || !r.Longitude.HasValue)
                        return false;

                    var distance = CalculateDistance(latitude.Value, longitude.Value, r.Latitude.Value, r.Longitude.Value);
                    return distance <= radiusKm.Value;
                }).ToList();

                var total = recyclers.Count;
                var paged = recyclers
                    .OrderByDescending(r => r.Rating)
                    .Skip((pageNumber - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Recyclers retrieved",
                    Data = new { recyclers = paged, total, pageNumber, pageSize },
                    Timestamp = DateTime.UtcNow
                });
            }

            var total_all = await query.CountAsync();
            var listings_all = await query
                .OrderByDescending(r => r.Rating)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Recyclers retrieved",
                Data = new { recyclers = listings_all, total = total_all, pageNumber, pageSize },
                Timestamp = DateTime.UtcNow
            });
        }

        /// <summary>
        /// Record recycler interest in a packaging waste listing
        /// </summary>
        [Authorize(Roles = "RecyclerOwner")]
        [HttpPost("suggestions/{suggestionId}/express-interest")]
        public async Task<IActionResult> ExpressInterest(int suggestionId)
        {
            var suggestion = await _context.RecyclerSuggestions
                .Include(s => s.Recycler)
                .FirstOrDefaultAsync(s => s.Id == suggestionId);

            if (suggestion == null)
                return NotFound(new ApiResponse<object>
                {
                    Success = false,
                    Message = "Suggestion not found",
                    Timestamp = DateTime.UtcNow
                });

            suggestion.IsInterested = true;
            suggestion.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Interest expressed successfully",
                Timestamp = DateTime.UtcNow
            });
        }

        // Helper method for distance calculation (Haversine formula)
        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; // Radius of Earth in km

            var dLat = (lat2 - lat1) * Math.PI / 180.0;
            var dLon = (lon2 - lon1) * Math.PI / 180.0;

            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180.0) * Math.Cos(lat2 * Math.PI / 180.0) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);

            var c = 2 * Math.Asin(Math.Sqrt(a));
            return R * c;
        }
    }
}
