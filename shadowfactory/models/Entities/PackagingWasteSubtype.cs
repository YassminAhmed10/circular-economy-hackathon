namespace shadowfactory.Models.Entities
{
    public class PackagingWasteSubtype
    {
        public int Id { get; set; }
        public string Name { get; set; } // English
        public string NameAr { get; set; } // Arabic
        public string Description { get; set; }
        public string Icon { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Relationships
        public ICollection<RecyclerCapability> RecyclerCapabilities { get; set; } = new List<RecyclerCapability>();
    }
}
