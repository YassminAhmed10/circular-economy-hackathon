using System;
using System.Collections.Generic;

namespace shadowfactory.Models.DTOs
{
    // ⭐⭐ DASHBOARD-SPECIFIC DTOs (RENAMED TO AVOID CONFLICTS) ⭐⭐

    // Dashboard Statistics - RENAMED
    public class DashboardStatsResponse
    {
        public decimal TotalWaste { get; set; } // in tons
        public int TotalViews { get; set; }
        public int ActiveOrders { get; set; }
        public decimal TotalRevenue { get; set; }
        public int ActiveListings { get; set; }
        public int PendingTransactions { get; set; }
        public decimal CarbonSaved { get; set; } // in tons
        public decimal WaterSaved { get; set; } // in cubic meters
    }

    // Quick Stats
    public class QuickStatDto
    {
        public string Title { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Color { get; set; } = "emerald";
        public string Subtitle { get; set; } = string.Empty;
        public decimal? ChangePercentage { get; set; }
    }

    // Recent Transaction - RENAMED
    public class RecentTransactionDashboardDto
    {
        public long Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Amount { get; set; } = string.Empty;
        public string Price { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string StatusColor { get; set; } = "emerald";
        public string TransactionType { get; set; } = "buy"; // buy or sell
    }

    // Waste Listing (for dashboard) - RENAMED
    public class DashboardWasteListingDto
    {
        public long Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Status { get; set; } = string.Empty;
        public int Views { get; set; }
        public int Offers { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsMyListing { get; set; } = false;
    }

    // My Listing
    public class MyListingDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int Views { get; set; }
        public int Offers { get; set; }
        public string Price { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    // Partner - RENAMED
    public class DashboardPartnerDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public decimal Rating { get; set; }
        public int CompletedDeals { get; set; }
        public bool IsVerified { get; set; }
        public string? LogoUrl { get; set; }
        public string? Description { get; set; }
    }

    // Quick Action
    public class QuickActionDto
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public string Route { get; set; } = string.Empty;
        public string ButtonText { get; set; } = string.Empty;
        public string ButtonColor { get; set; } = "emerald";
    }

    // Complete Dashboard Response
    public class DashboardResponseDto
    {
        public DashboardStatsResponse Stats { get; set; } = new DashboardStatsResponse();
        public List<QuickStatDto> QuickStats { get; set; } = new List<QuickStatDto>();
        public List<RecentTransactionDashboardDto> RecentTransactions { get; set; } = new List<RecentTransactionDashboardDto>();
        public List<DashboardWasteListingDto> MarketItems { get; set; } = new List<DashboardWasteListingDto>();
        public List<MyListingDto> MyListings { get; set; } = new List<MyListingDto>();
        public List<DashboardPartnerDto> Partners { get; set; } = new List<DashboardPartnerDto>();
        public List<QuickActionDto> QuickActions { get; set; } = new List<QuickActionDto>();
        public UserDto User { get; set; } = new UserDto();
        public FactoryDto? Factory { get; set; }
        public string LastUpdate { get; set; } = string.Empty;
        public string WelcomeMessage { get; set; } = string.Empty;
    }

    // Create Waste Listing Request - RENAMED
    public class DashboardCreateWasteListingRequest
    {
        public string Type { get; set; } = string.Empty;
        public string? TypeEn { get; set; }
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ImageBase64 { get; set; }
    }

    // Update Waste Listing Request - RENAMED
    public class DashboardUpdateWasteListingRequest
    {
        public string? Type { get; set; }
        public decimal? Amount { get; set; }
        public string? Unit { get; set; }
        public decimal? Price { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageBase64 { get; set; }
        public string? Status { get; set; }
    }

    // Category DTO
    public class CategoryDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int Count { get; set; }
        public string Icon { get; set; } = "Package";
        public string Color { get; set; } = "emerald";
    }

    // Transaction Create Request - RENAMED
    public class DashboardCreateTransactionRequest
    {
        public long WasteListingId { get; set; }
        public decimal Amount { get; set; }
        public string? Notes { get; set; }
        public decimal? OfferPrice { get; set; }
    }

    // Transaction Response - RENAMED
    public class DashboardTransactionDto
    {
        public long Id { get; set; }
        public DashboardWasteListingDto WasteListing { get; set; } = new DashboardWasteListingDto();
        public FactoryDto BuyerFactory { get; set; } = new FactoryDto();
        public FactoryDto SellerFactory { get; set; } = new FactoryDto();
        public string WasteType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Status { get; set; } = string.Empty;
        public string StatusText { get; set; } = string.Empty;
        public string StatusColor { get; set; } = "gray";
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool IsBuyer { get; set; }
        public bool IsSeller { get; set; }
    }

    // Analytics Data
    public class AnalyticsDataDto
    {
        public List<MonthlyRevenueDto> MonthlyRevenue { get; set; } = new List<MonthlyRevenueDto>();
        public List<WasteCategoryDistributionDto> CategoryDistribution { get; set; } = new List<WasteCategoryDistributionDto>();
        public List<TopPartnerDto> TopPartners { get; set; } = new List<TopPartnerDto>();
        public EnvironmentalImpactDto EnvironmentalImpact { get; set; } = new EnvironmentalImpactDto();
    }

    public class MonthlyRevenueDto
    {
        public string Month { get; set; } = string.Empty;
        public decimal Revenue { get; set; }
        public int Transactions { get; set; }
    }

    public class WasteCategoryDistributionDto
    {
        public string Category { get; set; } = string.Empty;
        public string CategoryName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal Revenue { get; set; }
        public string Color { get; set; } = "emerald";
    }

    public class TopPartnerDto
    {
        public string Name { get; set; } = string.Empty;
        public int Transactions { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Rating { get; set; }
    }

    public class EnvironmentalImpactDto
    {
        public decimal CarbonSaved { get; set; } // in tons
        public decimal WaterSaved { get; set; } // in cubic meters
        public decimal EnergySaved { get; set; } // in kWh
        public decimal LandfillDiverted { get; set; } // in tons
    }
}