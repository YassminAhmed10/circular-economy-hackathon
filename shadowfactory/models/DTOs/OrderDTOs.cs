using System;
using System.Collections.Generic;

namespace shadowfactory.Models.DTOs
{
    // ════════════════════════════════════════
    // EXISTING DTOs (BACKWARD COMPATIBLE)
    // ════════════════════════════════════════
    public class OrderDto
    {
        public long Id { get; set; }
        public long WasteListingId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string WasteType { get; set; } = string.Empty;
        public string WasteCategory { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string CurrencyCode { get; set; } = "EGP";
        public string BuyerName { get; set; } = string.Empty;
        public string SellerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string FormattedOrderDate => OrderDate.ToString("yyyy-MM-dd");
        public string? FormattedDeliveryDate => DeliveryDate?.ToString("yyyy-MM-dd") ?? "-";

        // ✅ NEW: Payment and Recycler Fields
        public decimal TotalPrice { get; set; }
        public decimal? RecyclerProcessingFee { get; set; }
        public string OrderStatus { get; set; } = "Pending";
        public string PaymentStatus { get; set; } = "Pending";
        public string? RecyclerStatus { get; set; } = "None";
        public int? RecyclerId { get; set; }
        public string? RecyclerName { get; set; }

        // ✅ NEW: Order Type and Delivery Fields
        public string? OrderType { get; set; }
        public string? RecipientName { get; set; }
        public string? RecipientPhone { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? Governorate { get; set; }
        public string? DeliveryMethod { get; set; }
        public string? PaymentMethod { get; set; }
    }

    public class CreateOrderRequest
    {
        public long WasteListingId { get; set; }
        public decimal Amount { get; set; }
        public string? Notes { get; set; }
        public string? OrderType { get; set; } = "direct";
        public string? RecipientName { get; set; }
        public string? RecipientPhone { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? Governorate { get; set; }
        public string? DeliveryMethod { get; set; }
        public string? PaymentMethod { get; set; }
        public long? RecyclerId { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        public string Status { get; set; } = string.Empty;
        public DateTime? DeliveryDate { get; set; }
    }

    public class OrderStatsDto
    {
        public int TotalOrders { get; set; }
        public int CompletedOrders { get; set; }
        public int PendingOrders { get; set; }
        public int DeliveringOrders { get; set; }
        public int CancelledOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public string CurrencyCode { get; set; } = "EGP";
        public Dictionary<string, int> OrdersByStatus { get; set; } = new();
        public Dictionary<string, decimal> RevenueByMonth { get; set; } = new();
    }

    public class OrderFilterRequest
    {
        public string? Status { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public long? FactoryId { get; set; }
        public string? SearchTerm { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    // ════════════════════════════════════════
    // NEW: PAYMENT DTOs
    // ════════════════════════════════════════
    public class OrderPaymentDto
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public string PaymentTypeDisplay => PaymentType == 0 ? "Order Payment" : "Recycler Fee";
        public int PaymentType { get; set; }
        public long PayerFactoryId { get; set; }
        public string PayerFactoryName { get; set; } = string.Empty;
        public long PayeeFactoryId { get; set; }
        public string PayeeFactoryName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string FormattedAmount => $"{Amount:C0}";
        public int Status { get; set; }
        public string StatusDisplay => Status switch
        {
            0 => "Pending",
            1 => "Paid",
            2 => "Failed",
            3 => "Refunded",
            _ => "Unknown"
        };
        public string? PaymentMethod { get; set; }
        public string? TransactionReference { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class CreatePaymentRequest
    {
        public long OrderId { get; set; }
        public string PaymentMethod { get; set; } = string.Empty;
        public string? TransactionReference { get; set; }
    }

    public class PaymentSummaryDto
    {
        public decimal TotalReceivable { get; set; }
        public decimal TotalPayable { get; set; }
        public decimal TotalPaid { get; set; }
        public decimal PendingPayments { get; set; }
        public int CompletedTransactions { get; set; }
        public int FailedTransactions { get; set; }
    }

    // ════════════════════════════════════════
    // NEW: RECYCLER INTEGRATION DTOs
    // ════════════════════════════════════════
    public class RequestRecyclerDto
    {
        public long OrderId { get; set; }
        public int RecyclerId { get; set; }
        public decimal ProcessingFee { get; set; }
        public string? SpecialInstructions { get; set; }
    }

    public class CompleteProcessingRequest
    {
        public long RecyclingOrderId { get; set; }
        public decimal OutputQuantity { get; set; }
        public string OutputMaterialType { get; set; } = string.Empty;
        public string? ProcessDescriptionActual { get; set; }
        public string? BeforePhotoUrl { get; set; }
        public string? AfterPhotoUrl { get; set; }
    }

    public class SuitableRecyclerDto
    {
        public int Id { get; set; }
        public string CompanyName { get; set; } = string.Empty;
        public string CompanyNameAr { get; set; } = string.Empty;
        public string ContactEmail { get; set; } = string.Empty;
        public string ContactPhone { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int TotalConversions { get; set; }
        public bool IsVerified { get; set; }
        public List<string> Capabilities { get; set; } = new();
    }

    public class RecyclerPerformanceDto
    {
        public int RecyclerId { get; set; }
        public string RecyclerName { get; set; } = string.Empty;
        public int TotalOrdersProcessed { get; set; }
        public int TotalOrdersPending { get; set; }
        public int TotalOrdersRejected { get; set; }
        public decimal AverageEfficiencyPercent { get; set; }
        public decimal TotalWasteProcessed { get; set; }
        public decimal TotalOutputGenerated { get; set; }
        public decimal EstimatedCO2Avoided { get; set; }
        public decimal Rating { get; set; }
    }
}