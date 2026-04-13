using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace shadowfactory.Services
{
    /// <summary>
    /// Interface for Recycler Integration Service
    /// Manages recycler workflow: suggestions, requests, acceptance, processing
    /// </summary>
    public interface IRecyclerIntegrationService
    {
        Task<List<Recycler>> GetSuitableRecyclersAsync(long orderId);
        Task<List<WasteRecyclingOrder>> GetRecyclerJobsAsync(int recyclerId, string status = "all");
        Task<bool> AcceptRecyclingJobAsync(long recyclingOrderId);
        Task<bool> RejectRecyclingJobAsync(long recyclingOrderId, string reason);
        Task<bool> UpdateProcessingStatusAsync(long recyclingOrderId, WasteRecyclingOrderStatus status);
        Task<bool> CompleteProcessingAsync(long recyclingOrderId, decimal outputQuantity, string outputMaterialType);
        Task<List<WasteRecyclingOrder>> GetPendingJobsAsync(int recyclerId);
        Task<List<WasteRecyclingOrder>> GetCompletedJobsAsync(int recyclerId, int limit = 10);
        Task<RecyclerPerformanceMetrics> GetRecyclerMetricsAsync(int recyclerId);
    }

    /// <summary>
    /// DTO for recycler performance metrics
    /// </summary>
    public class RecyclerPerformanceMetrics
    {
        public int TotalOrdersProcessed { get; set; }
        public int TotalOrdersPending { get; set; }
        public int TotalOrdersRejected { get; set; }
        public decimal AverageEfficiencyPercent { get; set; }
        public decimal TotalWasteProcessed { get; set; }
        public decimal TotalOutputGenerated { get; set; }
        public decimal EstimatedCO2Avoided { get; set; }
        public decimal Rating { get; set; }
    }

    public class RecyclerIntegrationService : IRecyclerIntegrationService
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<RecyclerIntegrationService> _logger;
        private readonly IRecyclerMatchingService _matchingService;

        public RecyclerIntegrationService(
            ECoVDbContext context,
            ILogger<RecyclerIntegrationService> logger,
            IRecyclerMatchingService matchingService)
        {
            _context = context;
            _logger = logger;
            _matchingService = matchingService;
        }

        /// <summary>
        /// Get suitable recyclers for an order based on waste type
        /// </summary>
        public async Task<List<Recycler>> GetSuitableRecyclersAsync(long orderId)
        {
            try
            {
                var order = await _context.Orders
                    .Include(o => o.WasteListing)
                    .FirstOrDefaultAsync(o => o.Id == orderId);

                if (order == null)
                    return new List<Recycler>();

                // Find recyclers with capabilities matching waste type and category
                // For now, return all active verified recyclers
                // You can enhancement this with more sophisticated matching logic
                var suitableRecyclers = await _context.Recyclers
                    .Include(r => r.Capabilities)
                        .ThenInclude(c => c.InputWasteSubtype)
                    .Where(r => r.IsActive && r.IsVerified)
                    .OrderByDescending(r => r.Rating)
                    .ToListAsync();

                _logger.LogInformation($"Found {suitableRecyclers.Count} suitable recyclers for order {orderId}");
                return suitableRecyclers;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting suitable recyclers: {ex.Message}");
                return new List<Recycler>();
            }
        }

        /// <summary>
        /// Get recycler jobs filtered by status
        /// </summary>
        public async Task<List<WasteRecyclingOrder>> GetRecyclerJobsAsync(int recyclerId, string status = "all")
        {
            try
            {
                var query = _context.WasteRecyclingOrders
                    .Include(r => r.Order)
                    .Include(r => r.OrderedByFactory)
                    .Where(r => r.RecyclerId == recyclerId)
                    .AsQueryable();

                if (status != "all")
                {
                    var statusValue = ParseRecyclingOrderStatus(status);
                    query = query.Where(r => r.Status == (int)statusValue);
                }

                return await query.OrderByDescending(r => r.CreatedAt).ToListAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting recycler jobs: {ex.Message}");
                return new List<WasteRecyclingOrder>();
            }
        }

        /// <summary>
        /// Accept a recycling job
        /// </summary>
        public async Task<bool> AcceptRecyclingJobAsync(long recyclingOrderId)
        {
            try
            {
                var recyclingOrder = await _context.WasteRecyclingOrders
                    .Include(r => r.Order)
                    .FirstOrDefaultAsync(r => r.Id == recyclingOrderId);

                if (recyclingOrder == null)
                    return false;

                recyclingOrder.Status = (int)WasteRecyclingOrderStatus.Accepted;
                recyclingOrder.AcceptedAt = DateTime.UtcNow;
                recyclingOrder.UpdatedAt = DateTime.UtcNow;

                _context.WasteRecyclingOrders.Update(recyclingOrder);

                // Update linked order status
                if (recyclingOrder.Order != null)
                {
                    recyclingOrder.Order.RecyclerStatus = "Accepted";
                    recyclingOrder.Order.RecyclerAcceptedAt = DateTime.UtcNow;
                    recyclingOrder.Order.UpdatedAt = DateTime.UtcNow;
                    _context.Orders.Update(recyclingOrder.Order);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Recycling order {recyclingOrderId} accepted");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error accepting recycling job: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Reject a recycling job
        /// </summary>
        public async Task<bool> RejectRecyclingJobAsync(long recyclingOrderId, string reason)
        {
            try
            {
                var recyclingOrder = await _context.WasteRecyclingOrders
                    .Include(r => r.Order)
                    .FirstOrDefaultAsync(r => r.Id == recyclingOrderId);

                if (recyclingOrder == null)
                    return false;

                recyclingOrder.Status = (int)WasteRecyclingOrderStatus.Rejected;
                recyclingOrder.RejectionReason = reason;
                recyclingOrder.UpdatedAt = DateTime.UtcNow;

                _context.WasteRecyclingOrders.Update(recyclingOrder);

                // Update linked order status
                if (recyclingOrder.Order != null)
                {
                    recyclingOrder.Order.RecyclerStatus = "Rejected";
                    recyclingOrder.Order.RecyclerId = null;
                    recyclingOrder.Order.UpdatedAt = DateTime.UtcNow;
                    _context.Orders.Update(recyclingOrder.Order);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Recycling order {recyclingOrderId} rejected: {reason}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error rejecting recycling job: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Update processing status
        /// </summary>
        public async Task<bool> UpdateProcessingStatusAsync(long recyclingOrderId, WasteRecyclingOrderStatus status)
        {
            try
            {
                var recyclingOrder = await _context.WasteRecyclingOrders.FindAsync(recyclingOrderId);
                if (recyclingOrder == null)
                    return false;

                recyclingOrder.Status = (int)status;

                if (status == WasteRecyclingOrderStatus.Processing && recyclingOrder.ProcessingStartedAt == null)
                    recyclingOrder.ProcessingStartedAt = DateTime.UtcNow;

                recyclingOrder.UpdatedAt = DateTime.UtcNow;

                _context.WasteRecyclingOrders.Update(recyclingOrder);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Recycling order {recyclingOrderId} status updated to {status}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating processing status: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Complete processing - mark job as done with output details
        /// </summary>
        public async Task<bool> CompleteProcessingAsync(
            long recyclingOrderId,
            decimal outputQuantity,
            string outputMaterialType)
        {
            try
            {
                var recyclingOrder = await _context.WasteRecyclingOrders
                    .Include(r => r.Order)
                    .FirstOrDefaultAsync(r => r.Id == recyclingOrderId);

                if (recyclingOrder == null)
                    return false;

                // Calculate efficiency percentage
                decimal efficiency = recyclingOrder.QuantityToProcess > 0
                    ? (outputQuantity / recyclingOrder.QuantityToProcess) * 100
                    : 0;

                recyclingOrder.Status = (int)WasteRecyclingOrderStatus.Completed;
                recyclingOrder.ProcessingCompletedAt = DateTime.UtcNow;
                recyclingOrder.OutputQuantity = outputQuantity;
                recyclingOrder.OutputMaterialType = outputMaterialType;
                recyclingOrder.ActualEfficiencyPercent = efficiency;
                recyclingOrder.UpdatedAt = DateTime.UtcNow;

                _context.WasteRecyclingOrders.Update(recyclingOrder);

                // Update linked order
                if (recyclingOrder.Order != null)
                {
                    recyclingOrder.Order.RecyclerStatus = "Completed";
                    recyclingOrder.Order.OrderStatus = "Completed";
                    recyclingOrder.Order.CompletedDate = DateTime.UtcNow;
                    recyclingOrder.Order.UpdatedAt = DateTime.UtcNow;
                    _context.Orders.Update(recyclingOrder.Order);
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Recycling order {recyclingOrderId} completed with output: {outputQuantity} {recyclingOrder.Unit}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error completing processing: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Get pending jobs for a recycler
        /// </summary>
        public async Task<List<WasteRecyclingOrder>> GetPendingJobsAsync(int recyclerId)
        {
            return await _context.WasteRecyclingOrders
                .Include(r => r.Order)
                .Include(r => r.OrderedByFactory)
                .Where(r => r.RecyclerId == recyclerId && 
                           (r.Status == (int)WasteRecyclingOrderStatus.Pending ||
                            r.Status == (int)WasteRecyclingOrderStatus.Processing))
                .OrderByDescending(r => r.CreatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Get completed jobs for a recycler
        /// </summary>
        public async Task<List<WasteRecyclingOrder>> GetCompletedJobsAsync(int recyclerId, int limit = 10)
        {
            return await _context.WasteRecyclingOrders
                .Include(r => r.Order)
                .Include(r => r.OrderedByFactory)
                .Where(r => r.RecyclerId == recyclerId &&
                           r.Status == (int)WasteRecyclingOrderStatus.Completed)
                .OrderByDescending(r => r.ProcessingCompletedAt)
                .Take(limit)
                .ToListAsync();
        }

        /// <summary>
        /// Get recycler performance metrics
        /// </summary>
        public async Task<RecyclerPerformanceMetrics> GetRecyclerMetricsAsync(int recyclerId)
        {
            var orders = await _context.WasteRecyclingOrders
                .Where(r => r.RecyclerId == recyclerId)
                .ToListAsync();

            var completed = orders.Where(r => r.Status == (int)WasteRecyclingOrderStatus.Completed).ToList();
            var pending = orders.Where(r => r.Status == (int)WasteRecyclingOrderStatus.Pending).ToList();
            var rejected = orders.Where(r => r.Status == (int)WasteRecyclingOrderStatus.Rejected).ToList();

            var recycler = await _context.Recyclers.FindAsync(recyclerId);

            return new RecyclerPerformanceMetrics
            {
                TotalOrdersProcessed = completed.Count,
                TotalOrdersPending = pending.Count,
                TotalOrdersRejected = rejected.Count,
                AverageEfficiencyPercent = completed.Count > 0
                    ? (decimal)completed.Average(r => r.ActualEfficiencyPercent)
                    : 0,
                TotalWasteProcessed = orders.Sum(r => r.QuantityToProcess),
                TotalOutputGenerated = completed.Sum(r => r.OutputQuantity),
                EstimatedCO2Avoided = completed.Sum(r => r.CO2AvoidedKg),
                Rating = recycler?.Rating ?? 0
            };
        }

        /// <summary>
        /// Helper to parse status string to enum
        /// </summary>
        private WasteRecyclingOrderStatus ParseRecyclingOrderStatus(string status)
        {
            return status.ToLower() switch
            {
                "pending" => WasteRecyclingOrderStatus.Pending,
                "accepted" => WasteRecyclingOrderStatus.Accepted,
                "processing" => WasteRecyclingOrderStatus.Processing,
                "completed" => WasteRecyclingOrderStatus.Completed,
                "rejected" => WasteRecyclingOrderStatus.Rejected,
                "failed" => WasteRecyclingOrderStatus.Failed,
                _ => WasteRecyclingOrderStatus.Pending
            };
        }
    }
}
