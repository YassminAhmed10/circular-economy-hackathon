namespace shadowfactory.Models.Entities
{
    public class RecyclerCapability
    {
        public int Id { get; set; }
        public int RecyclerId { get; set; }
        public int InputWasteSubtypeId { get; set; }
        public string OutputMaterialType { get; set; } // e.g., "Recycled Pellets", "Molded Fiber"
        public string OutputMaterialTypeAr { get; set; }
        public decimal CapacityPerMonth { get; set; }
        public string CapacityUnit { get; set; } // kg, tons, etc.
        public decimal? CostPerUnit { get; set; }
        public int LeadTime { get; set; } // Days
        public string ProcessDescription { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public Recycler Recycler { get; set; }
        public PackagingWasteSubtype InputWasteSubtype { get; set; }
    }
}
