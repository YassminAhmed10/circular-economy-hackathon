using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Models.Entities;
using System.Security.Claims;

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
                // Get current user's factory using RAW SQL to avoid EF issues
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                long? factoryId = null;

                if (!string.IsNullOrEmpty(userIdClaim) && long.TryParse(userIdClaim, out var userId))
                {
                    // ⭐⭐⭐ USE RAW SQL - NO EF ISSUES ⭐⭐⭐
                    factoryId = await GetUserFactoryIdRawSql(userId);
                }

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
                                           w.FactoryName.Contains(search));
                }

                // Get total count for pagination
                var totalCount = await query.CountAsync();

                // Apply pagination
                var listings = await query
                    .OrderByDescending(w => w.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = listings.Select(w => new WasteListingDto
                {
                    Id = w.Id,
                    Type = w.Type,
                    TypeEn = w.TypeEn ?? w.Type,
                    Amount = w.Amount,
                    Unit = w.Unit,
                    Price = w.Price,
                    Description = w.Description,
                    Category = w.Category,
                    ImageUrl = w.ImageUrl,
                    ImageBase64 = null,
                    Status = w.Status,
                    FactoryId = w.FactoryId,
                    FactoryName = w.FactoryName,
                    CreatedAt = w.CreatedAt,
                    UpdatedAt = w.UpdatedAt,
                    ExpiresAt = w.ExpiresAt
                }).ToList();

                return Ok(new ApiResponse<List<WasteListingDto>>
                {
                    Success = true,
                    Message = "تم تحميل قائمة النفايات",
                    Data = result,
                    Timestamp = DateTime.UtcNow,
                    Errors = new List<string>()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting waste listings");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<List<WasteListingDto>>
                {
                    Success = false,
                    Message = "حدث خطأ أثناء تحميل قائمة النفايات",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get waste listing by ID
        /// </summary>
        [HttpGet("waste-listings/{id}")]
        [ProducesResponseType(typeof(ApiResponse<WasteListingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetWasteListing(long id)
        {
            try
            {
                // Get current user's factory using RAW SQL
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                long? factoryId = null;
                if (!string.IsNullOrEmpty(userIdClaim) && long.TryParse(userIdClaim, out var userId))
                {
                    factoryId = await GetUserFactoryIdRawSql(userId);
                }

                var listing = await _context.WasteListings
                    .Include(w => w.Factory)
                    .FirstOrDefaultAsync(w => w.Id == id && w.Status == "Active");

                if (listing == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "الإعلان غير موجود أو غير نشط",
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
                    TypeEn = listing.TypeEn ?? listing.Type,
                    Amount = listing.Amount,
                    Unit = listing.Unit,
                    Price = listing.Price,
                    Description = listing.Description,
                    Category = listing.Category,
                    ImageUrl = listing.ImageUrl,
                    ImageBase64 = null,
                    Status = listing.Status,
                    FactoryId = listing.FactoryId,
                    FactoryName = listing.FactoryName,
                    CreatedAt = listing.CreatedAt,
                    UpdatedAt = listing.UpdatedAt,
                    ExpiresAt = listing.ExpiresAt
                };

                return Ok(new ApiResponse<WasteListingDto>
                {
                    Success = true,
                    Message = "تم تحميل تفاصيل الإعلان",
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
                    Message = "حدث خطأ أثناء تحميل تفاصيل الإعلان",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Create new waste listing - WORKING VERSION
        /// </summary>
        [HttpPost("waste-listings")]
        [ProducesResponseType(typeof(ApiResponse<WasteListingDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateWasteListing([FromBody] WasteListingCreateRequest request)
        {
            try
            {
                // Get current user's factory
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !long.TryParse(userIdClaim, out var userId))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "غير مصرح به",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // ⭐⭐⭐ USE RAW SQL - NO EF ISSUES ⭐⭐⭐
                var factoryId = await GetUserFactoryIdRawSql(userId);

                if (factoryId == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب أن يكون لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Get factory
                var factory = await _context.Factories
                    .FirstOrDefaultAsync(f => f.Id == factoryId);

                if (factory == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "المصنع غير موجود",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validate request
                if (string.IsNullOrEmpty(request.Type) || request.Amount <= 0 || request.Price <= 0)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "البيانات غير صحيحة. يرجى التحقق من النوع والكمية والسعر",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Create new waste listing
                var listing = new WasteListing
                {
                    Type = request.Type,
                    TypeEn = request.TypeEn ?? request.Type,
                    Amount = request.Amount,
                    Unit = request.Unit,
                    Price = request.Price,
                    FactoryId = factory.Id,
                    FactoryName = factory.FactoryName,
                    Location = factory.Location,
                    Description = request.Description,
                    Category = request.Category,
                    ImageUrl = request.ImageUrl,
                    Status = "Active",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                    ExpiresAt = DateTime.UtcNow.AddDays(30),
                    Views = 0,
                    Offers = 0
                };

                await _context.WasteListings.AddAsync(listing);
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
                    ImageBase64 = null,
                    Status = listing.Status,
                    FactoryId = listing.FactoryId,
                    FactoryName = listing.FactoryName,
                    CreatedAt = listing.CreatedAt,
                    UpdatedAt = listing.UpdatedAt,
                    ExpiresAt = listing.ExpiresAt
                };

                return Ok(new ApiResponse<WasteListingDto>
                {
                    Success = true,
                    Message = "تم إنشاء الإعلان بنجاح",
                    Data = result,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CreateWasteListing: {Message}", ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<WasteListingDto>
                {
                    Success = false,
                    Message = "حدث خطأ أثناء إنشاء الإعلان",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get marketplace categories with counts
        /// </summary>
        [HttpGet("categories")]
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

                return Ok(new ApiResponse<List<CategoryDto>>
                {
                    Success = true,
                    Message = "تم تحميل الفئات",
                    Data = categoryGroups,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting categories");
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse<List<CategoryDto>>
                {
                    Success = false,
                    Message = "حدث خطأ أثناء تحميل الفئات",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get my waste listings
        /// </summary>
        [HttpGet("my-listings")]
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
                        Message = "غير مصرح به",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // ⭐⭐⭐ USE RAW SQL - NO EF ISSUES ⭐⭐⭐
                var factoryId = await GetUserFactoryIdRawSql(userId);

                if (factoryId == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب أن يكون لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var listings = await _context.WasteListings
                    .Where(w => w.FactoryId == factoryId)
                    .OrderByDescending(w => w.CreatedAt)
                    .ToListAsync();

                var result = listings.Select(w => new WasteListingDto
                {
                    Id = w.Id,
                    Type = w.Type,
                    TypeEn = w.TypeEn ?? w.Type,
                    Amount = w.Amount,
                    Unit = w.Unit,
                    Price = w.Price,
                    Description = w.Description,
                    Category = w.Category,
                    ImageUrl = w.ImageUrl,
                    ImageBase64 = null,
                    Status = w.Status,
                    FactoryId = w.FactoryId,
                    FactoryName = w.FactoryName,
                    CreatedAt = w.CreatedAt,
                    UpdatedAt = w.UpdatedAt,
                    ExpiresAt = w.ExpiresAt
                }).ToList();

                return Ok(new ApiResponse<List<WasteListingDto>>
                {
                    Success = true,
                    Message = "تم تحميل إعلاناتك",
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
                    Message = "حدث خطأ أثناء تحميل إعلاناتك",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Update waste listing
        /// </summary>
        [HttpPut("waste-listings/{id}")]
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
                        Message = "غير مصرح به",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // ⭐⭐⭐ USE RAW SQL - NO EF ISSUES ⭐⭐⭐
                var factoryId = await GetUserFactoryIdRawSql(userId);

                if (factoryId == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب أن يكون لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var listing = await _context.WasteListings
                    .FirstOrDefaultAsync(w => w.Id == id && w.FactoryId == factoryId);

                if (listing == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "الإعلان غير موجود أو ليس لديك صلاحية لتعديله",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Update fields if provided
                if (!string.IsNullOrEmpty(request.Type))
                    listing.Type = request.Type;

                if (request.TypeEn != null)
                    listing.TypeEn = request.TypeEn;

                if (request.Amount.HasValue)
                    listing.Amount = request.Amount.Value;

                if (!string.IsNullOrEmpty(request.Unit))
                    listing.Unit = request.Unit;

                if (request.Price.HasValue)
                    listing.Price = request.Price.Value;

                if (!string.IsNullOrEmpty(request.Description))
                    listing.Description = request.Description;

                if (!string.IsNullOrEmpty(request.Category))
                    listing.Category = request.Category;

                if (request.ImageUrl != null)
                    listing.ImageUrl = request.ImageUrl;

                if (!string.IsNullOrEmpty(request.Status))
                    listing.Status = request.Status;

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
                    ImageBase64 = null,
                    Status = listing.Status,
                    FactoryId = listing.FactoryId,
                    FactoryName = listing.FactoryName,
                    CreatedAt = listing.CreatedAt,
                    UpdatedAt = listing.UpdatedAt,
                    ExpiresAt = listing.ExpiresAt
                };

                return Ok(new ApiResponse<WasteListingDto>
                {
                    Success = true,
                    Message = "تم تحديث الإعلان بنجاح",
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
                    Message = "حدث خطأ أثناء تحديث الإعلان",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        #region Helper Methods

        // ⭐⭐⭐ RAW SQL HELPER - AVOIDS ALL EF ISSUES ⭐⭐⭐
        private async Task<long?> GetUserFactoryIdRawSql(long userId)
        {
            try
            {
                // Use raw SQL to avoid EF column mapping issues
                var result = await _context.Database
                    .SqlQuery<long?>($"SELECT FactoryId FROM Users WHERE Id = {userId}")
                    .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting factory ID for user {UserId}", userId);
                return null;
            }
        }

        private string GetCategoryName(string category)
        {
            return category switch
            {
                "plastic" => "بلاستيك",
                "oil" => "زيوت",
                "paper" => "ورق وكرتون",
                "metal" => "معادن",
                "glass" => "زجاج",
                "textile" => "منسوجات",
                "organic" => "نفايات عضوية",
                "electronic" => "نفايات إلكترونية",
                "chemical" => "مواد كيميائية",
                _ => category
            };
        }

        private string GetCategoryIcon(string category)
        {
            return category switch
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
                _ => "Package"
            };
        }

        private string GetCategoryColor(string category)
        {
            return category switch
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
                _ => "gray"
            };
        }

        #endregion
    }
}