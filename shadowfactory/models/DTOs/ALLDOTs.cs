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

        // Factory details
        public string FactoryName { get; set; } = string.Empty;
        public string IndustryType { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string TaxNumber { get; set; } = string.Empty;

        // Settings
        public bool EmailNotifications { get; set; } = true;
        public bool AppNotifications { get; set; } = true;
        public bool PublicProfile { get; set; } = true;
    }

    public class ProfileStatsDto
    {
        public int ActiveListings { get; set; }
        public int CompletedOrders { get; set; }
        public decimal Rating { get; set; }
        public int CustomerSatisfaction { get; set; }
    }

    // ==================== FACTORY DTOs ====================
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

    // ==================== REGISTRATION DTOs ====================
    public class FactoryRegistrationRequest
    {
        [Required]
        public string FactoryName { get; set; } = string.Empty;

        public string FactoryNameEn { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Address { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string Phone { get; set; } = string.Empty;

        public string? Fax { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Url]
        public string? Website { get; set; }

        [Required]
        public string OwnerName { get; set; } = string.Empty;

        [Required]
        [Phone]
        public string OwnerPhone { get; set; } = string.Empty;

        [EmailAddress]
        public string? OwnerEmail { get; set; }

        [Required]
        public string TaxNumber { get; set; } = string.Empty;

        [Required]
        public string RegistrationNumber { get; set; } = string.Empty;

        [Required]
        public string IndustryType { get; set; } = string.Empty;

        [Range(1900, 2100)]
        public int? EstablishmentYear { get; set; }

        [Range(1, 100000)]
        public int? NumberOfEmployees { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal FactorySize { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal ProductionCapacity { get; set; }

        public string? LogoBase64 { get; set; }

        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        public List<WasteTypeDTO> WasteTypes { get; set; } = new List<WasteTypeDTO>();
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

    public class FactoryDetailsResponse
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
        public decimal FactorySize { get; set; }
        public int EmployeeCount { get; set; }
        public decimal ProductionCapacity { get; set; }
        public string? LogoUrl { get; set; }
        public bool IsVerified { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime RegistrationDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<WasteTypeDetailDTO> WasteTypes { get; set; } = new List<WasteTypeDetailDTO>();
        public string? DescriptionAr { get; set; }
        public string? DescriptionEn { get; set; }
        public decimal? Rating { get; set; }
        public int? TotalReviews { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
    }

    // ==================== WASTE TYPE DTOs ====================
    public class WasteTypeDTO
    {
        [Required]
        public string WasteCode { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public string Unit { get; set; } = "kg";

        [Required]
        public string Frequency { get; set; } = "monthly";

        public string? Description { get; set; }
    }

    public class WasteTypeDetailDTO
    {
        public string WasteCode { get; set; } = string.Empty;
        public string WasteNameAr { get; set; } = string.Empty;
        public string WasteNameEn { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class WasteTypeDto
    {
        public string WasteCode { get; set; } = string.Empty;
        public string WasteNameAr { get; set; } = string.Empty;
        public string WasteNameEn { get; set; } = string.Empty;
    }

    // ==================== WASTE LISTING DTOs ====================
    public class WasteListingCreateRequest
    {
        [Required]
        public string Type { get; set; } = string.Empty;

        [Required]
        public string TypeEn { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        [Required]
        public string Unit { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }

        public string? Description { get; set; }

        [Required]
        public string Category { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        // New multilingual fields
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

    public class WasteListingDto
    {
        public long Id { get; set; }
        public string Type { get; set; } = string.Empty;
        public string TypeEn { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Unit { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public string? ImageBase64 { get; set; }
        public string Status { get; set; } = string.Empty;
        public long FactoryId { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public bool IsExpired => ExpiresAt.HasValue && ExpiresAt.Value < DateTime.UtcNow;

        // New multilingual fields
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
        [Range(0.01, double.MaxValue)]
        public decimal? Amount { get; set; }
        public string? Unit { get; set; }
        [Range(0.01, double.MaxValue)]
        public decimal? Price { get; set; }
        public string? Description { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; }
        public string? ImageBase64 { get; set; }
        public string? Status { get; set; }

        // New multilingual fields
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



    // ==================== CATEGORY DTOs ====================
   // public class CategoryDto
    //{
        //public string Id { get; set; } = string.Empty;
        //public string Name { get; set; } = string.Empty;
        //public int Count { get; set; }
        //public string Icon { get; set; } = string.Empty;
      //  public string Color { get; set; } = string.Empty;
    //}

    // ==================== WASTE LISTING FILTER ====================
    public class WasteListingFilter
    {
        public string? Category { get; set; }
        public string? Type { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public decimal? MinAmount { get; set; }
        public decimal? MaxAmount { get; set; }
        public string? Location { get; set; }
        public bool? ActiveOnly { get; set; } = true;
        public string? SortBy { get; set; }
        public bool? SortDescending { get; set; }
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }

    // ==================== PAGINATED RESPONSE ====================
    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
        public bool HasPrevious => PageNumber > 1;
        public bool HasNext => PageNumber < TotalPages;
    }

    // ==================== DASHBOARD STATISTICS ====================
    public class DashboardStatisticsDto
    {
        public int TotalListings { get; set; }
        public int ActiveListings { get; set; }
        public int TotalTransactions { get; set; }
        public int PendingTransactions { get; set; }
        public int CompletedTransactions { get; set; }
        public decimal TotalRevenue { get; set; }
        public int TotalPartners { get; set; }
        public int TotalFactories { get; set; }
        public int VerifiedFactories { get; set; }
    }


    // ==================== NOTIFICATION DTOs ====================
    public class NotificationDto
    {
        public long Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? ActionUrl { get; set; }
    }

    // ==================== AUDIT LOG DTOs ====================
    public class AuditLogDto
    {
        public long Id { get; set; }
        public long? UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public long? FactoryId { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string EntityType { get; set; } = string.Empty;
        public long? EntityId { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
        public DateTime Timestamp { get; set; }
        public string IpAddress { get; set; } = string.Empty;
    }

    // ==================== SETTINGS DTOs ====================
    public class UserSettingsDto
    {
        public bool EmailNotifications { get; set; } = true;
        public bool AppNotifications { get; set; } = true;
        public bool PublicProfile { get; set; } = true;
        public string? Language { get; set; } = "ar";
        public string? Timezone { get; set; } = "Arab Standard Time";
    }

    public class UpdateSettingsRequest
    {
        public bool? EmailNotifications { get; set; }
        public bool? AppNotifications { get; set; }
        public bool? PublicProfile { get; set; }
        public string? Language { get; set; }
        public string? Timezone { get; set; }
    }

    // ==================== TRANSACTION DTOs ====================
    public class TransactionResponseDto
    {
        public long Id { get; set; }
        public long WasteListingId { get; set; }
        public long BuyerFactoryId { get; set; }
        public long SellerFactoryId { get; set; }
        public string BuyerFactoryName { get; set; } = string.Empty;
        public string SellerFactoryName { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public decimal Price { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? Notes { get; set; }
    }

    public class TransactionCreateRequest
    {
        [Required]
        public long WasteListingId { get; set; }

        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Amount { get; set; }

        public string? Notes { get; set; }
    }

    // ==================== PARTNER DTOs ====================
    public class PartnerResponseDto
    {
        public long Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string NameEn { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public string? LogoUrl { get; set; }
        public string? Website { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public bool IsVerified { get; set; }
        public double Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    // ==================== FILE UPLOAD DTO ====================
    public class FileUploadResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string ContentType { get; set; } = string.Empty;
    }

    // ==================== VERIFICATION DTOs ====================
    public class VerifyFactoryRequest
    {
        [Required]
        public string Token { get; set; } = string.Empty;
    }

    public class ResendVerificationRequest
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}
