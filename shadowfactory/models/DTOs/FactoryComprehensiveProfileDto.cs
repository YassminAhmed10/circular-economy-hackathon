using System;
using System.Collections.Generic;

namespace shadowfactory.Models.DTOs
{
    /// <summary>
    /// 🏭 شامل: ملف كامل المصنع - كل بيانات المصنع في مكان واحد
    /// Comprehensive Factory File - all factory data organized by type
    /// </summary>
    public class FactoryComprehensiveProfileDto
    {
        // ════════════════════════════════════════════════════════════
        // PART 1: BASIC FACTORY INFO - معلومات أساسية عن المصنع
        // ════════════════════════════════════════════════════════════
        public FactoryBasicInfoDto BasicInfo { get; set; } = new();

        // ════════════════════════════════════════════════════════════
        // PART 2: WASTE ANNOUNCEMENTS - الإعلانات / الإعلانات المنشورة
        // ════════════════════════════════════════════════════════════
        public FactoryWasteAnnouncementsDto WasteAnnouncements { get; set; } = new();

        // ════════════════════════════════════════════════════════════
        // PART 3: ORDERS - الطلبات والأوردرات
        // ════════════════════════════════════════════════════════════
        public FactoryOrdersDto Orders { get; set; } = new();

        // ════════════════════════════════════════════════════════════
        // PART 4: PARTNERSHIPS & RELATIONSHIPS - الشراكات والعلاقات
        // ════════════════════════════════════════════════════════════
        public FactoryPartnershipsDto Partnerships { get; set; } = new();

        // ════════════════════════════════════════════════════════════
        // PART 5: RECYCLER RELATIONSHIPS - علاقات إعادة التدوير
        // ════════════════════════════════════════════════════════════
        public FactoryRecyclerRelationsDto RecyclerRelations { get; set; } = new();

        // ════════════════════════════════════════════════════════════
        // PART 6: STATISTICS & METRICS - إحصائيات وقياسات
        // ════════════════════════════════════════════════════════════
        public FactoryStatisticsDto Statistics { get; set; } = new();

        // ════════════════════════════════════════════════════════════
        // METADATA
        // ════════════════════════════════════════════════════════════
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        public string Version { get; set; } = "1.0";
    }

    // ════════════════════════════════════════════════════════════════════════
    // PART 1: BASIC FACTORY INFORMATION
    // ════════════════════════════════════════════════════════════════════════
    public class FactoryBasicInfoDto
    {
        public long FactoryId { get; set; }
        public string FactoryNameAr { get; set; } = string.Empty;
        public string FactoryNameEn { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public bool IsVerified { get; set; }
        public string Status { get; set; } = "Active";
        public DateTime JoinedDate { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public decimal? Rating { get; set; }
        public int? TotalReviews { get; set; }
        public int EmployeeCount { get; set; }
        public string? DescriptionAr { get; set; }
        public string? DescriptionEn { get; set; }
    }

    // ════════════════════════════════════════════════════════════════════════
    // PART 2: WASTE ANNOUNCEMENTS (Published by this factory)
    // الإعلانات اللي نشرها المصنع
    // ════════════════════════════════════════════════════════════════════════
    public class FactoryWasteAnnouncementsDto
    {
        /// كل الإعلانات المنشورة
        public List<WasteAnnouncementItemDto> PublishedAnnouncements { get; set; } = new();

        /// إحصائيات الإعلانات
        public int TotalPublished { get; set; }
        public int TotalActive { get; set; }
        public int TotalSold { get; set; }
        public int TotalExpired { get; set; }
    }

    public class WasteAnnouncementItemDto
    {
        public long Id { get; set; }
        public string TitleAr { get; set; } = string.Empty;
        public string? TitleEn { get; set; }
        public string WasteType { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "kg";
        public decimal? PricePerUnit { get; set; }
        public string? Description { get; set; }
        public string Status { get; set; } = "Active"; // Active, Sold, Expired
        public DateTime CreatedDate { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public int Views { get; set; }
        public int OffersReceived { get; set; }
        public string? ImageUrl { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    // ════════════════════════════════════════════════════════════════════════
    // PART 3: ORDERS - All orders related to this factory
    // الطلبات: طلبات اشتروا فيها + طلبات شنجوا من غيرهم
    // ════════════════════════════════════════════════════════════════════════
    public class FactoryOrdersDto
    {
        /// كل الطلبات الي المصنع طلبها (يشتري)
        public List<PurchaseOrderDto> PurchaseOrders { get; set; } = new();

        /// كل الطلبات الي وصلت للمصنع من غيره (يبيع)
        public List<SalesOrderDto> SalesOrders { get; set; } = new();

        /// إحصائيات
        public FactoryOrderStatsDto Statistics { get; set; } = new();
    }

    public class PurchaseOrderDto
    {
        public long OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string WasteType { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "kg";
        public decimal TotalPrice { get; set; }
        public string SellerFactoryName { get; set; } = string.Empty;
        public long SellerFactoryId { get; set; }
        public string Status { get; set; } = "Pending"; // Pending, Confirmed, Delivered, Completed
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string? DeliveryLocation { get; set; }
        public string PaymentStatus { get; set; } = "Unpaid";
    }

    public class SalesOrderDto
    {
        public long OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string WasteType { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "kg";
        public decimal TotalPrice { get; set; }
        public string BuyerFactoryName { get; set; } = string.Empty;
        public long BuyerFactoryId { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime OrderDate { get; set; }
        public DateTime? DeliveryDate { get; set; }
        public string PaymentStatus { get; set; } = "Unpaid";
    }

    public class FactoryOrderStatsDto
    {
        public int TotalPurchaseOrders { get; set; }
        public int TotalSalesOrders { get; set; }
        public int CompletedPurchases { get; set; }
        public int CompletedSales { get; set; }
        public decimal TotalPurchaseValue { get; set; }
        public decimal TotalSalesValue { get; set; }
    }

    // ════════════════════════════════════════════════════════════════════════
    // PART 4: PARTNERSHIPS & RELATIONSHIPS
    // الشراكات: المصانع الي اتعامل معاهم (شرا منهم / بتاع لهم)
    // ════════════════════════════════════════════════════════════════════════
    public class FactoryPartnershipsDto
    {
        /// المصانع اللي اشتري منهم
        public List<PartnerFactoryDto> SupplierFactories { get; set; } = new();

        /// المصانع اللي بتاع لهم
        public List<PartnerFactoryDto> CustomerFactories { get; set; } = new();

        /// إحصائيات
        public int TotalSuppliers { get; set; }
        public int TotalCustomers { get; set; }
        public int ActivePartnerships { get; set; }
    }

    public class PartnerFactoryDto
    {
        public long FactoryId { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string WasteTypesTraded { get; set; } = string.Empty; // e.g., "Plastic, Metal"
        public int OrderCount { get; set; }
        public decimal TotalValue { get; set; }
        public decimal? PartnerRating { get; set; }
        public DateTime FirstOrderDate { get; set; }
        public DateTime LastOrderDate { get; set; }
        public string Status { get; set; } = "Active";
    }

    // ════════════════════════════════════════════════════════════════════════
    // PART 5: RECYCLER RELATIONSHIPS
    // علاقات إعادة التدوير
    // ════════════════════════════════════════════════════════════════════════
    public class FactoryRecyclerRelationsDto
    {
        /// شركات إعادة التدوير المسجلة
        public List<RecyclerPartnerDto> RegisteredRecyclers { get; set; } = new();

        /// طلبات إعادة التدوير
        public List<RecyclingOrderDto> RecyclingOrders { get; set; } = new();

        /// Statistics
        public int TotalRecyclers { get; set; }
        public int ActiveRecyclingOrders { get; set; }
        public int CompletedRecycling { get; set; }
        public decimal TotalRecycledQuantity { get; set; }
    }

    public class RecyclerPartnerDto
    {
        public long RecyclerId { get; set; }
        public string RecyclerName { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string? SpecializedIn { get; set; } // e.g., "Plastic, Packaging"
        public string CertificationLevel { get; set; } = string.Empty;
        public decimal? Rating { get; set; }
        public int OrdersCompleted { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string Status { get; set; } = "Active";
    }

    public class RecyclingOrderDto
    {
        public long OrderId { get; set; }
        public string OrderNumber { get; set; } = string.Empty;
        public string RecyclerName { get; set; } = string.Empty;
        public long RecyclerId { get; set; }
        public string WasteType { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "kg";
        public string RecyclingType { get; set; } = string.Empty; // e.g., "Plastic-to-Bags"
        public string Status { get; set; } = "Pending";
        public DateTime OrderDate { get; set; }
        public DateTime? CompletionDate { get; set; }
        public string EnvironmentalImpact { get; set; } = string.Empty; // e.g., "CO2 saved: 100kg"
    }

    // ════════════════════════════════════════════════════════════════════════
    // PART 6: STATISTICS & METRICS
    // إحصائيات شاملة عن نشاط المصنع
    // ════════════════════════════════════════════════════════════════════════
    public class FactoryStatisticsDto
    {
        // نشاط الإعلانات
        public int TotalAnnouncementsPublished { get; set; }
        public int ActiveListings { get; set; }
        public int TotalListingViews { get; set; }
        public int TotalOffersReceived { get; set; }

        // عدد المعاملات
        public int TotalTransactions { get; set; }
        public int SuccessfulTransactions { get; set; }
        public decimal TransactionSuccessRate { get; set; }

        // الكميات والقيم
        public decimal TotalWasteHandled { get; set; } // بالطن
        public decimal TotalTransactionValue { get; set; } // بالعملة
        public decimal AverageOrderValue { get; set; }

        // التقييمات
        public decimal OverallRating { get; set; }
        public int TotalReviews { get; set; }

        // البيئة
        public decimal EstimatedCO2Saved { get; set; } // kg
        public int TransactionsWithRecyclers { get; set; }
        public decimal PercentageRecycled { get; set; }

        // النمو
        public int NewPartnershipsThisMonth { get; set; }
        public int OrdersThisMonth { get; set; }
        public string MembershipLevel { get; set; } = "Standard"; // Bronze, Silver, Gold, Platinum

        // التواريخ
        public DateTime? FirstTransactionDate { get; set; }
        public DateTime? LastTransactionDate { get; set; }
        public int MonthsActive { get; set; }
    }
}
