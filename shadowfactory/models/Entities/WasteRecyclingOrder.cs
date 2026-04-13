using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    /// <summary>
    /// Represents a request to a Recycler to process waste
    /// This connects WasteAssets to Recyclers and tracks the transformation
    /// </summary>
    [Table("WasteRecyclingOrders")]
    public class WasteRecyclingOrder
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        // ════════════════════════════════════════
        // REFERENCES
        // ════════════════════════════════════════
        [Required]
        public long WasteAssetId { get; set; }

        [Required]
        public int RecyclerId { get; set; }

        [Required]
        public long OrderedByFactoryId { get; set; } // Who placed this order (usually buyer of waste)

        /// <summary>
        /// Reference to the main Order if this recycling came from a marketplace purchase
        /// Optional because recycler can be requested independently
        /// </summary>
        public long? OrderId { get; set; }

        public int? RecyclerCapabilityId { get; set; } // Which capability this uses

        // ════════════════════════════════════════
        // ORDER DETAILS
        // ════════════════════════════════════════
        [StringLength(50)]
        public string? OrderNumber { get; set; } // Reference ID like "REC-20260410-001"

        [Column(TypeName = "decimal(18,2)")]
        public decimal QuantityToProcess { get; set; }

        [StringLength(20)]
        public string Unit { get; set; } = "kg";

        [Column(TypeName = "decimal(18,2)")]
        public decimal ProcessingCost { get; set; }

        [StringLength(500)]
        public string? SpecialInstructions { get; set; }

        // ════════════════════════════════════════
        // TIMELINE & STATUS
        // ════════════════════════════════════════
        [Required]
        public int Status { get; set; } = (int)WasteRecyclingOrderStatus.Pending;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? AcceptedAt { get; set; }

        public DateTime? ProcessingStartedAt { get; set; }

        public DateTime? ProcessingCompletedAt { get; set; }

        public DateTime? DeliveryDate { get; set; }

        int? EstimatedLeadTimeDays { get; set; }

        // ════════════════════════════════════════
        // PROCESSING DETAILS
        // ════════════════════════════════════════
        [StringLength(100)]
        public string? ProcessingMethodUsed { get; set; } // Mechanical, Chemical, Thermal

        [StringLength(500)]
        public string? ProcessDescriptionActual { get; set; } // What actually happened

        [Column(TypeName = "decimal(5,2)")]
        public decimal ActualEfficiencyPercent { get; set; } // % of input that became usable material

        // ════════════════════════════════════════
        // OUTPUT MATERIAL
        // ════════════════════════════════════════
        [StringLength(100)]
        public string? OutputMaterialType { get; set; } // Recycled pellets, molded fiber, etc.

        [Column(TypeName = "decimal(18,2)")]
        public decimal OutputQuantity { get; set; } = 0;

        [StringLength(20)]
        public string? OutputUnit { get; set; }

        [StringLength(500)]
        public string? OutputDescription { get; set; }

        // ════════════════════════════════════════
        // PROOF OF PROCESSING
        // ════════════════════════════════════════
        [StringLength(500)]
        public string? BeforePhoto { get; set; } // URL

        [StringLength(500)]
        public string? AfterPhoto { get; set; } // URL

        [StringLength(500)]
        public string? ProcessProofDocument { get; set; } // Certificate, report, etc.

        // ════════════════════════════════════════
        // ENVIRONMENTAL IMPACT TRACKED HERE
        // ════════════════════════════════════════
        [Column(TypeName = "decimal(10,2)")]
        public decimal CO2AvoidedKg { get; set; } = 0; // Calculated from efficiency

        public bool ImpactVerified { get; set; } = false;

        public long? ImpactRecordId { get; set; } // FK to EnvironmentalImpactRecord

        // ════════════════════════════════════════
        // QUALITY & CERTIFICATION
        // ════════════════════════════════════════
        public bool HasQualityCertification { get; set; } = false;

        [StringLength(100)]
        public string? CertificationType { get; set; } // ISO 14001, etc.

        [StringLength(100)]
        public string? CertificationNumber { get; set; }

        // ════════════════════════════════════════
        // NOTES
        // ════════════════════════════════════════
        [StringLength(1000)]
        public string? Notes { get; set; }

        [StringLength(1000)]
        public string? RejectionReason { get; set; }

        // ════════════════════════════════════════
        // TIMESTAMPS
        // ════════════════════════════════════════
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // ════════════════════════════════════════
        // NAVIGATION
        // ════════════════════════════════════════
        [ForeignKey("WasteAssetId")]
        public virtual WasteAsset? WasteAsset { get; set; }

        [ForeignKey("RecyclerId")]
        public virtual Recycler? Recycler { get; set; }

        [ForeignKey("OrderedByFactoryId")]
        public virtual Factory? OrderedByFactory { get; set; }

        [ForeignKey("RecyclerCapabilityId")]
        public virtual RecyclerCapability? Capability { get; set; }

        [ForeignKey("ImpactRecordId")]
        public virtual EnvironmentalImpactRecord? ImpactRecord { get; set; }

        /// <summary>
        /// Reference to the main Order if this recycling request came from marketplace purchase
        /// </summary>
        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }

        // Journey entries for this specific recycling process
        public virtual ICollection<WasteJourneyEntry> JourneyEntries { get; set; } = new List<WasteJourneyEntry>();
    }

    public enum WasteRecyclingOrderStatus
    {
        Pending = 0,       // Waiting for recycler to accept
        Accepted = 1,      // Recycler agreed
        Processing = 2,    // Work in progress
        Completed = 3,     // Transformation done
        Rejected = 4,      // Recycler declined
        Failed = 5         // Something went wrong
    }
}
