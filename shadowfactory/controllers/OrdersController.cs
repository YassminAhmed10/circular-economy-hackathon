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

        /// <summary>
        /// Get all orders for the current user's factory (as buyer or seller)
        /// </summary>
        [HttpGet]
        [ProducesResponseType(typeof(ApiResponse<List<OrderDto>>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetMyOrders([FromQuery] OrderFilterRequest filter)
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

                var factoryId = user.FactoryId.Value;

                var query = _context.Orders
                    .Include(o => o.WasteListing)
                    .Where(o => o.BuyerFactoryId == factoryId || o.SellerFactoryId == factoryId);

                // Apply filters
                if (!string.IsNullOrEmpty(filter.Status))
                {
                    query = query.Where(o => o.Status == filter.Status);
                }

                if (filter.FromDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate >= filter.FromDate.Value);
                }

                if (filter.ToDate.HasValue)
                {
                    query = query.Where(o => o.OrderDate <= filter.ToDate.Value);
                }

                if (!string.IsNullOrEmpty(filter.SearchTerm))
                {
                    query = query.Where(o =>
                        o.OrderNumber.Contains(filter.SearchTerm) ||
                        o.WasteType.Contains(filter.SearchTerm) ||
                        o.BuyerName.Contains(filter.SearchTerm) ||
                        o.SellerName.Contains(filter.SearchTerm));
                }

                var totalCount = await query.CountAsync();

                var orders = await query
                    .OrderByDescending(o => o.OrderDate)
                    .Skip((filter.Page - 1) * filter.PageSize)
                    .Take(filter.PageSize)
                    .ToListAsync();

                var orderDtos = orders.Select(o => new OrderDto
                {
                    Id = o.Id,
                    OrderNumber = o.OrderNumber,
                    WasteType = o.WasteType,
                    WasteCategory = o.WasteCategory,
                    Amount = o.Amount,
                    Unit = o.Unit,
                    Price = o.Price,
                    BuyerName = o.BuyerName,
                    SellerName = o.SellerName,
                    Status = o.Status,
                    Notes = o.Notes,
                    OrderDate = o.OrderDate,
                    DeliveryDate = o.DeliveryDate,
                    CompletedDate = o.CompletedDate
                }).ToList();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "تم تحميل الطلبات بنجاح",
                    Data = new
                    {
                        Items = orderDtos,
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
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء تحميل الطلبات",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get order statistics
        /// </summary>
        [HttpGet("stats")]
        [ProducesResponseType(typeof(ApiResponse<OrderStatsDto>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetOrderStats()
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

                var factoryId = user.FactoryId.Value;

                var orders = await _context.Orders
                    .Where(o => o.BuyerFactoryId == factoryId || o.SellerFactoryId == factoryId)
                    .ToListAsync();

                var stats = new OrderStatsDto
                {
                    TotalOrders = orders.Count,
                    CompletedOrders = orders.Count(o => o.Status == "مكتمل"),
                    PendingOrders = orders.Count(o => o.Status == "معلق"),
                    DeliveringOrders = orders.Count(o => o.Status == "قيد التوصيل"),
                    CancelledOrders = orders.Count(o => o.Status == "ملغى"),
                    TotalRevenue = orders
                        .Where(o => o.Status != "ملغى" && o.SellerFactoryId == factoryId)
                        .Sum(o => o.Price),
                    OrdersByStatus = new Dictionary<string, int>
                    {
                        ["مكتمل"] = orders.Count(o => o.Status == "مكتمل"),
                        ["قيد التوصيل"] = orders.Count(o => o.Status == "قيد التوصيل"),
                        ["معلق"] = orders.Count(o => o.Status == "معلق"),
                        ["ملغى"] = orders.Count(o => o.Status == "ملغى")
                    }
                };

                return Ok(new ApiResponse<OrderStatsDto>
                {
                    Success = true,
                    Message = "تم تحميل الإحصائيات بنجاح",
                    Data = stats,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order stats");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء تحميل الإحصائيات",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Get a specific order by ID
        /// </summary>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(ApiResponse<OrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOrder(long id)
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

                var order = await _context.Orders
                    .Include(o => o.WasteListing)
                    .Include(o => o.BuyerFactory)
                    .Include(o => o.SellerFactory)
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "الطلب غير موجود",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Check if user has access to this order
                if (order.BuyerFactoryId != user.FactoryId && order.SellerFactoryId != user.FactoryId)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "ليس لديك صلاحية للوصول إلى هذا الطلب",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderNumber = order.OrderNumber,
                    WasteType = order.WasteType,
                    WasteCategory = order.WasteCategory,
                    Amount = order.Amount,
                    Unit = order.Unit,
                    Price = order.Price,
                    BuyerName = order.BuyerName,
                    SellerName = order.SellerName,
                    Status = order.Status,
                    Notes = order.Notes,
                    OrderDate = order.OrderDate,
                    DeliveryDate = order.DeliveryDate,
                    CompletedDate = order.CompletedDate
                };

                return Ok(new ApiResponse<OrderDto>
                {
                    Success = true,
                    Message = "تم تحميل الطلب بنجاح",
                    Data = orderDto,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting order {Id}", id);
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء تحميل الطلب",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Create a new order (buyer places an order)
        /// </summary>
        [HttpPost]
        [ProducesResponseType(typeof(ApiResponse<OrderDto>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                // Get current user
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

                if (user?.Factory == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب أن يكون لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Get the waste listing
                var listing = await _context.WasteListings
                    .Include(l => l.Factory)
                    .FirstOrDefaultAsync(l => l.Id == request.WasteListingId);

                if (listing == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "الإعلان غير موجود",
                        Timestamp = DateTime.UtcNow
                    });
                }

                if (listing.Status != "Active")
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "هذا الإعلان غير نشط",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Check if user is not buying from themselves
                if (listing.FactoryId == user.FactoryId)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "لا يمكنك شراء نفايات من مصنعك الخاص",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Validate amount
                if (request.Amount > listing.Amount)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = $"الكمية المطلوبة ({request.Amount} {listing.Unit}) أكبر من الكمية المتاحة ({listing.Amount} {listing.Unit})",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Generate order number
                var orderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 4).ToUpper()}";

                // Calculate price (prorated based on amount)
                var totalPrice = (listing.Price / listing.Amount) * request.Amount;

                // Create the order
                var order = new Order
                {
                    OrderNumber = orderNumber,
                    WasteListingId = listing.Id,
                    BuyerFactoryId = user.FactoryId.Value,
                    SellerFactoryId = listing.FactoryId,
                    WasteType = listing.Type,
                    WasteCategory = listing.Category,
                    Amount = request.Amount,
                    Unit = listing.Unit,
                    Price = totalPrice,
                    BuyerName = user.Factory.FactoryName,
                    SellerName = listing.FactoryName,
                    Status = "معلق",
                    Notes = request.Notes,
                    OrderDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _context.Orders.AddAsync(order);

                // Update the listing's available amount
                listing.Amount -= request.Amount;
                listing.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                _logger.LogInformation("Order created successfully: {OrderNumber}", orderNumber);

                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderNumber = order.OrderNumber,
                    WasteType = order.WasteType,
                    WasteCategory = order.WasteCategory,
                    Amount = order.Amount,
                    Unit = order.Unit,
                    Price = order.Price,
                    BuyerName = order.BuyerName,
                    SellerName = order.SellerName,
                    Status = order.Status,
                    Notes = order.Notes,
                    OrderDate = order.OrderDate,
                    DeliveryDate = order.DeliveryDate,
                    CompletedDate = order.CompletedDate
                };

                return Ok(new ApiResponse<OrderDto>
                {
                    Success = true,
                    Message = "تم إنشاء الطلب بنجاح",
                    Data = orderDto,
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _logger.LogError(ex, "Error creating order");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء إنشاء الطلب",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        /// <summary>
        /// Update order status (seller only)
        /// </summary>
        [HttpPut("{id}/status")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateOrderStatus(long id, [FromBody] UpdateOrderStatusRequest request)
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

                if (user?.Factory == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب أن يكون لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var order = await _context.Orders
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "الطلب غير موجود",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Only seller can update status
                if (order.SellerFactoryId != user.FactoryId)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "ليس لديك صلاحية لتحديث حالة هذا الطلب",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Update status
                order.Status = request.Status;

                if (request.Status == "قيد التوصيل" && request.DeliveryDate.HasValue)
                {
                    order.DeliveryDate = request.DeliveryDate;
                }
                else if (request.Status == "مكتمل")
                {
                    order.CompletedDate = DateTime.UtcNow;
                    order.DeliveryDate ??= DateTime.UtcNow;
                }
                else if (request.Status == "ملغى")
                {
                    // If cancelled, return the amount to the listing
                    var listing = await _context.WasteListings
                        .FirstOrDefaultAsync(l => l.Id == order.WasteListingId);

                    if (listing != null)
                    {
                        listing.Amount += order.Amount;
                        listing.UpdatedAt = DateTime.UtcNow;
                    }
                }

                order.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "تم تحديث حالة الطلب بنجاح",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating order status for {Id}", id);
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء تحديث حالة الطلب",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }
        [HttpGet("debug-db")]
        [AllowAnonymous]
        public async Task<IActionResult> DebugDatabase()
        {
            try
            {
                var result = new Dictionary<string, object>();

                // Get connection string
                var connectionString = _context.Database.GetConnectionString();
                result["ConnectionString"] = connectionString?.Replace("Password=", "Password=***");

                // Get current database
                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var cmd = connection.CreateCommand();
                    cmd.CommandText = "SELECT DB_NAME()";
                    var databaseName = await cmd.ExecuteScalarAsync();
                    result["Connected Database"] = databaseName;

                    // Check if Orders table exists in this database
                    cmd.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Orders'";
                    var tableExists = (int)await cmd.ExecuteScalarAsync();
                    result["Orders Table Exists"] = tableExists > 0;

                    if (tableExists > 0)
                    {
                        cmd.CommandText = "SELECT COUNT(*) FROM Orders";
                        var count = (int)await cmd.ExecuteScalarAsync();
                        result["Order Count"] = count;
                    }

                    // List all tables
                    cmd.CommandText = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'";
                    var tables = new List<string>();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            tables.Add(reader.GetString(0));
                        }
                    }
                    result["Tables in DB"] = tables;
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message, Inner = ex.InnerException?.Message });
            }
        }

        /// <summary>
        /// Cancel order (buyer only, only if pending)
        /// </summary>
        [HttpDelete("{id}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> CancelOrder(long id)
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

                if (user?.Factory == null)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "يجب أن يكون لديك مصنع مسجل",
                        Timestamp = DateTime.UtcNow
                    });
                }

                var order = await _context.Orders
                    .FirstOrDefaultAsync(o => o.Id == id);

                if (order == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "الطلب غير موجود",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Only buyer can cancel, and only if status is pending
                if (order.BuyerFactoryId != user.FactoryId)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "ليس لديك صلاحية لإلغاء هذا الطلب",
                        Timestamp = DateTime.UtcNow
                    });
                }

                if (order.Status != "معلق")
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "لا يمكن إلغاء الطلب في حالته الحالية",
                        Timestamp = DateTime.UtcNow
                    });
                }

                // Return the amount to the listing
                var listing = await _context.WasteListings
                    .FirstOrDefaultAsync(l => l.Id == order.WasteListingId);

                if (listing != null)
                {
                    listing.Amount += order.Amount;
                    listing.UpdatedAt = DateTime.UtcNow;
                }

                order.Status = "ملغى";
                order.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "تم إلغاء الطلب بنجاح",
                    Timestamp = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cancelling order {Id}", id);
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "حدث خطأ أثناء إلغاء الطلب",
                    Errors = new List<string> { ex.Message },
                    Timestamp = DateTime.UtcNow
                });
            }
        }
    }
}