using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    /// <summary>
    /// Immutable record of each status change in a waste asset's lifecycle
    /// Acts as an audit trail and provides transparency for circular economy verification
    /// </summary>
    [Table("WasteJourneyEntries")]
    public class WasteJourneyEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        // ════════════════════════════════════════
        // REFERENCE TO WASTE ASSET
        // ════════════════════════════════════════
        [Required]
        public long WasteAssetId { get; set; }

        // ════════════════════════════════════════
        // JOURNEY CHECKPOINT
        // ════════════════════════════════════════
        [Required]
        public int Status { get; set; } // WasteAssetStatus enum value

        [Required]
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // ════════════════════════════════════════
        // WHO RESPONSIBLE AT THIS POINT
        // ════════════════════════════════════════
        public long? ResponsibleFactoryId { get; set; } // Which factory recorded this

        [StringLength(255)]
        public string? ResponsiblePersonName { get; set; }

        // ════════════════════════════════════════
        // PROOF OF CHECKPOINT
        // ════════════════════════════════════════
        [StringLength(500)]
        public string? ProofUrl { get; set; } // Photo, document, QR code scan result

        [StringLength(50)]
        public string? ProofType { get; set; } // photo, certificate, qrcode, signature

        // ════════════════════════════════════════
        // LOCATION TRACKING (GPS)
        // ════════════════════════════════════════
        [StringLength(100)]
        public string? LocationCoordinates { get; set; } // "30.0333,31.2333" (Lat,Long)

        [StringLength(255)]
        public string? LocationName { get; set; } // Human-readable location

        // ════════════════════════════════════════
        // NOTES & DETAILS
        // ════════════════════════════════════════
        [StringLength(1000)]
        public string? Notes { get; set; }

        [StringLength(50)]
        public string? TransportMethod { get; set; } // truck, ship, rail, etc.

        // ════════════════════════════════════════
        // QUALITY CHECK (if applicable)
        // ════════════════════════════════════════
        public bool QualityCheckPassed { get; set; } = true;

        [StringLength(500)]
        public string? QualityIssues { get; set; }

        // ════════════════════════════════════════
        // IMMUTABILITY & AUDIT
        // ════════════════════════════════════════
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Once created, this entry is immutable
        // UpdatedAt is NOT included - journey entries are write-once

        // ════════════════════════════════════════
        // NAVIGATION
        // ════════════════════════════════════════
        [ForeignKey("WasteAssetId")]
        public virtual WasteAsset? WasteAsset { get; set; }

        [ForeignKey("ResponsibleFactoryId")]
        public virtual Factory? ResponsibleFactory { get; set; }

        // ════════════════════════════════════════
        // DATABASE INDEXES
        // ════════════════════════════════════════
        // IX_WasteJourneyEntries_WasteAssetId - for quick lookup
        // IX_WasteJourneyEntries_Timestamp - for date range queries
        // IX_WasteJourneyEntries_ResponsibleFactoryId - for factory history
    }
}
