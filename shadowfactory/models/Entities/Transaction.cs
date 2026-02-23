using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("Transactions")]
    public class Transaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public long WasteListingId { get; set; }

        [Required]
        public long BuyerFactoryId { get; set; }

        [Required]
        public long SellerFactoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string WasteType { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Pending";

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        // Navigation properties with explicit foreign keys
        [ForeignKey("WasteListingId")]
        public virtual WasteListing? WasteListing { get; set; }

        [ForeignKey("BuyerFactoryId")]
        public virtual Factory? BuyerFactory { get; set; }

        [ForeignKey("SellerFactoryId")]
        public virtual Factory? SellerFactory { get; set; }
    }
}