namespace shadowfactory.Models.DTOs
{
    public class PackagingWasteListingCreateRequest
    {
        public string PackagingWasteSubtype { get; set; } // "Plastic", "Paper", etc.
        public decimal Amount { get; set; }
        public string Unit { get; set; } // "kg", "tons"
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
        public string ContaminationLevel { get; set; } // "none", "low", "medium", "high"
        public bool FoodContactSuitability { get; set; }
        public List<string> RecyclabilityOptions { get; set; } // ["Recycled_Pellets", "Molded_Fiber"]
        public string Description { get; set; }
        public string DescriptionAr { get; set; }
        public string ImageUrl { get; set; }
        public DateTime ExpiresAt { get; set; }
        public string LocationNameEn { get; set; }
        public string LocationNameAr { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}
