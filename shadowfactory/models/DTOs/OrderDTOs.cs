using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace shadowfactory.Models.DTOs
{
    public class OrderDto
    {
        public long Id { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string WasteType { get; set; } = string.Empty;
        public string WasteCategory { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string FormattedPrice => $"{Price:N0} جنيه";
        public string BuyerName { get; set; } = string.Empty;
        public string SellerName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public DateTime? CompletedDate { get; set; }
        public string FormattedOrderDate => OrderDate.ToString("yyyy-MM-dd");
        public string? FormattedDeliveryDate => DeliveryDate?.ToString("yyyy-MM-dd") ?? "-";
    }

    public class CreateOrderRequest
    {
        [Required]
        public long WasteListingId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [StringLength(500)]
        public string? Notes { get; set; }
    }

    public class UpdateOrderStatusRequest
    {
        [Required]
        [StringLength(50)]
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
        public string FormattedTotalRevenue => $"{TotalRevenue:N0} جنيه";
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
}