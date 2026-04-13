using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using shadowfactory.Models.Enums;

namespace shadowfactory.Models.Entities
{
    /// <summary>
    /// WasteAsset represents a unique waste batch throughout its entire lifecycle
    /// This is the central entity for circular economy tracking
    /// Uses the new structured waste classification system
    /// </summary>
    [Table("WasteAssets")]
    public class WasteAsset
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        // ════════════════════════════════════════════════════════════
        // ORIGIN — Who generated this waste
        // ════════════════════════════════════════════════════════════
        [Required]
        public long GeneratorFactoryId { get; set; }

        [Required]
        public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;

        // ════════════════════════════════════════════════════════════
        // NEW STRUCTURED WASTE CLASSIFICATION
        // ════════════════════════════════════════════════════════════

        /// <summary>
        /// Primary waste type: Plastic, Metal, Paper, etc. (Foreign Key)
        /// </summary>
        [Required]
        public int WasteTypeId { get; set; }

        /// <summary>
        /// Detailed subtype for granular classification (Enum value)
        /// </summary>
        [Required]
        [Column("PackagingWasteSubtype")]
        public WasteSubType WasteSubType { get; set; }

        /// <summary>
        /// Contamination level affects recyclability and value (Enum value)
        /// </summary>
        [Column("ContaminationLevel")]
        public ContaminationLevel ContaminationLevel { get; set; } = ContaminationLevel.Medium;

        /// <summary>
        /// How this waste material can be used (Enum value)
        /// </summary>
        [Column("RecyclabilityOption")]
        public RecyclabilityType RecyclabilityType { get; set; } = RecyclabilityType.Recyclable;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = "kg"; // kg, tons, m³, pieces

        // ════════════════════════════════════════════════════════════
        // QUALITY & VERIFICATION
        // ════════════════════════════════════════════════════════════
        public bool VerifiedComposition { get; set; } = false;

        [Column(TypeName = "decimal(10,2)")]
        public decimal EstimatedCO2EquivalentIfLandfilled { get; set; } = 0; // kg CO2

        [StringLength(500)]
        public string? QualityNotes { get; set; }

        // ════════════════════════════════════════════════════════════
        // PACKAGING SPECIALIZATION (if WasteType == Packaging)
        // ════════════════════════════════════════════════════════════

        /// <summary>
        /// Is this packaging safe for food contact?
        /// Nullable but should be checked if WasteType == Packaging
        /// </summary>
        [Column("FoodContactSafe")]
        public bool? FoodContactSafe { get; set; }

        /// <summary>
        /// Can this packaging be washed and reused?
        /// </summary>
        [NotMapped]
        public bool CanBeWashed { get; set; } = false;

        /// <summary>
        /// Is this packaging reusable?
        /// Should match RecyclabilityType == Reusable
        /// </summary>
        [NotMapped]
        public bool IsReusable { get; set; } = false;

        /// <summary>
        /// Maximum number of times this can be reused
        /// </summary>
        [NotMapped]
        public int MaxReuseCount { get; set; } = 1;

        /// <summary>
        /// Current reuse cycle number
        /// </summary>
        [NotMapped]
        public int CurrentReuseNumber { get; set; } = 1;

        // ════════════════════════════════════════════════════════════
        // LEGACY FIELD (for backward compatibility migration)
        // ════════════════════════════════════════════════════════════
        [NotMapped]
        [Obsolete("Use WasteTypeId enum instead")]
        public int? PackagingWasteSubtypeId_Legacy { get; set; } // NULL if not packaging

        // ════════════════════════════════════════════════════════════
        // CURRENT STATE
        // ════════════════════════════════════════════════════════════
        [Required]
        public int Status { get; set; } = (int)WasteAssetStatus.Generated;

        public long? CurrentLocationFactoryId { get; set; } // Who has it now?

        public DateTime? AcquiredDate { get; set; } // When current location acquired it

        // ════════════════════════════════════════════════════════════
        // MARKETPLACE LISTING
        // ════════════════════════════════════════════════════════════
        public bool IsPublic { get; set; } = false;

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ListingPrice { get; set; }

        [StringLength(500)]
        public string? PublicDescription { get; set; }

        public DateTime? ListingExpiredAt { get; set; }

        public int Views { get; set; } = 0;

        // ════════════════════════════════════════════════════════════
        // TIMESTAMPS & AUDIT
        // ════════════════════════════════════════════════════════════
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // ════════════════════════════════════════════════════════════
        // NAVIGATION PROPERTIES
        // ════════════════════════════════════════════════════════════
        [ForeignKey("WasteTypeId")]
        public virtual WasteType? WasteType { get; set; }

        [ForeignKey("GeneratorFactoryId")]
        public virtual Factory? GeneratorFactory { get; set; }

        [ForeignKey("CurrentLocationFactoryId")]
        public virtual Factory? CurrentLocation { get; set; }

        [ForeignKey("PackagingWasteSubtypeId_Legacy")]
        [Obsolete("Use WasteSubType enum instead")]
        public virtual PackagingWasteSubtype? PackagingSpecialization { get; set; }

        // Immutable journey log
        public virtual ICollection<WasteJourneyEntry> Journey { get; set; } = new List<WasteJourneyEntry>();

        // Recycler suggestions
        public virtual ICollection<RecyclerSuggestion> RecyclerSuggestions { get; set; } = new List<RecyclerSuggestion>();

        // Orders/Offers to purchase
        public virtual ICollection<WasteAssetOffer> Offers { get; set; } = new List<WasteAssetOffer>();

        // Impact record (calculated automatically)
        public virtual EnvironmentalImpactRecord? ImpactRecord { get; set; }

        // Recycling orders (if sent to recycler)
        public virtual ICollection<WasteRecyclingOrder> RecyclingOrders { get; set; } = new List<WasteRecyclingOrder>();
    }

    /// <summary>
    /// Status of a waste asset throughout its circular lifecycle
    /// </summary>
    public enum WasteAssetStatus
    {
        Generated = 0,          // Just created by factory
        Available = 1,          // Ready to sell/give
        Reserved = 2,           // Someone (buyer/recycler) is interested
        Sold_OrderCreated = 3,  // Order confirmed, awaiting transaction
        InTransit = 4,          // Being transported
        ReceivedByBuyer = 5,    // Arrived at buyer/processor
        Processing = 6,         // At recycler, undergoing transformation
        Recycled = 7,           // Transformation complete (becomes new material)
        Reused = 8,             // Used as-is (not recycled)
        Disposed = 9            // End of cycle (last resort)
    }
}
