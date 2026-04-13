using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    /// <summary>
    /// Represents an offer/bid to purchase a WasteAsset
    /// Replaces the old Order/Transaction model with clearer semantics
    /// </summary>
    [Table("WasteAssetOffers")]
    public class WasteAssetOffer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        // ════════════════════════════════════════
        // REFERENCE
        // ════════════════════════════════════════
        [Required]
        public long WasteAssetId { get; set; }

        [Required]
        public long BuyerFactoryId { get; set; }

        // ════════════════════════════════════════
        // OFFER DETAILS
        // ════════════════════════════════════════
        [StringLength(50)]
        public string? OfferNumber { get; set; } // Reference ID like "OFF-20260410-001"

        [Column(TypeName = "decimal(18,2)")]
        public decimal OfferedQuantity { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OfferedPricePerUnit { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalOfferedPrice { get; set; }

        [StringLength(500)]
        public string? Message { get; set; } // Buyer's message to seller

        // ════════════════════════════════════════
        // OFFER STATUS
        // ════════════════════════════════════════
        [Required]
        public int Status { get; set; } = (int)WasteAssetOfferStatus.Pending;

        public DateTime? AcceptedAt { get; set; }

        public DateTime? RejectedAt { get; set; }

        public DateTime? CancelledAt { get; set; }

        [StringLength(500)]
        public string? RejectionReason { get; set; }

        // ════════════════════════════════════════
        // IF ACCEPTED — BECOMES TRANSACTION
        // ════════════════════════════════════════
        public long? CompletedTransactionId { get; set; } // FK to Transaction/Order

        public DateTime? DeliveryDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        // ════════════════════════════════════════
        // BUYER INTENT
        // ════════════════════════════════════════
        public int? IntendedUseType { get; set; } // DirectReuse, Recycling, Processing

        [StringLength(500)]
        public string? IntendedUseDescription { get; set; }

        // ════════════════════════════════════════
        // TIMESTAMPS
        // ════════════════════════════════════════
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // ════════════════════════════════════════
        // NAVIGATION
        // ════════════════════════════════════════
        [ForeignKey("WasteAssetId")]
        public virtual WasteAsset? WasteAsset { get; set; }

        [ForeignKey("BuyerFactoryId")]
        public virtual Factory? BuyerFactory { get; set; }
    }

    public enum WasteAssetOfferStatus
    {
        Pending = 0,      // Waiting for seller response
        Accepted = 1,     // Seller approved
        Rejected = 2,     // Seller declined
        Cancelled = 3,    // Buyer withdrew
        Completed = 4     // Transaction fulfilled
    }
}
