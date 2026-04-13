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
    /// Interface for Payment Service
    /// Manages payment lifecycle and status tracking
    /// </summary>
    public interface IPaymentService
    {
        Task<OrderPayment> CreateOrderPaymentAsync(long orderId, long payerFactoryId, long payeeFactoryId, decimal amount, PaymentType paymentType);
        Task<OrderPayment> GetPaymentByIdAsync(long paymentId);
        Task<List<OrderPayment>> GetOrderPaymentsAsync(long orderId);
        Task<List<OrderPayment>> GetFactoryPaymentsAsync(long factoryId, string role = "both");
        Task<bool> ProcessPaymentAsync(long paymentId, string paymentMethod, string? transactionReference = null);
        Task<bool> MarkPaymentAsFailedAsync(long paymentId, string failureReason);
        Task<bool> RefundPaymentAsync(long paymentId, string reason);
        Task<decimal> GetTotalPaidForOrderAsync(long orderId);
        Task<decimal> GetOutstandingBalanceAsync(long orderId);
        Task<List<OrderPayment>> GetPendingPaymentsAsync(long factoryId, string role = "payer");
        Task<PaymentSummary> GetPaymentSummaryAsync(long factoryId);
    }

    /// <summary>
    /// DTO for payment summary
    /// </summary>
    public class PaymentSummary
    {
        public decimal TotalReceivable { get; set; }    // Money owed to this factory
        public decimal TotalPayable { get; set; }       // Money owed by this factory
        public decimal TotalPaid { get; set; }          // Already paid
        public decimal PendingPayments { get; set; }    // Waiting to be processed
        public int CompletedTransactions { get; set; }
        public int FailedTransactions { get; set; }
    }

    public class PaymentService : IPaymentService
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(ECoVDbContext context, ILogger<PaymentService> logger)
        {
            _context = context;
            _logger = logger;
        }

        /// <summary>
        /// Create a new payment record
        /// </summary>
        public async Task<OrderPayment> CreateOrderPaymentAsync(
            long orderId,
            long payerFactoryId,
            long payeeFactoryId,
            decimal amount,
            PaymentType paymentType)
        {
            try
            {
                var order = await _context.Orders.FindAsync(orderId);
                if (order == null)
                    throw new ArgumentException($"Order {orderId} not found");

                var payment = new OrderPayment
                {
                    OrderId = orderId,
                    PaymentType = (int)paymentType,
                    PayerFactoryId = payerFactoryId,
                    PayeeFactoryId = payeeFactoryId,
                    Amount = amount,
                    Status = (int)PaymentStatus.Pending,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.OrderPayments.Add(payment);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Payment created: {payment.Id} for order {orderId}, amount: {amount}");
                return payment;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating payment: {ex.Message}");
                throw;
            }
        }

        /// <summary>
        /// Get payment by ID
        /// </summary>
        public async Task<OrderPayment> GetPaymentByIdAsync(long paymentId)
        {
            var payment = await _context.OrderPayments
                .Include(p => p.Order)
                .Include(p => p.PayerFactory)
                .Include(p => p.PayeeFactory)
                .FirstOrDefaultAsync(p => p.Id == paymentId);

            if (payment == null)
                throw new ArgumentException($"Payment {paymentId} not found");

            return payment;
        }

        /// <summary>
        /// Get all payments for an order
        /// </summary>
        public async Task<List<OrderPayment>> GetOrderPaymentsAsync(long orderId)
        {
            return await _context.OrderPayments
                .Include(p => p.PayerFactory)
                .Include(p => p.PayeeFactory)
                .Where(p => p.OrderId == orderId)
                .OrderByDescending(p => p.CreatedAt)
                .ToListAsync();
        }

        /// <summary>
        /// Get payments for a factory (as payer or payee)
        /// </summary>
        public async Task<List<OrderPayment>> GetFactoryPaymentsAsync(long factoryId, string role = "both")
        {
            var query = _context.OrderPayments
                .Include(p => p.Order)
                .Include(p => p.PayerFactory)
                .Include(p => p.PayeeFactory)
                .AsQueryable();

            if (role == "payer")
                query = query.Where(p => p.PayerFactoryId == factoryId);
            else if (role == "payee")
                query = query.Where(p => p.PayeeFactoryId == factoryId);
            else
                query = query.Where(p => p.PayerFactoryId == factoryId || p.PayeeFactoryId == factoryId);

            return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        }

        /// <summary>
        /// Process/complete payment
        /// </summary>
        public async Task<bool> ProcessPaymentAsync(
            long paymentId,
            string paymentMethod,
            string? transactionReference = null)
        {
            try
            {
                var payment = await _context.OrderPayments.FindAsync(paymentId);
                if (payment == null)
                    return false;

                if (payment.Status != (int)PaymentStatus.Pending)
                {
                    _logger.LogWarning($"Cannot process payment {paymentId} - status is not Pending");
                    return false;
                }

                payment.Status = (int)PaymentStatus.Paid;
                payment.PaymentMethod = paymentMethod;
                payment.TransactionReference = transactionReference;
                payment.CompletedAt = DateTime.UtcNow;
                payment.UpdatedAt = DateTime.UtcNow;

                _context.OrderPayments.Update(payment);

                // Update order payment status if all payments are paid
                var order = await _context.Orders.FindAsync(payment.OrderId);
                if (order != null)
                {
                    var allPaymentsPaid = await _context.OrderPayments
                        .Where(p => p.OrderId == payment.OrderId)
                        .AllAsync(p => p.Status == (int)PaymentStatus.Paid || p.Status == (int)PaymentStatus.Refunded);

                    if (allPaymentsPaid)
                    {
                        order.PaymentStatus = "Paid";
                        order.UpdatedAt = DateTime.UtcNow;
                        _context.Orders.Update(order);
                    }
                }

                await _context.SaveChangesAsync();

                _logger.LogInformation($"Payment {paymentId} processed successfully");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error processing payment: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Mark payment as failed
        /// </summary>
        public async Task<bool> MarkPaymentAsFailedAsync(long paymentId, string failureReason)
        {
            try
            {
                var payment = await _context.OrderPayments.FindAsync(paymentId);
                if (payment == null)
                    return false;

                payment.Status = (int)PaymentStatus.Failed;
                payment.FailedAt = DateTime.UtcNow;
                payment.Notes = failureReason;
                payment.UpdatedAt = DateTime.UtcNow;

                _context.OrderPayments.Update(payment);

                // Update order payment status
                var order = await _context.Orders.FindAsync(payment.OrderId);
                if (order != null)
                {
                    order.PaymentStatus = "Failed";
                    order.UpdatedAt = DateTime.UtcNow;
                    _context.Orders.Update(order);
                }

                await _context.SaveChangesAsync();

                _logger.LogWarning($"Payment {paymentId} marked as failed: {failureReason}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error marking payment as failed: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Refund a payment
        /// </summary>
        public async Task<bool> RefundPaymentAsync(long paymentId, string reason)
        {
            try
            {
                var payment = await _context.OrderPayments.FindAsync(paymentId);
                if (payment == null)
                    return false;

                if (payment.Status != (int)PaymentStatus.Paid)
                {
                    _logger.LogWarning($"Cannot refund payment {paymentId} - only paid payments can be refunded");
                    return false;
                }

                payment.Status = (int)PaymentStatus.Refunded;
                payment.UpdatedAt = DateTime.UtcNow;
                payment.Notes = $"Refunded: {reason}";

                _context.OrderPayments.Update(payment);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Payment {paymentId} refunded: {reason}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error refunding payment: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Get total amount paid for an order
        /// </summary>
        public async Task<decimal> GetTotalPaidForOrderAsync(long orderId)
        {
            return await _context.OrderPayments
                .Where(p => p.OrderId == orderId && p.Status == (int)PaymentStatus.Paid)
                .SumAsync(p => p.Amount);
        }

        /// <summary>
        /// Get outstanding balance for an order
        /// </summary>
        public async Task<decimal> GetOutstandingBalanceAsync(long orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
                return 0;

            decimal totalDue = order.TotalPrice;
            if (order.RecyclerProcessingFee.HasValue)
                totalDue += order.RecyclerProcessingFee.Value;

            decimal totalPaid = await GetTotalPaidForOrderAsync(orderId);
            return totalDue - totalPaid;
        }

        /// <summary>
        /// Get pending payments for a factory
        /// </summary>
        public async Task<List<OrderPayment>> GetPendingPaymentsAsync(long factoryId, string role = "payer")
        {
            var query = _context.OrderPayments
                .Include(p => p.Order)
                .Where(p => p.Status == (int)PaymentStatus.Pending)
                .AsQueryable();

            if (role == "payer")
                query = query.Where(p => p.PayerFactoryId == factoryId);
            else if (role == "payee")
                query = query.Where(p => p.PayeeFactoryId == factoryId);
            else
                query = query.Where(p => p.PayerFactoryId == factoryId || p.PayeeFactoryId == factoryId);

            return await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        }

        /// <summary>
        /// Get payment summary for a factory
        /// </summary>
        public async Task<PaymentSummary> GetPaymentSummaryAsync(long factoryId)
        {
            var receivable = await _context.OrderPayments
                .Where(p => p.PayeeFactoryId == factoryId && p.Status == (int)PaymentStatus.Pending)
                .SumAsync(p => p.Amount);

            var payable = await _context.OrderPayments
                .Where(p => p.PayerFactoryId == factoryId && p.Status == (int)PaymentStatus.Pending)
                .SumAsync(p => p.Amount);

            var paid = await _context.OrderPayments
                .Where(p => p.PayerFactoryId == factoryId && p.Status == (int)PaymentStatus.Paid)
                .SumAsync(p => p.Amount);

            var pending = await _context.OrderPayments
                .Where(p => (p.PayerFactoryId == factoryId || p.PayeeFactoryId == factoryId) &&
                           p.Status == (int)PaymentStatus.Pending)
                .SumAsync(p => p.Amount);

            var completed = await _context.OrderPayments
                .CountAsync(p => (p.PayerFactoryId == factoryId || p.PayeeFactoryId == factoryId) &&
                                 p.Status == (int)PaymentStatus.Paid);

            var failed = await _context.OrderPayments
                .CountAsync(p => (p.PayerFactoryId == factoryId || p.PayeeFactoryId == factoryId) &&
                                p.Status == (int)PaymentStatus.Failed);

            return new PaymentSummary
            {
                TotalReceivable = receivable,
                TotalPayable = payable,
                TotalPaid = paid,
                PendingPayments = pending,
                CompletedTransactions = completed,
                FailedTransactions = failed
            };
        }
    }
}
