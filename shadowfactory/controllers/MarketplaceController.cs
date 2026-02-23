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
                                           w.FactoryName.Contains(search));
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
                    ExpiresAt = w.ExpiresAt
                }).ToList();

                return Ok(new ApiResponse<List<WasteListingDto>>
                {
                    Success = true,
                    Message = "تم تحميل قائمة النفايات",
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
                        Message = "الطلب غير صالح",
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
                        Message = "غير مصرح به",
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
                        Message = "يجب أن يكون لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validate factory is verified
                if (!user.Factory.Verified || user.Factory.Status != "approved")
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب توثيق المصنع أولاً قبل إنشاء إعلان",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validate request data
                var validationErrors = new List<string>();

                if (string.IsNullOrWhiteSpace(request.Type))
                    validationErrors.Add("نوع النفايات مطلوب");

                if (string.IsNullOrWhiteSpace(request.TypeEn))
                    validationErrors.Add("الاسم الإنجليزي للنفايات مطلوب");

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
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "البيانات غير صحيحة",
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
                    ExpiresAt = DateTime.UtcNow.AddDays(30)
                };

                await _context.WasteListings.AddAsync(listing);
                var saveResult = await _context.SaveChangesAsync();

                if (saveResult <= 0)
                {
                    throw new Exception("فشل في حفظ الإعلان في قاعدة البيانات");
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
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error in CreateWasteListing");

                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
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
                    Message = "تم تحميل الفئات",
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
                    Message = "تم تحميل الفئات الافتراضية",
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
                        Message = "غير مصرح به",
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
                        Message = "يجب أن يكون لديك مصنع مسجل",
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
                        Message = "غير مصرح به",
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
                        Message = "يجب أن يكون لديك مصنع مسجل",
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
                        Message = "الإعلان غير موجود أو ليس لديك صلاحية لتعديله",
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

        /// <summary>
        /// Delete waste listing (soft delete)
        /// </summary>
        [HttpDelete("waste-listings/{id}")]
        [Authorize]
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
                        Message = "غير مصرح به",
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
                        Message = "يجب أن يكون لديك مصنع مسجل",
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
                        Message = "الإعلان غير موجود أو ليس لديك صلاحية لحذفه",
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
                    Message = "تم حذف الإعلان بنجاح",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting waste listing {Id}", id);
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء حذف الإعلان",
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
                "plastic" => "بلاستيك",
                "oil" => "زيوت",
                "paper" => "ورق",
                "metal" => "معادن",
                "glass" => "زجاج",
                "textile" => "منسوجات",
                "organic" => "نفايات عضوية",
                "electronic" => "نفايات إلكترونية",
                "chemical" => "مواد كيميائية",
                "wood" => "خشب",
                "rubber" => "مطاط",
                _ => category ?? "أخرى"
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
                new CategoryDto { Id = "plastic", Name = "بلاستيك", Count = 0, Icon = "Recycle", Color = "blue" },
                new CategoryDto { Id = "metal", Name = "معادن", Count = 0, Icon = "Shield", Color = "slate" },
                new CategoryDto { Id = "paper", Name = "ورق", Count = 0, Icon = "FileText", Color = "emerald" },
                new CategoryDto { Id = "glass", Name = "زجاج", Count = 0, Icon = "FlaskConical", Color = "cyan" },
                new CategoryDto { Id = "wood", Name = "خشب", Count = 0, Icon = "Trees", Color = "orange" },
                new CategoryDto { Id = "textile", Name = "منسوجات", Count = 0, Icon = "Scissors", Color = "pink" },
                new CategoryDto { Id = "chemical", Name = "كيماويات", Count = 0, Icon = "Flask", Color = "red" }
            };
        }

        #endregion
    }
}