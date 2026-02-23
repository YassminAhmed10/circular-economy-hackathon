namespace ECoV.API.Models.DTOs
{
    public class FactoryDto
    {
        public long Id { get; set; }
        public string FactoryName { get; set; } = string.Empty;
        public string FactoryNameEn { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public bool Verified { get; set; }
        public string Status { get; set; } = string.Empty;
    }

    public class FactoryDetailDto : FactoryDto
    {
        public string IndustryType { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? Fax { get; set; }
        public string? Website { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public string OwnerPhone { get; set; } = string.Empty;
        public string? OwnerEmail { get; set; }
        public string TaxNumber { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public int? EstablishmentYear { get; set; }
        public int? NumberOfEmployees { get; set; }
        public decimal? FactorySize { get; set; }
        public decimal ProductionCapacity { get; set; }
        public string? LogoUrl { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<FactoryWasteTypeDto> WasteTypes { get; set; } = new List<FactoryWasteTypeDto>();
    }

    public class FactoryCreateDto
    {
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
        public int? NumberOfEmployees { get; set; }
        public decimal? FactorySize { get; set; }
        public decimal ProductionCapacity { get; set; }
        public string? LogoUrl { get; set; }
        public List<FactoryWasteTypeCreateDto>? WasteTypes { get; set; }
    }

    public class FactoryUpdateDto
    {
        public string? FactoryName { get; set; }
        public string? FactoryNameEn { get; set; }
        public string? IndustryType { get; set; }
        public string? Location { get; set; }
        public string? Address { get; set; }
        public string? Phone { get; set; }
        public string? Fax { get; set; }
        public string? Website { get; set; }
        public string? OwnerName { get; set; }
        public string? OwnerPhone { get; set; }
        public string? OwnerEmail { get; set; }
        public int? EstablishmentYear { get; set; }
        public int? NumberOfEmployees { get; set; }
        public decimal? FactorySize { get; set; }
        public decimal? ProductionCapacity { get; set; }
        public string? LogoUrl { get; set; }
        public string? Status { get; set; }
    }
}
