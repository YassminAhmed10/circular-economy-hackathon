using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

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
        [StringLength(50)]
        public string WasteCategory { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        [StringLength(100)]
        public string BuyerName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string SellerName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "معلق";

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public DateTime? DeliveryDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey("WasteListingId")]
        public virtual WasteListing? WasteListing { get; set; }

        [ForeignKey("BuyerFactoryId")]
        public virtual Factory? BuyerFactory { get; set; }

        [ForeignKey("SellerFactoryId")]
        public virtual Factory? SellerFactory { get; set; }
    }
}