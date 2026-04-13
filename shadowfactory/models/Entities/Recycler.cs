namespace shadowfactory.Models.Entities
{
    public class Recycler
    {
        public int Id { get; set; }
        public int? UserId { get; set; } // Optional FK to User for login
        public string CompanyName { get; set; }
        public string CompanyNameAr { get; set; }
        public string Description { get; set; }
        public string DescriptionAr { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string WhatsappNumber { get; set; }
        public string Location { get; set; }
        public string LocationAr { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string LogoUrl { get; set; }
        public string CertificationNumber { get; set; }
        public decimal Rating { get; set; } = 0m;
        public int TotalConversions { get; set; } = 0;
        public bool IsVerified { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public ICollection<RecyclerCapability> Capabilities { get; set; } = new List<RecyclerCapability>();
        public ICollection<RecyclerSuggestion> Suggestions { get; set; } = new List<RecyclerSuggestion>();
    }
}
