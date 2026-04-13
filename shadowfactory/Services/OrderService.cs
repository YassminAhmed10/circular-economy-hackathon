using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models.Entities;
using shadowfactory.Models.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shadowfactory.Services
{
    /// <summary>
    /// Interface for Order Service
    /// Manages order lifecycle: creation, status tracking, recycler integration
    /// </summary>
    public interface IOrderService
    {
        Task<Order> CreateOrderAsync(long wasteListingId, long buyerFactoryId, long sellerFactoryId, decimal quantity, string buyerName, string sellerName);
        Task<Order> GetOrderByIdAsync(long orderId);
        Task<List<Order>> GetOrdersByFactoryAsync(long factoryId, string role = "both");
        Task<bool> UpdateOrderStatusAsync(long orderId, string newStatus);
        Task<bool> RequestRecyclerAsync(long orderId, int recyclerId, decimal processingFee);
        Task<bool> AcceptRecyclerRequestAsync(long orderId);
        Task<bool> RejectRecyclerRequestAsync(long orderId, string reason);
        Task<bool> CompleteOrderAsync(long orderId);
        Task<List<Order>> GetPendingOrdersAsync(long factoryId);
        Task<Order?> GetOrderWithPaymentsAsync(long orderId);
    }

    public class OrderService : IOrderService
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<OrderService> _logger;
        private readonly IPaymentService _paymentService;

        public OrderService(ECoVDbContext context, ILogger<OrderService> logger, IPaymentService paymentService)
        {
            _context = context;
            _logger = logger;
            _paymentService = paymentService;
        }

        /// <summary>
        /// Create a new order from a waste listing purchase
        /// </summary>
        public async Task<Order> CreateOrderAsync(
            long wasteListingId,
            long buyerFactoryId,
            long sellerFactoryId,
            decimal quantity,
            string buyerName,
            string sellerName)
        {
            try
            {
                var listing = await _context.WasteListings.FindAsync(wasteListingId);
                if (listing == null)
                    throw new ArgumentException("Waste listing not found");

                var buyerFactory = await _context.Factories.FindAsync(buyerFactoryId);
                var sellerFactory = await _context.Factories.FindAsync(sellerFactoryId);

                if (buyerFactory == null || sellerFactory == null)
                    throw new ArgumentException("Factory not found");

                // Calculate total price
                decimal totalPrice = quantity * listing.Price;

                var order = new Order
                {
                    OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                    WasteListingId = wasteListingId,
                    BuyerFactoryId = buyerFactoryId,
                    SellerFactoryId = sellerFactoryId,
                    WasteType = listing.Type,
                    WasteCategory = listing.Category,
                    Amount = quantity,
                    Unit = listing.Unit,
                    Price = listing.Price,
                    TotalPrice = totalPrice,
                    BuyerName = buyerName,
                    SellerName = sellerName,
                    Status = "معلق", // Keep Arabic for backward compatibility
                    OrderStatus = "Pending",
                    PaymentStatus = "Pending",
                    RecyclerStatus = "None",
                    OrderDate = DateTime.UtcNow,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                // Automatically create pending payment record
                await _paymentService.CreateOrderPaymentAsync(
                    order.Id,
                    buyerFactoryId,
                    sellerFactoryId,
                    totalPrice,
                    PaymentType.OrderPayment
                );

                _logger.LogInformation($"Order created: {order.OrderNumber} for waste listing {wasteListingId}");
                return order;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating order: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Get order by ID with related data
        /// </summary>
        public async Task<Order> GetOrderByIdAsync(long orderId)
        {
            var order = await _context.Orders
                .Include(o => o.WasteListing)
                .Include(o => o.BuyerFactory)
                .Include(o => o.SellerFactory)
                .Include(o => o.Recycler)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
                throw new ArgumentException($"Order {orderId} not found");

            return order;
        }

        /// <summary>
        /// Get all orders for a factory (as buyer or seller)
        /// </summary>
        public async Task<List<Order>> GetOrdersByFactoryAsync(long factoryId, string role = "both")
        {
            var query = _context.Orders
                .Include(o => o.WasteListing)
                .Include(o => o.BuyerFactory)
                .Include(o => o.SellerFactory)
                .Include(o => o.Recycler)
                .AsQueryable();

            if (role == "buyer")
                query = query.Where(o => o.BuyerFactoryId == factoryId);
            else if (role == "seller")
                query = query.Where(o => o.SellerFactoryId == factoryId);
            else
                query = query.Where(o => o.BuyerFactoryId == factoryId || o.SellerFactoryId == factoryId);

            return await query.OrderByDescending(o => o.OrderDate).ToListAsync();
        }

        /// <summary>
        /// Update order status
        /// </summary>
        public async Task<bool> UpdateOrderStatusAsync(long orderId, string newStatus)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return false;

            order.OrderStatus = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            _context.Orders.Update(order);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Order {orderId} status updated to {newStatus}");
            return true;
        }

        /// <summary>
        /// Request a recycler to process the purchased waste
        /// Creates a WasteRecyclingOrder and links it to this Order
        /// </summary>
        public async Task<bool> RequestRecyclerAsync(
            long orderId,
            int recyclerId,
            decimal processingFee)
        {
            try
            {
                var order = await _context.Orders.Include(o => o.WasteListing).FirstOrDefaultAsync(o => o.Id == orderId);
                if (order == null)
                    return false;

                var recycler = await _context.Recyclers.FindAsync(recyclerId);
                if (recycler == null)
                    return false;

                // Update order with recycler info
                order.RecyclerId = recyclerId;
                order.RecyclerProcessingFee = processingFee;
                order.RecyclerStatus = "Requested";
                order.RecyclerRequestedAt = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;

                _context.Orders.Update(order);

                // Create WasteRecyclingOrder
                var recyclingOrder = new WasteRecyclingOrder
                {
                    OrderNumber = $"REC-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}",
                    RecyclerId = recyclerId,
                    OrderedByFactoryId = order.BuyerFactoryId,
                    OrderId = orderId,
                    QuantityToProcess = order.Amount,
                    Unit = order.Unit,
                    ProcessingCost = processingFee,
                    Status = (int)WasteRecyclingOrderStatus.Pending,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.WasteRecyclingOrders.Add(recyclingOrder);
                await _context.SaveChangesAsync();

                // Link order to recycling order
                order.WasteRecyclingOrderId = recyclingOrder.Id;
                _context.Orders.Update(order);

                // Create payment record for recycler fee
                await _paymentService.CreateOrderPaymentAsync(
                    orderId,
                    order.BuyerFactoryId,
                    order.BuyerFactoryId, // Temporary - recycler is not a factory in this context
                    processingFee,
                    PaymentType.RecyclerFee
                );

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Recycler {recyclerId} requested for order {orderId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error requesting recycler: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Accept the recycler request - recycler confirms they will process the waste
        /// </summary>
        public async Task<bool> AcceptRecyclerRequestAsync(long orderId)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.WasteRecyclingOrder)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                    return false;

                order.RecyclerStatus = "Accepted";
                order.RecyclerAcceptedAt = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;

                // Update recycling order status
                if (order.WasteRecyclingOrder != null)
                {
                    order.WasteRecyclingOrder.Status = (int)WasteRecyclingOrderStatus.Accepted;
                    order.WasteRecyclingOrder.AcceptedAt = DateTime.UtcNow;
                }

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Recycler request accepted for order {orderId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error accepting recycler request: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Reject the recycler request
        /// </summary>
        public async Task<bool> RejectRecyclerRequestAsync(long orderId, string reason)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.WasteRecyclingOrder)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                    return false;

                order.RecyclerStatus = "Rejected";
                order.RecyclerId = null;
                order.RecyclerProcessingFee = null;
                order.UpdatedAt = DateTime.UtcNow;

                // Update recycling order status
                if (order.WasteRecyclingOrder != null)
                {
                    order.WasteRecyclingOrder.Status = (int)WasteRecyclingOrderStatus.Rejected;
                    order.WasteRecyclingOrder.RejectionReason = reason;
                }

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Recycler request rejected for order {orderId}: {reason}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error rejecting recycler request: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Complete the order - mark as delivered and processed
        /// </summary>
        public async Task<bool> CompleteOrderAsync(long orderId)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                    return false;

                order.OrderStatus = "Completed";
                order.Status = "مكمل"; // Arabic
                order.CompletedDate = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;

                // If recycler involved, mark recycling order as completed
                if (order.WasteRecyclingOrderId.HasValue)
                {
                    var recyclingOrder = await _context.WasteRecyclingOrders
                        .FirstOrDefaultAsync(r => r.Id == order.WasteRecyclingOrderId);

                    if (recyclingOrder != null)
                    {
                        recyclingOrder.Status = (int)WasteRecyclingOrderStatus.Completed;
                        recyclingOrder.ProcessingCompletedAt = DateTime.UtcNow;
                        recyclingOrder.UpdatedAt = DateTime.UtcNow;
                        _context.WasteRecyclingOrders.Update(recyclingOrder);
                    }
                }

                _context.Orders.Update(order);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Order {orderId} completed");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error completing order: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Get pending orders (not yet completed)
        /// </summary>
        public async Task<List<Order>> GetPendingOrdersAsync(long factoryId)
        {
            return await _context.Orders
                .Include(o => o.WasteListing)
                .Where(o => (o.BuyerFactoryId == factoryId || o.SellerFactoryId == factoryId) &&
                           o.OrderStatus != "Completed" &&
                           o.OrderStatus != "Cancelled")
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }

        /// <summary>
        /// Get order with all payment records
        /// </summary>
        public async Task<Order?> GetOrderWithPaymentsAsync(long orderId)
        {
            return await _context.Orders
                .Include(o => o.Payments)
                .Include(o => o.WasteListing)
                .Include(o => o.Recycler)
                .FirstOrDefaultAsync(o => o.Id == orderId);
        }
    }
}
