namespace shadowfactory.Models.Entities
{
    public class RecyclerSuggestion
    {
        public int Id { get; set; }
        public long WasteListingId { get; set; }
        public int RecyclerId { get; set; }
        public decimal MatchScore { get; set; } // 0-100
        public string ReasonCode { get; set; } // "capacity_match", "location_nearby", "specialty_match", etc.
        public decimal? EstimatedConversionOutputAmount { get; set; }
        public string EstimatedConversionOutputUnit { get; set; }
        public bool IsInterested { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public WasteListing WasteListing { get; set; }
        public Recycler Recycler { get; set; }
    }
}
