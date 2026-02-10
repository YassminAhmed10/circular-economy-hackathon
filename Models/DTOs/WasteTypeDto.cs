namespace ECoV.API.Models.DTOs
{
    public class WasteTypeDto
    {
        public string WasteCode { get; set; } = string.Empty;
        public string WasteNameAr { get; set; } = string.Empty;
        public string WasteNameEn { get; set; } = string.Empty;
    }

    public class FactoryWasteTypeDto
    {
        public string WasteCode { get; set; } = string.Empty;
        public decimal WasteAmount { get; set; }
        public string WasteUnit { get; set; } = string.Empty;
        public string Frequency { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }

    public class FactoryWasteTypeDetailDto : FactoryWasteTypeDto
    {
        public long Id { get; set; }
        public string? WasteNameAr { get; set; }
        public string? WasteNameEn { get; set; }
    }

    public class FactoryWasteTypeCreateDto : FactoryWasteTypeDto
    {
        public string? WasteNameAr { get; set; }
        public string? WasteNameEn { get; set; }
    }
}
