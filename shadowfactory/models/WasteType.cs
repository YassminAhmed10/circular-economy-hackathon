namespace ECoV.API.Models
{
    public class WasteType
    {
        public string WasteCode { get; set; } = string.Empty;
        public string WasteNameAr { get; set; } = string.Empty;
        public string WasteNameEn { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
