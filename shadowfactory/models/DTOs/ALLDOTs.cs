using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace shadowfactory.Models.DTOs
{
    // API Response DTOs
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

    // Factory Registration DTOs
    public class FactoryRegistrationRequest
    {
        public string FactoryName { get; set; } = string.Empty;
        public string FactoryNameEn { get; set; } = string.Empty;
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
        public string IndustryType { get; set; } = string.Empty;
        public int? EstablishmentYear { get; set; }
        public int? NumberOfEmployees { get; set; }
        public decimal FactorySize { get; set; }
        public decimal ProductionCapacity { get; set; }
        public string? LogoBase64 { get; set; }
        public List<WasteTypeDTO> WasteTypes { get; set; } = new List<WasteTypeDTO>();
    }

    public class FactoryRegistrationResponse
    {
        public long FactoryId { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public bool Success { get; set; }
        public DateTime RegisteredAt { get; set; }
        public string VerificationToken { get; set; } = string.Empty;
    }

    public class WasteTypeDTO
    {
        [Required]
        public string WasteCode { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        public string Unit { get; set; } = "kg";

        [Required]
        public string Frequency { get; set; } = "monthly";

        public string? Description { get; set; }
    }

    // Factory Details DTOs
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
        public bool Verified { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public List<WasteTypeDetailDTO> WasteTypes { get; set; } = new List<WasteTypeDetailDTO>();
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

    // File Upload DTO
    public class FileUploadResponse
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string FileUrl { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public string ContentType { get; set; } = string.Empty;
    }

    // Paginated Response DTO
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

    // Waste Type DTO (simple version)
    public class WasteTypeDto
    {
        public string WasteCode { get; set; } = string.Empty;
        public string WasteNameAr { get; set; } = string.Empty;
        public string WasteNameEn { get; set; } = string.Empty;
    }
}
