using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Models.Entities;
using System.Security.Claims;
using Microsoft.Data.SqlClient;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MarketplaceController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<MarketplaceController> _logger;

        public MarketplaceController(
            ECoVDbContext context,
            ILogger<MarketplaceController> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Get all active waste listings in marketplace
        /// </summary>
        [HttpGet("waste-listings")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<List<WasteListingDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetWasteListings(
            [FromQuery] string? category = null,
            [FromQuery] string? location = null,
            [FromQuery] string? search = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 20)
        {
            try
            {
                var query = _context.WasteListings
                    .Include(w => w.Factory)
                    .Where(w => w.Status == "Active");

                // Apply filters
                if (!string.IsNullOrEmpty(category))
                {
                    query = query.Where(w => w.Category == category);
                }

                if (!string.IsNullOrEmpty(location))
                {
                    query = query.Where(w => w.Location.Contains(location));
                }

                if (!string.IsNullOrEmpty(search))
                {
                    query = query.Where(w => w.Type.Contains(search) ||
                                           w.Description.Contains(search) ||
                                           w.FactoryName.Contains(search) ||
                                           w.TitleAr.Contains(search) ||
                                           w.TitleEn.Contains(search));
                }

                var listings = await query
                    .OrderByDescending(w => w.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = listings.Select(w => new WasteListingDto
                {
                    Id = w.Id,
                    Type = w.Type,
                    TypeEn = w.TypeEn,
                    Amount = w.Amount,
                    Unit = w.Unit,
                    Price = w.Price,
                    Description = w.Description,
                    Category = w.Category,
                    ImageUrl = w.ImageUrl,
                    Status = w.Status,
                    FactoryId = w.FactoryId,
                    FactoryName = w.FactoryName,
                    CreatedAt = w.CreatedAt,
                    UpdatedAt = w.UpdatedAt,
                    ExpiresAt = w.ExpiresAt,

                    // New multilingual fields
                    TitleAr = w.TitleAr,
                    TitleEn = w.TitleEn,
                    DescriptionAr = w.DescriptionAr,
                    DescriptionEn = w.DescriptionEn,
                    CompanyNameAr = w.CompanyNameAr,
                    CompanyNameEn = w.CompanyNameEn,
                    LocationAr = w.LocationAr,
                    LocationEn = w.LocationEn,
                    WeightAr = w.WeightAr,
                    WeightEn = w.WeightEn,
                    Rating = w.Rating,
                    Reviews = w.Reviews,
                    Badge = w.Badge,
                    Specifications = w.Specifications,
                    SellerRating = w.SellerRating,
                    SellerTotalSales = w.SellerTotalSales,
                    SellerJoined = w.SellerJoined,
                    SellerWhatsapp = w.SellerWhatsapp,
                    Latitude = w.Latitude,
                    Longitude = w.Longitude,
                    LocationLink = w.LocationLink
                }).ToList();

                return Ok(new ApiResponse<List<WasteListingDto>>
                {
                    Success = true,
                    Message = "?? ????? ????? ????????",
                    Data = result,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting waste listings");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<List<WasteListingDto>>
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ????? ????????",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get waste listing by ID
        /// </summary>
        [HttpGet("waste-listings/{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<WasteListingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetWasteListing(long id)
        {
            try
            {
                var listing = await _context.WasteListings
                    .Include(w => w.Factory)
                    .FirstOrDefaultAsync(w => w.Id == id && w.Status == "Active");

                if (listing == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "??????? ??? ????? ?? ??? ???",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Increment view count
                listing.Views++;
                listing.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var result = new WasteListingDto
                {
                    Id = listing.Id,
                    Type = listing.Type,
                    TypeEn = listing.TypeEn,
                    Amount = listing.Amount,
                    Unit = listing.Unit,
                    Price = listing.Price,
                    Description = listing.Description,
                    Category = listing.Category,
                    ImageUrl = listing.ImageUrl,
                    Status = listing.Status,
                    FactoryId = listing.FactoryId,
                    FactoryName = listing.FactoryName,
                    CreatedAt = listing.CreatedAt,
                    UpdatedAt = listing.UpdatedAt,
                    ExpiresAt = listing.ExpiresAt,

                    // New multilingual fields
                    TitleAr = listing.TitleAr,
                    TitleEn = listing.TitleEn,
                    DescriptionAr = listing.DescriptionAr,
                    DescriptionEn = listing.DescriptionEn,
                    CompanyNameAr = listing.CompanyNameAr,
                    CompanyNameEn = listing.CompanyNameEn,
                    LocationAr = listing.LocationAr,
                    LocationEn = listing.LocationEn,
                    WeightAr = listing.WeightAr,
                    WeightEn = listing.WeightEn,
                    Rating = listing.Rating,
                    Reviews = listing.Reviews,
                    Badge = listing.Badge,
                    Specifications = listing.Specifications,
                    SellerRating = listing.SellerRating,
                    SellerTotalSales = listing.SellerTotalSales,
                    SellerJoined = listing.SellerJoined,
                    SellerWhatsapp = listing.SellerWhatsapp,
                    Latitude = listing.Latitude,
                    Longitude = listing.Longitude,
                    LocationLink = listing.LocationLink
                };

                return Ok(new ApiResponse<WasteListingDto>
                {
                    Success = true,
                    Message = "?? ????? ?????? ???????",
                    Data = result,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting waste listing {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<WasteListingDto>
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ?????? ???????",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Create a new waste listing
        /// </summary>
        [HttpPost("waste-listings")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<WasteListingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateWasteListing([FromBody] WasteListingCreateRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _logger.LogInformation("Starting CreateWasteListing");

                if (request == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "????? ??? ????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Get user ID from claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ???? ??",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Get user with factory
                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user?.Factory == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ?? ???? ???? ???? ????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validate factory is verified
                if (!user.Factory.IsVerified || user.Factory.Status != "approved")
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ????? ?????? ????? ??? ????? ?????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validate request data
                var validationErrors = new List<string>();

                if (string.IsNullOrWhiteSpace(request.Type))
                    validationErrors.Add("??? ???????? ?????");

                if (string.IsNullOrWhiteSpace(request.TypeEn))
                    validationErrors.Add("????? ????????? ???????? ?????");

                if (string.IsNullOrWhiteSpace(request.Unit))
                    validationErrors.Add("???? ?????? ??????");

                if (string.IsNullOrWhiteSpace(request.Category))
                    validationErrors.Add("????? ??????");

                if (request.Amount <= 0)
                    validationErrors.Add("?????? ??? ?? ???? ???? ?? ???");

                if (request.Price <= 0)
                    validationErrors.Add("????? ??? ?? ???? ???? ?? ???");

                if (validationErrors.Any())
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "???????? ??? ?????",
                        Errors = validationErrors,
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Create the listing
                var listing = new WasteListing
                {
                    Type = request.Type.Trim(),
                    TypeEn = request.TypeEn.Trim(),
                    Amount = request.Amount,
                    Unit = request.Unit.Trim(),
                    Price = request.Price,
                    FactoryId = user.Factory.Id,
                    FactoryName = user.Factory.FactoryName,
                    Location = user.Factory.Location ?? "",
                    Description = request.Description?.Trim() ?? "",
                    Category = request.Category.Trim(),
                    ImageUrl = request.ImageUrl?.Trim(),
                    Status = "Active",
                    Views = 0,
                    Offers = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(30),

                    // New multilingual fields with defaults
                    TitleAr = request.TitleAr ?? request.Type,
                    TitleEn = request.TitleEn ?? request.TypeEn,
                    DescriptionAr = request.DescriptionAr ?? request.Description,
                    DescriptionEn = request.DescriptionEn ?? request.Description,
                    CompanyNameAr = request.CompanyNameAr ?? user.Factory.FactoryName,
                    CompanyNameEn = request.CompanyNameEn ?? user.Factory.FactoryNameEn,
                    LocationAr = request.LocationAr ?? user.Factory.Location,
                    LocationEn = request.LocationEn ?? user.Factory.Location,
                    WeightAr = request.WeightAr ?? $"{request.Amount} {request.Unit}",
                    WeightEn = request.WeightEn ?? $"{request.Amount} {request.Unit}",
                    Rating = request.Rating ?? 0,
                    Reviews = request.Reviews ?? 0,
                    Badge = request.Badge,
                    Specifications = request.Specifications,
                    SellerRating = request.SellerRating ?? user.Factory.Rating ?? 0,
                    SellerTotalSales = request.SellerTotalSales ?? 0,
                    SellerJoined = request.SellerJoined ?? DateTime.UtcNow.Year.ToString(),
                    SellerWhatsapp = request.SellerWhatsapp ?? user.Factory.Phone,
                    Latitude = request.Latitude ?? user.Factory.Latitude,
                    Longitude = request.Longitude ?? user.Factory.Longitude,
                    LocationLink = request.LocationLink
                };

                await _context.WasteListings.AddAsync(listing);
                var saveResult = await _context.SaveChangesAsync();

                if (saveResult <= 0)
                {
                    throw new Exception("??? ?? ??? ??????? ?? ????? ????????");
                }

                await transaction.CommitAsync();

                _logger.LogInformation("Successfully created waste listing with ID: {ListingId}", listing.Id);

                var result = new WasteListingDto
                {
                    Id = listing.Id,
                    Type = listing.Type,
                    TypeEn = listing.TypeEn,
                    Amount = listing.Amount,
                    Unit = listing.Unit,
                    Price = listing.Price,
                    Description = listing.Description,
                    Category = listing.Category,
                    ImageUrl = listing.ImageUrl,
                    Status = listing.Status,
                    FactoryId = listing.FactoryId,
                    FactoryName = listing.FactoryName,
                    CreatedAt = listing.CreatedAt,
                    UpdatedAt = listing.UpdatedAt,
                    ExpiresAt = listing.ExpiresAt,

                    // New multilingual fields
                    TitleAr = listing.TitleAr,
                    TitleEn = listing.TitleEn,
                    DescriptionAr = listing.DescriptionAr,
                    DescriptionEn = listing.DescriptionEn,
                    CompanyNameAr = listing.CompanyNameAr,
                    CompanyNameEn = listing.CompanyNameEn,
                    LocationAr = listing.LocationAr,
                    LocationEn = listing.LocationEn,
                    WeightAr = listing.WeightAr,
                    WeightEn = listing.WeightEn,
                    Rating = listing.Rating,
                    Reviews = listing.Reviews,
                    Badge = listing.Badge,
                    Specifications = listing.Specifications,
                    SellerRating = listing.SellerRating,
                    SellerTotalSales = listing.SellerTotalSales,
                    SellerJoined = listing.SellerJoined,
                    SellerWhatsapp = listing.SellerWhatsapp,
                    Latitude = listing.Latitude,
                    Longitude = listing.Longitude,
                    LocationLink = listing.LocationLink
                };

                return Ok(new ApiResponse<WasteListingDto>
                {
                    Success = true,
                    Message = "?? ????? ??????? ?????",
                    Data = result,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error in CreateWasteListing");

                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ???????",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get marketplace categories with counts
        /// </summary>
        [HttpGet("categories")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(ApiResponse<List<CategoryDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetCategories()
        {
            try
            {
                var categoryGroups = await _context.WasteListings
                    .Where(w => w.Status == "Active")
                    .GroupBy(w => w.Category)
                    .Select(g => new CategoryDto
                    {
                        Id = g.Key,
                        Name = GetCategoryName(g.Key),
                        Count = g.Count(),
                        Icon = GetCategoryIcon(g.Key),
                        Color = GetCategoryColor(g.Key)
                    })
                    .ToListAsync();

                // If no categories found, return default list
                if (!categoryGroups.Any())
                {
                    categoryGroups = GetDefaultCategories();
                }

                return Ok(new ApiResponse<List<CategoryDto>>
                {
                    Success = true,
                    Message = "?? ????? ??????",
                    Data = categoryGroups,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");

                // Return default categories on error
                return Ok(new ApiResponse<List<CategoryDto>>
                {
                    Success = true,
                    Message = "?? ????? ?????? ??????????",
                    Data = GetDefaultCategories(),
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get my waste listings
        /// </summary>
        [HttpGet("my-listings")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<List<WasteListingDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyListings()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ???? ??",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user?.FactoryId == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ?? ???? ???? ???? ????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var listings = await _context.WasteListings
                    .Where(w => w.FactoryId == user.FactoryId)
                    .OrderByDescending(w => w.CreatedAt)
                    .ToListAsync();

                var result = listings.Select(w => new WasteListingDto
                {
                    Id = w.Id,
                    Type = w.Type,
                    TypeEn = w.TypeEn,
                    Amount = w.Amount,
                    Unit = w.Unit,
                    Price = w.Price,
                    Description = w.Description,
                    Category = w.Category,
                    ImageUrl = w.ImageUrl,
                    Status = w.Status,
                    FactoryId = w.FactoryId,
                    FactoryName = w.FactoryName,
                    CreatedAt = w.CreatedAt,
                    UpdatedAt = w.UpdatedAt,
                    ExpiresAt = w.ExpiresAt,

                    // New multilingual fields
                    TitleAr = w.TitleAr,
                    TitleEn = w.TitleEn,
                    DescriptionAr = w.DescriptionAr,
                    DescriptionEn = w.DescriptionEn,
                    CompanyNameAr = w.CompanyNameAr,
                    CompanyNameEn = w.CompanyNameEn,
                    LocationAr = w.LocationAr,
                    LocationEn = w.LocationEn,
                    WeightAr = w.WeightAr,
                    WeightEn = w.WeightEn,
                    Rating = w.Rating,
                    Reviews = w.Reviews,
                    Badge = w.Badge,
                    Specifications = w.Specifications,
                    SellerRating = w.SellerRating,
                    SellerTotalSales = w.SellerTotalSales,
                    SellerJoined = w.SellerJoined,
                    SellerWhatsapp = w.SellerWhatsapp,
                    Latitude = w.Latitude,
                    Longitude = w.Longitude,
                    LocationLink = w.LocationLink
                }).ToList();

                return Ok(new ApiResponse<List<WasteListingDto>>
                {
                    Success = true,
                    Message = "?? ????? ????????",
                    Data = result,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting my listings");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<List<WasteListingDto>>
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ????????",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Update waste listing
        /// </summary>
        [HttpPut("waste-listings/{id}")]
        [Authorize]
        [ProducesResponseType(typeof(ApiResponse<WasteListingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateWasteListing(long id, [FromBody] WasteListingUpdateRequest request)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ???? ??",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user?.FactoryId == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ?? ???? ???? ???? ????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var listing = await _context.WasteListings
                    .FirstOrDefaultAsync(w => w.Id == id && w.FactoryId == user.FactoryId);

                if (listing == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "??????? ??? ????? ?? ??? ???? ?????? ???????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Update fields if provided
                if (!string.IsNullOrEmpty(request.Type))
                    listing.Type = request.Type.Trim();

                if (!string.IsNullOrEmpty(request.TypeEn))
                    listing.TypeEn = request.TypeEn.Trim();

                if (request.Amount.HasValue && request.Amount.Value > 0)
                    listing.Amount = request.Amount.Value;

                if (!string.IsNullOrEmpty(request.Unit))
                    listing.Unit = request.Unit.Trim();

                if (request.Price.HasValue && request.Price.Value > 0)
                    listing.Price = request.Price.Value;

                if (request.Description != null)
                    listing.Description = request.Description.Trim();

                if (!string.IsNullOrEmpty(request.Category))
                    listing.Category = request.Category.Trim();

                if (request.ImageUrl != null)
                    listing.ImageUrl = request.ImageUrl?.Trim();

                if (!string.IsNullOrEmpty(request.Status))
                    listing.Status = request.Status;

                // Update new multilingual fields
                if (!string.IsNullOrEmpty(request.TitleAr))
                    listing.TitleAr = request.TitleAr.Trim();

                if (!string.IsNullOrEmpty(request.TitleEn))
                    listing.TitleEn = request.TitleEn.Trim();

                if (!string.IsNullOrEmpty(request.DescriptionAr))
                    listing.DescriptionAr = request.DescriptionAr.Trim();

                if (!string.IsNullOrEmpty(request.DescriptionEn))
                    listing.DescriptionEn = request.DescriptionEn.Trim();

                if (!string.IsNullOrEmpty(request.CompanyNameAr))
                    listing.CompanyNameAr = request.CompanyNameAr.Trim();

                if (!string.IsNullOrEmpty(request.CompanyNameEn))
                    listing.CompanyNameEn = request.CompanyNameEn.Trim();

                if (!string.IsNullOrEmpty(request.LocationAr))
                    listing.LocationAr = request.LocationAr.Trim();

                if (!string.IsNullOrEmpty(request.LocationEn))
                    listing.LocationEn = request.LocationEn.Trim();

                if (!string.IsNullOrEmpty(request.WeightAr))
                    listing.WeightAr = request.WeightAr.Trim();

                if (!string.IsNullOrEmpty(request.WeightEn))
                    listing.WeightEn = request.WeightEn.Trim();

                if (request.Rating.HasValue)
                    listing.Rating = request.Rating.Value;

                if (request.Reviews.HasValue)
                    listing.Reviews = request.Reviews.Value;

                if (!string.IsNullOrEmpty(request.Badge))
                    listing.Badge = request.Badge.Trim();

                if (!string.IsNullOrEmpty(request.Specifications))
                    listing.Specifications = request.Specifications;

                if (request.SellerRating.HasValue)
                    listing.SellerRating = request.SellerRating.Value;

                if (request.SellerTotalSales.HasValue)
                    listing.SellerTotalSales = request.SellerTotalSales.Value;

                if (!string.IsNullOrEmpty(request.SellerJoined))
                    listing.SellerJoined = request.SellerJoined.Trim();

                if (!string.IsNullOrEmpty(request.SellerWhatsapp))
                    listing.SellerWhatsapp = request.SellerWhatsapp.Trim();

                if (request.Latitude.HasValue)
                    listing.Latitude = request.Latitude.Value;

                if (request.Longitude.HasValue)
                    listing.Longitude = request.Longitude.Value;

                if (!string.IsNullOrEmpty(request.LocationLink))
                    listing.LocationLink = request.LocationLink.Trim();

                listing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                var result = new WasteListingDto
                {
                    Id = listing.Id,
                    Type = listing.Type,
                    TypeEn = listing.TypeEn,
                    Amount = listing.Amount,
                    Unit = listing.Unit,
                    Price = listing.Price,
                    Description = listing.Description,
                    Category = listing.Category,
                    ImageUrl = listing.ImageUrl,
                    Status = listing.Status,
                    FactoryId = listing.FactoryId,
                    FactoryName = listing.FactoryName,
                    CreatedAt = listing.CreatedAt,
                    UpdatedAt = listing.UpdatedAt,
                    ExpiresAt = listing.ExpiresAt,

                    // New multilingual fields
                    TitleAr = listing.TitleAr,
                    TitleEn = listing.TitleEn,
                    DescriptionAr = listing.DescriptionAr,
                    DescriptionEn = listing.DescriptionEn,
                    CompanyNameAr = listing.CompanyNameAr,
                    CompanyNameEn = listing.CompanyNameEn,
                    LocationAr = listing.LocationAr,
                    LocationEn = listing.LocationEn,
                    WeightAr = listing.WeightAr,
                    WeightEn = listing.WeightEn,
                    Rating = listing.Rating,
                    Reviews = listing.Reviews,
                    Badge = listing.Badge,
                    Specifications = listing.Specifications,
                    SellerRating = listing.SellerRating,
                    SellerTotalSales = listing.SellerTotalSales,
                    SellerJoined = listing.SellerJoined,
                    SellerWhatsapp = listing.SellerWhatsapp,
                    Latitude = listing.Latitude,
                    Longitude = listing.Longitude,
                    LocationLink = listing.LocationLink
                };

                return Ok(new ApiResponse<WasteListingDto>
                {
                    Success = true,
                    Message = "?? ????? ??????? ?????",
                    Data = result,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating waste listing {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<WasteListingDto>
                {
                    Success = false,
                    Message = "??? ??? ????? ????? ???????",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpGet("debug-table")]
        [AllowAnonymous]
        public async Task<IActionResult> DebugTable()
        {
            var results = new Dictionary<string, object>();

            try
            {
                // Test 1: Check if DbSet is configured
                results["DbContext Type"] = _context.GetType().Name;
                results["DbSet exists"] = _context.WasteListings != null;

                // Test 2: Try raw SQL to check table
                var connectionString = _context.Database.GetConnectionString();
                results["Connection String"] = connectionString?.Replace("Password=", "Password=***");

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    results["Database Connection"] = "Success";

                    // Check if table exists
                    var cmd = connection.CreateCommand();
                    cmd.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'WasteListings'";
                    var tableExists = (int)await cmd.ExecuteScalarAsync();
                    results["Table Exists in DB"] = tableExists > 0;

                    if (tableExists > 0)
                    {
                        // Get table schema
                        cmd.CommandText = @"
                    SELECT COLUMN_NAME, DATA_TYPE 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'WasteListings'
                    ORDER BY ORDINAL_POSITION";

                        var columns = new List<string>();
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                columns.Add($"{reader.GetString(0)} ({reader.GetString(1)})");
                            }
                        }
                        results["Table Columns"] = columns;

                        // Try to count records
                        cmd.CommandText = "SELECT COUNT(*) FROM WasteListings";
                        var recordCount = (int)await cmd.ExecuteScalarAsync();
                        results["Record Count (Raw SQL)"] = recordCount;
                    }
                }

                // Test 3: Try EF query
                try
                {
                    var efCount = await _context.WasteListings.CountAsync();
                    results["EF Count"] = efCount;
                    results["EF Working"] = true;
                }
                catch (Exception efEx)
                {
                    results["EF Error"] = efEx.Message;
                    results["EF Inner Error"] = efEx.InnerException?.Message;
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message, Inner = ex.InnerException?.Message });
            }
        }

        [HttpGet("diagnose-connection")]
        [AllowAnonymous]
        public async Task<IActionResult> DiagnoseConnection()
        {
            try
            {
                var results = new Dictionary<string, object>();
                var connectionString = _context.Database.GetConnectionString();
                results["Connection String"] = connectionString?.Replace("Password=", "Password=***");

                // Get the actual connection details
                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    // Get server name
                    var cmd = connection.CreateCommand();
                    cmd.CommandText = "SELECT @@SERVERNAME AS ServerName, DB_NAME() AS DatabaseName, @@VERSION AS Version";
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        if (await reader.ReadAsync())
                        {
                            results["Connected Server"] = reader["ServerName"].ToString();
                            results["Connected Database"] = reader["DatabaseName"].ToString();
                            results["SQL Version"] = reader["Version"].ToString()?.Split('\n')[0];
                        }
                    }

                    // List all databases on this server
                    cmd.CommandText = "SELECT name FROM sys.databases";
                    var databases = new List<string>();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            databases.Add(reader.GetString(0));
                        }
                    }
                    results["Available Databases"] = databases;

                    // Check if WasteListings exists in current database
                    cmd.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'WasteListings'";
                    var tableExists = (int)await cmd.ExecuteScalarAsync();
                    results["WasteListings in current DB"] = tableExists > 0;

                    // If not in current DB, search all databases
                    if (!(tableExists > 0))
                    {
                        results["Searching other databases..."] = true;
                        var foundIn = new List<string>();

                        foreach (var db in databases)
                        {
                            if (db != results["Connected Database"].ToString())
                            {
                                try
                                {
                                    cmd.CommandText = $"USE [{db}]; SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'WasteListings'";
                                    var count = (int)await cmd.ExecuteScalarAsync();
                                    if (count > 0)
                                    {
                                        foundIn.Add(db);
                                    }
                                }
                                catch { /* Skip databases we can't access */ }
                            }
                        }

                        if (foundIn.Any())
                        {
                            results["WasteListings found in"] = foundIn;

                            // Get sample from that database
                            var firstDb = foundIn.First();
                            cmd.CommandText = $"USE [{firstDb}]; SELECT TOP 3 * FROM WasteListings";
                            try
                            {
                                using (var reader = await cmd.ExecuteReaderAsync())
                                {
                                    var samples = new List<object>();
                                    while (await reader.ReadAsync())
                                    {
                                        samples.Add(new
                                        {
                                            Id = reader["Id"],
                                            Type = reader["Type"],
                                            FactoryName = reader["FactoryName"]
                                        });
                                    }
                                    results[$"Sample from {firstDb}"] = samples;
                                }
                            }
                            catch (Exception ex)
                            {
                                results[$"Error reading from {firstDb}"] = ex.Message;
                            }
                        }
                    }
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message, Inner = ex.InnerException?.Message });
            }
        }
        [HttpPost("waste-listings")]
        [Authorize]
        public async Task<IActionResult> CreateWasteListing([FromBody] WasteListingCreateRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                _logger.LogInformation("Starting CreateWasteListing");
                _logger.LogInformation($"Request data: {System.Text.Json.JsonSerializer.Serialize(request)}");

                if (request == null)
                {
                    _logger.LogWarning("Request is null");
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "البيانات مطلوبة",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Get user ID from claims
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    _logger.LogWarning("User ID not found in claims");
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "غير مصرح به",
                        Timestamp = DateTime.UtcNow
                    });
                }

                _logger.LogInformation($"User ID from token: {userId}");

                // Get user with factory
                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user?.Factory == null)
                {
                    _logger.LogWarning($"Factory not found for user {userId}");
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "ليس لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                _logger.LogInformation($"Found factory: {user.Factory.Id}, Verified: {user.Factory.IsVerified}, Status: {user.Factory.Status}");

                // Validate factory is verified
                if (!user.Factory.IsVerified || user.Factory.Status != "approved")
                {
                    _logger.LogWarning($"Factory {user.Factory.Id} is not verified");
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب أن يكون المصنع موثقا قبل نشر الإعلان",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validate request data
                var validationErrors = new List<string>();

                if (string.IsNullOrWhiteSpace(request.Type))
                    validationErrors.Add("نوع المخلفات مطلوب");

                if (string.IsNullOrWhiteSpace(request.Unit))
                    validationErrors.Add("وحدة القياس مطلوبة");

                if (string.IsNullOrWhiteSpace(request.Category))
                    validationErrors.Add("الفئة مطلوبة");

                if (request.Amount <= 0)
                    validationErrors.Add("الكمية يجب أن تكون أكبر من صفر");

                if (request.Price <= 0)
                    validationErrors.Add("السعر يجب أن يكون أكبر من صفر");

                if (validationErrors.Any())
                {
                    _logger.LogWarning($"Validation errors: {string.Join(", ", validationErrors)}");
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "تحقق من البيانات المدخلة",
                        Errors = validationErrors,
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Create the listing
                var listing = new WasteListing
                {
                    Type = request.Type.Trim(),
                    TypeEn = request.TypeEn?.Trim() ?? request.Type.Trim(),
                    Amount = request.Amount,
                    Unit = request.Unit.Trim(),
                    Price = request.Price,
                    FactoryId = user.Factory.Id,
                    FactoryName = user.Factory.FactoryName,
                    Location = user.Factory.Location ?? "",
                    Description = request.Description?.Trim() ?? "",
                    Category = request.Category.Trim(),
                    ImageUrl = request.ImageUrl?.Trim(),
                    Status = "Active",
                    Views = 0,
                    Offers = 0,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(30),

                    // New multilingual fields
                    TitleAr = request.TitleAr ?? request.Type,
                    TitleEn = request.TitleEn ?? request.TypeEn,
                    DescriptionAr = request.DescriptionAr ?? request.Description,
                    DescriptionEn = request.DescriptionEn ?? request.Description,
                    CompanyNameAr = request.CompanyNameAr ?? user.Factory.FactoryName,
                    CompanyNameEn = request.CompanyNameEn ?? user.Factory.FactoryNameEn,
                    LocationAr = request.LocationAr ?? user.Factory.Location,
                    LocationEn = request.LocationEn ?? user.Factory.Location,
                    WeightAr = request.WeightAr ?? $"{request.Amount} {request.Unit}",
                    WeightEn = request.WeightEn ?? $"{request.Amount} {request.Unit}",
                    Rating = request.Rating ?? 0,
                    Reviews = request.Reviews ?? 0,
                    Badge = request.Badge,
                    Specifications = request.Specifications,
                    SellerRating = request.SellerRating ?? user.Factory.Rating ?? 0,
                    SellerTotalSales = request.SellerTotalSales ?? 0,
                    SellerJoined = request.SellerJoined ?? DateTime.UtcNow.Year.ToString(),
                    SellerWhatsapp = request.SellerWhatsapp ?? user.Factory.Phone,
                    Latitude = request.Latitude ?? user.Factory.Latitude,
                    Longitude = request.Longitude ?? user.Factory.Longitude,
                    LocationLink = request.LocationLink
                };

                _logger.LogInformation("Adding listing to database");
                await _context.WasteListings.AddAsync(listing);

                _logger.LogInformation("Saving changes to database");
                var saveResult = await _context.SaveChangesAsync();

                if (saveResult <= 0)
                {
                    throw new Exception("فشل في حفظ البيانات في قاعدة البيانات");
                }

                await transaction.CommitAsync();

                _logger.LogInformation($"Successfully created waste listing with ID: {listing.Id}");

                var result = new WasteListingDto
                {
                    Id = listing.Id,
                    Type = listing.Type,
                    TypeEn = listing.TypeEn,
                    Amount = listing.Amount,
                    Unit = listing.Unit,
                    Price = listing.Price,
                    Description = listing.Description,
                    Category = listing.Category,
                    ImageUrl = listing.ImageUrl,
                    Status = listing.Status,
                    FactoryId = listing.FactoryId,
                    FactoryName = listing.FactoryName,
                    CreatedAt = listing.CreatedAt,
                    UpdatedAt = listing.UpdatedAt,
                    ExpiresAt = listing.ExpiresAt,

                    TitleAr = listing.TitleAr,
                    TitleEn = listing.TitleEn,
                    DescriptionAr = listing.DescriptionAr,
                    DescriptionEn = listing.DescriptionEn,
                    CompanyNameAr = listing.CompanyNameAr,
                    CompanyNameEn = listing.CompanyNameEn,
                    LocationAr = listing.LocationAr,
                    LocationEn = listing.LocationEn,
                    WeightAr = listing.WeightAr,
                    WeightEn = listing.WeightEn,
                    Rating = listing.Rating,
                    Reviews = listing.Reviews,
                    Badge = listing.Badge,
                    Specifications = listing.Specifications,
                    SellerRating = listing.SellerRating,
                    SellerTotalSales = listing.SellerTotalSales,
                    SellerJoined = listing.SellerJoined,
                    SellerWhatsapp = listing.SellerWhatsapp,
                    Latitude = listing.Latitude,
                    Longitude = listing.Longitude,
                    LocationLink = listing.LocationLink
                };

                return Ok(new ApiResponse<WasteListingDto>
                {
                    Success = true,
                    Message = "تم نشر الإعلان بنجاح",
                    Data = result,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error in CreateWasteListing");
                _logger.LogError($"Exception message: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                if (ex.InnerException != null)
                {
                    _logger.LogError($"Inner exception: {ex.InnerException.Message}");
                }

                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ داخلي في الخادم",
                    Errors = new List<string> { ex.Message, ex.InnerException?.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        [HttpDelete("waste-listings/{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteWasteListing(long id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ???? ??",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var user = await _context.Users
                    .FirstOrDefaultAsync(u => u.Id == userId);

                if (user?.FactoryId == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "??? ?? ???? ???? ???? ????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var listing = await _context.WasteListings
                    .FirstOrDefaultAsync(w => w.Id == id && w.FactoryId == user.FactoryId);

                if (listing == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "??????? ??? ????? ?? ??? ???? ?????? ?????",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Soft delete
                listing.Status = "Deleted";
                listing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "?? ??? ??????? ?????",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting waste listing {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
                {
                    Success = false,
                    Message = "??? ??? ????? ??? ???????",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        #region Helper Methods

        private string GetCategoryName(string category)
        {
            return category?.ToLower() switch
            {
                "plastic" => "???????",
                "oil" => "????",
                "paper" => "???",
                "metal" => "?????",
                "glass" => "????",
                "textile" => "???????",
                "organic" => "?????? ?????",
                "electronic" => "?????? ?????????",
                "chemical" => "???? ????????",
                "wood" => "???",
                "rubber" => "????",
                _ => category ?? "????"
            };
        }

        private string GetCategoryIcon(string category)
        {
            return category?.ToLower() switch
            {
                "plastic" => "Recycle",
                "oil" => "Droplet",
                "paper" => "FileText",
                "metal" => "Shield",
                "glass" => "FlaskConical",
                "textile" => "Scissors",
                "organic" => "Leaf",
                "electronic" => "Cpu",
                "chemical" => "Flask",
                "wood" => "Trees",
                "rubber" => "Package",
                _ => "Package"
            };
        }

        private string GetCategoryColor(string category)
        {
            return category?.ToLower() switch
            {
                "plastic" => "blue",
                "oil" => "amber",
                "paper" => "emerald",
                "metal" => "slate",
                "glass" => "cyan",
                "textile" => "pink",
                "organic" => "lime",
                "electronic" => "violet",
                "chemical" => "red",
                "wood" => "orange",
                "rubber" => "gray",
                _ => "gray"
            };
        }

        private List<CategoryDto> GetDefaultCategories()
        {
            return new List<CategoryDto>
            {
                new CategoryDto { Id = "plastic", Name = "???????", Count = 0, Icon = "Recycle", Color = "blue" },
                new CategoryDto { Id = "metal", Name = "?????", Count = 0, Icon = "Shield", Color = "slate" },
                new CategoryDto { Id = "paper", Name = "???", Count = 0, Icon = "FileText", Color = "emerald" },
                new CategoryDto { Id = "glass", Name = "????", Count = 0, Icon = "FlaskConical", Color = "cyan" },
                new CategoryDto { Id = "wood", Name = "???", Count = 0, Icon = "Trees", Color = "orange" },
                new CategoryDto { Id = "textile", Name = "???????", Count = 0, Icon = "Scissors", Color = "pink" },
                new CategoryDto { Id = "chemical", Name = "????????", Count = 0, Icon = "Flask", Color = "red" }
            };
        }

        #endregion
    }
}
