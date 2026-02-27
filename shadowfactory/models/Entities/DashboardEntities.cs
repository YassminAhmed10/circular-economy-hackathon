using shadowfactory.Models;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Factory = shadowfactory.Models.Factory;

namespace shadowfactory.models.Entities
{
    public class WasteListing
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Type { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string TypeEn { get; set; } = string.Empty; // English version for sorting/search

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public long FactoryId { get; set; }

        [Required]
        [StringLength(200)]
        public string FactoryName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty; // plastic, oil, paper, metal, etc.

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active"; // Active, Pending, Sold, Expired

        public int Views { get; set; } = 0;
        public int Offers { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }

        // Navigation property
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }
    }

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
        public string Status { get; set; } = "Pending"; // Pending, Completed, Cancelled, UnderReview

        [StringLength(500)]
        public string? Notes { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? CompletedAt { get; set; }

        // Navigation properties
        [ForeignKey("WasteListingId")]
        public virtual WasteListing? WasteListing { get; set; }

        [ForeignKey("BuyerFactoryId")]
        public virtual Factory? BuyerFactory { get; set; }

        [ForeignKey("SellerFactoryId")]
        public virtual Factory? SellerFactory { get; set; }
    }

    public class Partner
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Specialty { get; set; } = string.Empty;

        [Range(0, 5)]
        public decimal Rating { get; set; } = 0;

        public int CompletedDeals { get; set; } = 0;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? LogoUrl { get; set; }

        [StringLength(100)]
        public string? ContactEmail { get; set; }

        [StringLength(20)]
        public string? ContactPhone { get; set; }

        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}