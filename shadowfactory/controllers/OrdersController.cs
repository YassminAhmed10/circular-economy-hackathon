using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
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
    public class OrdersController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<OrdersController> _logger;

        public OrdersController(ECoVDbContext context, ILogger<OrdersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET /api/orders
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyOrders(
            [FromQuery] OrderFilterRequest filter,
            [FromQuery] string type = "all")
        {
            try
            {
                var (user, authError) = await ResolveUser();
                if (authError != null) return authError;

                bool isAdmin = user!.Role == "Admin";

                if (!isAdmin && user.FactoryId == null)
                    return BadRequest(ApiError("يجب أن يكون لديك مصنع مسجل"));

                IQueryable<Order> query = _context.Orders
                    .Include(o => o.WasteListing)
                    .Include(o => o.SellerFactory)
                    .Include(o => o.BuyerFactory);

                if (!isAdmin)
                {
                    var fid = user.FactoryId!.Value;
                    query = query.Where(o => o.BuyerFactoryId == fid || o.SellerFactoryId == fid);
                }

                if (type.ToLower() == "direct")
                    query = query.Where(o => o.OrderType == "direct");
                else if (type.ToLower() == "recycler")
                    query = query.Where(o => o.OrderType == "recycler");

                if (!string.IsNullOrEmpty(filter.Status))
                    query = query.Where(o => o.Status == filter.Status);

                if (filter.FromDate.HasValue)
                    query = query.Where(o => o.OrderDate >= filter.FromDate.Value);

                if (filter.ToDate.HasValue)
                    query = query.Where(o => o.OrderDate <= filter.ToDate.Value);

                if (!string.IsNullOrEmpty(filter.SearchTerm))
                    query = query.Where(o =>
                        o.OrderNumber.Contains(filter.SearchTerm) ||
                        (o.WasteType != null && o.WasteType.Contains(filter.SearchTerm)) ||
                        (o.BuyerName != null && o.BuyerName.Contains(filter.SearchTerm)) ||
                        (o.SellerName != null && o.SellerName.Contains(filter.SearchTerm)));

                var totalCount = await query.CountAsync();

                var orders = await query
                    .OrderByDescending(o => o.OrderDate)
                    .Skip((filter.Page - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                var dtos = orders.Select(o => MapToDto(o)).ToList();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Orders loaded successfully",
                    Data = new
                    {
                        Items = dtos,
                        TotalCount = totalCount,
                        Page = filter.Page,
                        PageSize = filter.PageSize,
                        TotalPages = (int)Math.Ceiling(totalCount / (double)filter.PageSize)
                    },
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting orders");
                return StatusCode(500, ApiError("Error loading orders", ex));
            }
        }

        // GET /api/orders/stats
        [HttpGet("stats")]
        public async Task<IActionResult> GetOrderStats()
        {
            try
            {
                var (user, authError) = await ResolveUser();
                if (authError != null) return authError;
                
                bool isAdmin = user!.Role == "Admin";
                
                if (!isAdmin && user.FactoryId == null)
                    return BadRequest(ApiError("يجب أن يكون لديك مصنع مسجل"));

                IQueryable<Order> ordersQuery = _context.Orders;
                long? userFactoryId = null;
                
                if (!isAdmin)
                {
                    userFactoryId = user.FactoryId!.Value;
                    ordersQuery = ordersQuery.Where(o => o.BuyerFactoryId == userFactoryId || o.SellerFactoryId == userFactoryId);
                }
                
                var orders = await ordersQuery.ToListAsync();

                var stats = new OrderStatsDto
                {
                    TotalOrders       = orders.Count,
                    CompletedOrders   = orders.Count(o => o.Status == "مكتمل"),
                    PendingOrders     = orders.Count(o => o.Status == "معلق"),
                    DeliveringOrders  = orders.Count(o => o.Status == "قيد التوصيل"),
                    CancelledOrders   = orders.Count(o => o.Status == "ملغى"),
                    TotalRevenue      = orders
                        .Where(o => o.Status != "ملغى" && (isAdmin || o.SellerFactoryId == userFactoryId))
                        .Sum(o => o.TotalPrice),
                    OrdersByStatus = new Dictionary<string, int>
                    {
                        ["مكتمل"]         = orders.Count(o => o.Status == "مكتمل"),
                        ["قيد التوصيل"]   = orders.Count(o => o.Status == "قيد التوصيل"),
                        ["معلق"]          = orders.Count(o => o.Status == "معلق"),
                        ["ملغى"]          = orders.Count(o => o.Status == "ملغى")
                    }
                };

                return Ok(new ApiResponse<OrderStatsDto>
                {
                    Success = true,
                    Message = "Statistics loaded successfully",
                    Data = stats,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order stats");
                return StatusCode(500, ApiError("Error loading statistics", ex));
            }
        }

        // GET /api/orders/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetOrder(long id)
        {
            try
            {
                var (user, authError) = await ResolveUser();
                if (authError != null) return authError;
                
                bool isAdmin = user!.Role == "Admin";
                if (!isAdmin && user.FactoryId == null)
                    return BadRequest(ApiError("يجب أن يكون لديك مصنع مسجل"));

                var order = await _context.Orders
                    .Include(o => o.WasteListing)
                    .Include(o => o.BuyerFactory)
                    .Include(o => o.SellerFactory)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound(ApiError("الطلب غير موجود"));

                if (!isAdmin && order.BuyerFactoryId != user.FactoryId && order.SellerFactoryId != user.FactoryId)
                    return Unauthorized(ApiError("ليس لديك صلاحية للوصول إلى هذا الطلب"));

                var dto = MapToDto(order);
                
                return Ok(new ApiResponse<OrderDto>
                {
                    Success = true,
                    Message = "Order loaded successfully",
                    Data = dto,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order {Id}", id);
                return StatusCode(500, ApiError("Error loading order", ex));
            }
        }

        // POST /api/orders - FIXED: Prioritize Arabic titles
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<OrderDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var (user, authError) = await ResolveUser();
                if (authError != null) return authError;
                if (user!.Factory == null)
                    return BadRequest(ApiError("يجب أن يكون لديك مصنع مسجل"));

                var listing = await _context.WasteListings
                    .Include(l => l.Factory)
                    .FirstOrDefaultAsync(l => l.Id == request.WasteListingId);

                if (listing == null)
                    return BadRequest(ApiError("الإعلان غير موجود"));

                if (listing.Status != "Active")
                    return BadRequest(ApiError("هذا الإعلان غير نشط"));

                if (listing.FactoryId == user.FactoryId)
                    return BadRequest(ApiError("لا يمكنك شراء نفايات من مصنعك الخاص"));

                if (request.Amount > listing.Amount)
                    return BadRequest(ApiError(
                        $"الكمية المطلوبة ({request.Amount} {listing.Unit}) أكبر من الكمية المتاحة ({listing.Amount} {listing.Unit})"));

                if (user.Factory == null || string.IsNullOrEmpty(user.Factory.FactoryName))
                    return BadRequest(ApiError("Factory data is incomplete. Please update your profile."));
                
                if (string.IsNullOrEmpty(listing.FactoryName))
                    return BadRequest(ApiError("Waste listing is missing seller information."));

                // Reserve the quantity
                listing.Amount         -= request.Amount;
                listing.ReservedAmount += request.Amount;
                listing.UpdatedAt       = DateTime.UtcNow;

                _context.Entry(listing).State = Microsoft.EntityFrameworkCore.EntityState.Modified;

                var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..4].ToUpper()}";
                var unitPrice   = listing.Price;
                var totalPrice  = unitPrice * request.Amount;

                // ✅ FIXED: Get proper waste type - prioritize Arabic Title
                string wasteType = GetWasteTypeForOrder(listing);
                
                // Get proper seller name from listing
                string sellerName = GetSellerNameFromListing(listing);
                
                // Get proper buyer name
                string buyerName = CleanString(user.Factory.FactoryName);
                if (string.IsNullOrEmpty(buyerName)) buyerName = "Buyer";

                _logger.LogInformation("📝 Creating order: ListingId={ListingId}, TitleAr={TitleAr}, WasteType={WasteType}, Seller={SellerName}",
                    listing.Id, listing.TitleAr, wasteType, sellerName);

                var order = new Order
                {
                    OrderNumber      = orderNumber,
                    WasteListingId   = listing.Id,
                    BuyerFactoryId   = user.FactoryId!.Value,
                    SellerFactoryId  = listing.FactoryId,
                    WasteType        = wasteType,
                    WasteCategory    = listing.Category ?? "General",
                    Amount           = request.Amount,
                    Unit             = listing.Unit,
                    Price            = unitPrice,
                    TotalPrice       = totalPrice,
                    BuyerName        = buyerName,
                    SellerName       = sellerName,
                    Status           = "معلق",
                    Notes            = request.Notes,
                    OrderDate        = DateTime.UtcNow,
                    CreatedAt        = DateTime.UtcNow,
                    UpdatedAt        = DateTime.UtcNow,
                    RecipientName    = request.RecipientName,
                    RecipientPhone   = request.RecipientPhone,
                    DeliveryAddress  = request.DeliveryAddress,
                    Governorate      = request.Governorate,
                    DeliveryMethod   = request.DeliveryMethod ?? "pickup",
                    PaymentMethod    = request.PaymentMethod  ?? "cash",
                    OrderType        = request.OrderType      ?? "direct",
                    RecyclerStatus   = "None"
                };

                await _context.Orders.AddAsync(order);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("✅ Order created: {OrderNumber} with WasteType={WasteType}", orderNumber, wasteType);

                return Ok(new ApiResponse<OrderDto>
                {
                    Success = true,
                    Message = "Order created successfully with quantity reserved",
                    Data = MapToDto(order),
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _logger.LogError(dbEx, "❌ Database error creating order: {Message}", dbEx.InnerException?.Message ?? dbEx.Message);
                return StatusCode(500, ApiError($"Database error: {dbEx.InnerException?.Message ?? dbEx.Message}"));
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "❌ Error creating order: {Message}", ex.Message);
                return StatusCode(500, ApiError($"Error creating order: {ex.Message}"));
            }
        }

        // PUT /api/orders/{id}/status
        [HttpPut("{id}/status")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] UpdateOrderStatusRequest request)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var (user, authError) = await ResolveUser();
                if (authError != null) return authError;

                bool isAdmin  = user!.Role == "Admin";
                
                if (!isAdmin && user.FactoryId == null)
                    return BadRequest(ApiError("يجب أن يكون لديك مصنع مسجل"));

                var order = await _context.Orders
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                    return NotFound(ApiError("الطلب غير موجود"));

                bool isSeller = !isAdmin && order.SellerFactoryId == user.FactoryId;
                bool isBuyer  = !isAdmin && order.BuyerFactoryId  == user.FactoryId;

                if (!isAdmin && !isSeller && !isBuyer)
                    return Unauthorized(ApiError("ليس لديك صلاحية لتحديث حالة هذا الطلب"));

                var newStatus = request.Status;

                bool isRejection = newStatus is "مرفوض" or "ملغى";
                if (isRejection && order.Status == "معلق")
                {
                    var listing = await _context.WasteListings
                        .FirstOrDefaultAsync(l => l.Id == order.WasteListingId);

                    if (listing != null)
                    {
                        listing.Amount         += order.Amount;
                        listing.ReservedAmount  = Math.Max(0, listing.ReservedAmount - order.Amount);
                        listing.UpdatedAt       = DateTime.UtcNow;
                    }
                }

                if (newStatus == "مقبول" && order.Status == "معلق")
                {
                    var listing = await _context.WasteListings
                        .FirstOrDefaultAsync(l => l.Id == order.WasteListingId);

                    if (listing != null)
                    {
                        listing.ReservedAmount  = Math.Max(0, listing.ReservedAmount - order.Amount);
                        listing.UpdatedAt       = DateTime.UtcNow;
                    }
                }

                order.Status    = newStatus;
                order.UpdatedAt = DateTime.UtcNow;

                if (newStatus is "قيد التوصيل" && request.DeliveryDate.HasValue)
                    order.DeliveryDate = request.DeliveryDate;

                if (newStatus == "مكتمل")
                {
                    order.CompletedDate  = DateTime.UtcNow;
                    order.DeliveryDate ??= DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new ApiResponse
                {
                    Success   = true,
                    Message   = "Order status updated successfully",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error updating order status for {Id}", id);
                return StatusCode(500, ApiError("Error updating order status", ex));
            }
        }

        // DELETE /api/orders/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> CancelOrder(long id)
        {
            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var (user, authError) = await ResolveUser();
                if (authError != null) return authError;
                if (user!.Factory == null)
                    return BadRequest(ApiError("يجب أن يكون لديك مصنع مسجل"));

                var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id);

                if (order == null) return NotFound(ApiError("الطلب غير موجود"));
                if (order.BuyerFactoryId != user.FactoryId)
                    return Unauthorized(ApiError("ليس لديك صلاحية لإلغاء هذا الطلب"));
                if (order.Status != "معلق")
                    return BadRequest(ApiError("لا يمكن إلغاء الطلب في حالته الحالية"));

                var listing = await _context.WasteListings
                    .FirstOrDefaultAsync(l => l.Id == order.WasteListingId);

                if (listing != null)
                {
                    listing.Amount         += order.Amount;
                    listing.ReservedAmount  = Math.Max(0, listing.ReservedAmount - order.Amount);
                    listing.UpdatedAt       = DateTime.UtcNow;
                }

                order.Status    = "ملغى";
                order.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return Ok(new ApiResponse
                {
                    Success   = true,
                    Message   = "Order cancelled successfully and reserved quantity released",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order {Id}", id);
                return StatusCode(500, ApiError("Error cancelling order", ex));
            }
        }

        // ==================== HELPER METHODS ====================

        private async Task<(User? user, IActionResult? error)> ResolveUser()
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(claim) || !long.TryParse(claim, out var uid))
                return (null, Unauthorized(ApiError("غير مصرح به")));

            var user = await _context.Users
                .Include(u => u.Factory)
                .FirstOrDefaultAsync(u => u.Id == uid);

            return user == null
                ? (null, Unauthorized(ApiError("المستخدم غير موجود")))
                : (user, null);
        }

        /// <summary>
        /// Clean string by removing question marks and trimming
        /// </summary>
        private string CleanString(string? input)
        {
            if (string.IsNullOrEmpty(input)) return string.Empty;
            return input.Replace("?", "").Replace("?????", "").Trim();
        }

        /// <summary>
        /// Map category to readable waste type
        /// </summary>
        private string MapCategoryToWasteType(string? category)
        {
            if (string.IsNullOrEmpty(category)) return "Waste Material";
            
            var cleanedCat = CleanString(category);
            
            var categoryMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "plastic", "Plastic Waste" },
                { "metal", "Metal Scrap" },
                { "paper", "Paper Waste" },
                { "glass", "Glass Waste" },
                { "wood", "Wood Waste" },
                { "textile", "Textile Waste" },
                { "electronic", "Electronic Waste" },
                { "electronics", "Electronic Waste" },
                { "chemicals", "Chemical Waste" },
                { "chemical", "Chemical Waste" },
                { "packaging", "Packaging Waste" }
            };
            
            return categoryMap.ContainsKey(cleanedCat) ? categoryMap[cleanedCat] : cleanedCat;
        }

        /// <summary>
        /// ✅ FIXED: Extract proper waste type for order - PRIORITIZE Category Mapping
        /// </summary>
        private string GetWasteTypeForOrder(WasteListing listing)
        {
            // Priority 1: Map from category (STANDARDIZED waste types)
            if (!string.IsNullOrEmpty(listing.Category))
            {
                var mapped = MapCategoryToWasteType(listing.Category);
                if (mapped != "Waste Material") // Only use if we have a valid mapping
                    return mapped;
            }
            
            // Priority 2: TitleEn (English title)
            if (!string.IsNullOrEmpty(listing.TitleEn))
            {
                var cleaned = CleanString(listing.TitleEn);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 2)
                    return cleaned;
            }
            
            // Priority 3: TypeEn (English type)
            if (!string.IsNullOrEmpty(listing.TypeEn))
            {
                var cleaned = CleanString(listing.TypeEn);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 1)
                    return cleaned;
            }
            
            // Priority 4: Type (legacy)
            if (!string.IsNullOrEmpty(listing.Type))
            {
                var cleaned = CleanString(listing.Type);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 1)
                    return cleaned;
            }
            
            // Fallback: TitleAr (only if nothing else works)
            if (!string.IsNullOrEmpty(listing.TitleAr))
            {
                var cleaned = CleanString(listing.TitleAr);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 2)
                    return cleaned;
            }
            
            return "Waste Material";
        }

        /// <summary>
        /// Extract proper waste type from listing with multiple fallbacks (for existing orders)
        /// </summary>
        private string GetWasteTypeFromListing(WasteListing listing)
        {
            return GetWasteTypeForOrder(listing);
        }

        /// <summary>
        /// Extract proper seller name from listing with multiple fallbacks
        /// </summary>
        private string GetSellerNameFromListing(WasteListing listing)
        {
            // Priority 1: FactoryName
            if (!string.IsNullOrEmpty(listing.FactoryName))
            {
                var cleaned = CleanString(listing.FactoryName);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 1)
                    return cleaned;
            }
            
            // Priority 2: CompanyNameEn
            if (!string.IsNullOrEmpty(listing.CompanyNameEn))
            {
                var cleaned = CleanString(listing.CompanyNameEn);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 1)
                    return cleaned;
            }
            
            // Priority 3: CompanyNameAr
            if (!string.IsNullOrEmpty(listing.CompanyNameAr))
            {
                var cleaned = CleanString(listing.CompanyNameAr);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 1)
                    return cleaned;
            }
            
            // Priority 4: From Factory navigation property
            if (listing.Factory != null && !string.IsNullOrEmpty(listing.Factory.FactoryName))
            {
                var cleaned = CleanString(listing.Factory.FactoryName);
                if (!string.IsNullOrEmpty(cleaned) && cleaned != "?????" && cleaned.Length > 1)
                    return cleaned;
            }
            
            return "Seller";
        }

        /// <summary>
        /// Map Order entity to OrderDto with proper data cleaning and enrichment
        /// </summary>
        private OrderDto MapToDto(Order o)
        {
            string wasteType = o.WasteType ?? "Unknown Waste";
            string sellerName = o.SellerName ?? "Factory Seller";
            string buyerName = o.BuyerName ?? "Factory Buyer";
            string category = o.WasteCategory ?? "General";
            
            // Clean waste type - if it's corrupted or "packaging", try to fix it
            if (string.IsNullOrEmpty(wasteType) || wasteType.Contains("?") || wasteType == "packaging" || wasteType == "Packaging")
            {
                // Try to get from WasteListing if available
                if (o.WasteListing != null)
                {
                    wasteType = GetWasteTypeFromListing(o.WasteListing);
                }
                else
                {
                    // Fallback to category mapping
                    wasteType = MapCategoryToWasteType(category);
                }
            }
            else
            {
                wasteType = CleanString(wasteType);
            }
            
            // Clean seller name
            if (string.IsNullOrEmpty(sellerName) || sellerName.Contains("?"))
            {
                if (o.WasteListing != null)
                {
                    sellerName = GetSellerNameFromListing(o.WasteListing);
                }
                else if (o.SellerFactory != null && !string.IsNullOrEmpty(o.SellerFactory.FactoryName))
                {
                    sellerName = CleanString(o.SellerFactory.FactoryName);
                }
                else
                {
                    sellerName = "Seller";
                }
            }
            else
            {
                sellerName = CleanString(sellerName);
            }
            
            // Ensure seller name is not empty
            if (string.IsNullOrEmpty(sellerName) || sellerName == "?????")
                sellerName = "Seller";
            
            // Clean buyer name
            buyerName = CleanString(buyerName);
            if (string.IsNullOrEmpty(buyerName) || buyerName == "?????")
                buyerName = "Buyer";
            
            // Clean category
            string cleanedCategory = CleanString(category);
            if (string.IsNullOrEmpty(cleanedCategory))
                cleanedCategory = "General";
            
            return new OrderDto
            {
                Id                   = o.Id,
                WasteListingId       = o.WasteListingId,
                OrderNumber          = o.OrderNumber ?? string.Empty,
                WasteType            = wasteType,
                WasteCategory        = cleanedCategory,
                Amount               = o.Amount,
                Unit                 = o.Unit ?? "unit",
                Price                = o.Price,
                TotalPrice           = o.TotalPrice,
                BuyerName            = buyerName,
                SellerName           = sellerName,
                Status               = o.Status ?? "Pending",
                OrderStatus          = o.Status ?? "Pending",
                PaymentStatus        = o.PaymentStatus ?? "Pending",
                RecyclerStatus       = o.RecyclerStatus ?? "None",
                Notes                = o.Notes,
                OrderDate            = o.OrderDate,
                DeliveryDate         = o.DeliveryDate,
                CompletedDate        = o.CompletedDate,
                OrderType            = o.OrderType,
                RecipientName        = o.RecipientName,
                RecipientPhone       = o.RecipientPhone,
                DeliveryAddress      = o.DeliveryAddress,
                Governorate          = o.Governorate,
                DeliveryMethod       = o.DeliveryMethod,
                PaymentMethod        = o.PaymentMethod,
                RecyclerId           = o.RecyclerId,
                RecyclerName         = o.Recycler?.CompanyName
            };
        }

        private static ApiResponse ApiError(string msg, Exception? ex = null) => new()
        {
            Success   = false,
            Message   = msg,
            Errors    = ex == null ? null : new List<string> { ex.Message },
            Timestamp = DateTime.UtcNow
        };
    }
}