using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace shadowfactory.Models.DTOs
{
    // ==================== API RESPONSE DTOs ====================
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public T? Data { get; set; }
        public List<string> Errors { get; set; } = new List<string>();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    public class ApiResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public List<string> Errors { get; set; } = new List<string>();
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }

    // ==================== FACTORY DTO ====================
    public class FactoryDto
    {
        public long Id { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string FactoryNameEn { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Fax { get; set; }
        public string Email { get; set; } = string.Empty;
        public string? Website { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerPhone { get; set; } = string.Empty;
        public string? OwnerEmail { get; set; }
        public string TaxNumber { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public int? EstablishmentYear { get; set; }
        public int? EmployeeCount { get; set; }
        public decimal FactorySize { get; set; }
        public decimal ProductionCapacity { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsVerified { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string? DescriptionAr { get; set; }
        public string? DescriptionEn { get; set; }
        public decimal? Rating { get; set; }
        public int? TotalReviews { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    // ==================== AUTH DTOs ====================
    public class UserLoginRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public string? TwoFactorCode { get; set; }
        public string? TwoFactorRecoveryCode { get; set; }
        public bool RememberMe { get; set; } = false;
    }

    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public UserDto User { get; set; } = new UserDto();
        public FactoryDto? Factory { get; set; }
    }

    public class ChangePasswordRequest
    {
        [Required]
        public string CurrentPassword { get; set; } = string.Empty;

        [Required]
        [MinLength(6)]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        [Compare("NewPassword")]
        public string ConfirmPassword { get; set; } = string.Empty;
    }

    // ==================== USER DTOs ====================
    public class UserDto
    {
        public long Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public long? FactoryId { get; set; }
        public DateTime? LastLogin { get; set; }
        public string? Phone { get; set; }
        public bool EmailNotifications { get; set; } = true;
        public bool AppNotifications { get; set; } = true;
        public bool PublicProfile { get; set; } = true;
        public DateTime RegistrationDate { get; set; }
    }

    public class ProfileDto
    {
        public long Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public long? FactoryId { get; set; }
        public FactoryDto? Factory { get; set; }
        public bool EmailNotifications { get; set; } = true;
        public bool AppNotifications { get; set; } = true;
        public bool PublicProfile { get; set; } = true;
        public DateTime RegistrationDate { get; set; }
        public DateTime? LastLogin { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class UpdateProfileRequest
    {
        public string FullName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string FactoryName { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerPhone { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public int? EstablishmentYear { get; set; }
        public decimal? ProductionCapacity { get; set; }
        public string? MainProducts { get; set; }

        // ✅ حقل الصورة في التحديث
        public string? LogoBase64 { get; set; }

        public bool EmailNotifications { get; set; } = true;
        public bool AppNotifications { get; set; } = true;
        public bool PublicProfile { get; set; } = true;
    }

    // ==================== REGISTRATION DTOs ====================
    public class FactoryRegistrationRequest
    {
        [Required]
        public string FactoryName { get; set; } = string.Empty;

        public string? FactoryNameEn { get; set; }

        [Required]
        public string IndustryType { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        // ✅ حذفنا [Phone] عشان بعض الـ formats المصرية بتفشل
        public string Phone { get; set; } = string.Empty;

        public string? Fax { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        // ✅ حذفنا [Url] عشان null بيسبب مشكلة
        public string? Website { get; set; }

        [Required]
        public string OwnerName { get; set; } = string.Empty;

        // ✅ حذفنا [Phone] من OwnerPhone - السبب الرئيسي للـ 400 error
        public string? OwnerPhone { get; set; }

        [EmailAddress]
        public string? OwnerEmail { get; set; }

        [Required]
        public string TaxNumber { get; set; } = string.Empty;

        [Required]
        public string RegistrationNumber { get; set; } = string.Empty;

        // ✅ Range من 1900 إلى current year بس مش بنضيف validation هنا
        // لأن بنعمل validation في الكود
        public int? EstablishmentYear { get; set; }

        public int? NumberOfEmployees { get; set; }

        // ✅ FactorySize: مش Required من الـ frontend، بنديلها default
        public decimal FactorySize { get; set; } = 1000;

        // ✅ ProductionCapacity: Range من 0 مش 0.01
        [Range(0, double.MaxValue)]
        public decimal ProductionCapacity { get; set; } = 0;

        // ✅ الحقل الأساسي للصورة - Base64 string
        public string? LogoBase64 { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        // ── معلومات إضافية ──
        public string? DescriptionAr { get; set; }
        public string? DescriptionEn { get; set; }

        // ── بيانات المخلفات ──
        public List<string> RegistrationPurpose { get; set; } = new();
        public List<string> WasteTypesToSell { get; set; } = new();
        public decimal? WasteAmountToSell { get; set; }
        public string? WasteUnitToSell { get; set; }
        public string? SellFrequency { get; set; }
        public string? WasteDescription { get; set; }
        public List<string> WasteTypesToBuy { get; set; } = new();
        public decimal? WasteAmountToBuy { get; set; }
        public string? WasteUnitToBuy { get; set; }
        public string? BuyFrequency { get; set; }
        public string? BuyingPurpose { get; set; }
    }

    public class FactoryRegistrationResponse
    {
        public long FactoryId { get; set; }
        public long UserId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool Success { get; set; }
        public DateTime RegisteredAt { get; set; }
        public string VerificationToken { get; set; } = string.Empty;
    }

    // ==================== FACTORY PROFILE DTOs ====================
    public class FactoryProfileDto
    {
        public bool IsVerified { get; set; }
        public long FactoryId { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerPhone { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public int? EstablishmentYear { get; set; }
        public decimal? ProductionCapacity { get; set; }
        public string ProductionUnit { get; set; } = "ton";
        public string? MainProducts { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime JoinedDate { get; set; }
        public decimal? Rating { get; set; }
        public int? TotalReviews { get; set; }
        public int ActiveListings { get; set; }
        public int CompletedOrders { get; set; }
        // ✅ LogoUrl: هيرجع الـ Base64 string اللي اتحفظ في الـ DB
        public string? LogoUrl { get; set; }
        public List<string> RegistrationPurpose { get; set; } = new();
        public List<WasteItemDto> WastesForSale { get; set; } = new();
        public List<PurchaseItemDto> PurchaseRequests { get; set; } = new();
    }

    public class WasteItemDto
    {
        public int WasteTypeId { get; set; }
        public string WasteTypeName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "ton";
        public string Frequency { get; set; } = "monthly";
        public string? Description { get; set; }
    }

    public class PurchaseItemDto
    {
        public int WasteTypeId { get; set; }
        public string WasteTypeName { get; set; } = string.Empty;
        public decimal Quantity { get; set; }
        public string Unit { get; set; } = "ton";
        public string Frequency { get; set; } = "monthly";
        public string? Purpose { get; set; }
    }

    // ==================== FILE UPLOAD ====================
    public class FileUploadResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string? FileUrl { get; set; }
        public string? FileName { get; set; }
        public long FileSize { get; set; }
        public string? ContentType { get; set; }
    }

    // ==================== WASTE LISTING DTOs ====================
    public class WasteListingDto
    {
        public long Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string? TypeEn { get; set; }
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string Status { get; set; } = string.Empty;
        public long FactoryId { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? TitleAr { get; set; }
        public string? TitleEn { get; set; }
        public string? DescriptionAr { get; set; }
        public string? DescriptionEn { get; set; }
        public string? CompanyNameAr { get; set; }
        public string? CompanyNameEn { get; set; }
        public string? LocationAr { get; set; }
        public string? LocationEn { get; set; }
        public string? WeightAr { get; set; }
        public string? WeightEn { get; set; }
        public decimal? Rating { get; set; }
        public int? Reviews { get; set; }
        public string? Badge { get; set; }
        public string? Specifications { get; set; }
        public decimal? SellerRating { get; set; }
        public int? SellerTotalSales { get; set; }
        public string? SellerJoined { get; set; }
        public string? SellerWhatsapp { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? LocationLink { get; set; }
    }

    public class WasteListingCreateRequest
    {
        public string Type { get; set; } = string.Empty;
        public string? TypeEn { get; set; }
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string? Description { get; set; }
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? TitleAr { get; set; }
        public string? TitleEn { get; set; }
        public string? DescriptionAr { get; set; }
        public string? DescriptionEn { get; set; }
        public string? CompanyNameAr { get; set; }
        public string? CompanyNameEn { get; set; }
        public string? LocationAr { get; set; }
        public string? LocationEn { get; set; }
        public string? WeightAr { get; set; }
        public string? WeightEn { get; set; }
        public decimal? Rating { get; set; }
        public int? Reviews { get; set; }
        public string? Badge { get; set; }
        public string? Specifications { get; set; }
        public decimal? SellerRating { get; set; }
        public int? SellerTotalSales { get; set; }
        public string? SellerJoined { get; set; }
        public string? SellerWhatsapp { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? LocationLink { get; set; }
    }

    public class WasteListingUpdateRequest
    {
        public string? Type { get; set; }
        public string? TypeEn { get; set; }
        public decimal? Amount { get; set; }
        public string? Unit { get; set; }
        public decimal? Price { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public string? Status { get; set; }
        public string? TitleAr { get; set; }
        public string? TitleEn { get; set; }
        public string? DescriptionAr { get; set; }
        public string? DescriptionEn { get; set; }
        public string? CompanyNameAr { get; set; }
        public string? CompanyNameEn { get; set; }
        public string? LocationAr { get; set; }
        public string? LocationEn { get; set; }
        public string? WeightAr { get; set; }
        public string? WeightEn { get; set; }
        public decimal? Rating { get; set; }
        public int? Reviews { get; set; }
        public string? Badge { get; set; }
        public string? Specifications { get; set; }
        public decimal? SellerRating { get; set; }
        public int? SellerTotalSales { get; set; }
        public string? SellerJoined { get; set; }
        public string? SellerWhatsapp { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public string? LocationLink { get; set; }
    }
}