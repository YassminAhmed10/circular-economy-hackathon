using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using shadowfactory.Models; // Add this for Factory

namespace shadowfactory.Models.Entities
{
    [Table("WasteListings", Schema = "dbo")]
    public class WasteListing
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        public long Id { get; set; }

        [Required]
        [Column("Type")]
        public string Type { get; set; } = string.Empty;

        [Required]
        [Column("TypeEn")]
        public string TypeEn { get; set; } = string.Empty;

        [Required]
        [Column("Amount")]
        public decimal Amount { get; set; }

        [Required]
        [Column("Unit")]
        public string Unit { get; set; } = string.Empty;

        [Required]
        [Column("Price")]
        public decimal Price { get; set; }

        [Required]
        [Column("FactoryId")]
        public long FactoryId { get; set; }

        [Required]
        [Column("FactoryName")]
        public string FactoryName { get; set; } = string.Empty;

        [Required]
        [Column("Location")]
        public string Location { get; set; } = string.Empty;

        [Column("Description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [Column("Category")]
        public string Category { get; set; } = string.Empty;

        [Column("ImageUrl")]
        public string? ImageUrl { get; set; }

        [Required]
        [Column("Status")]
        public string Status { get; set; } = "Active";

        [Column("Views")]
        public int Views { get; set; }

        [Column("Offers")]
        public int Offers { get; set; }

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; }

        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; }

        [Column("ExpiresAt")]
        public DateTime? ExpiresAt { get; set; }

        // ⭐⭐⭐ ADD THIS NAVIGATION PROPERTY ⭐⭐⭐
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }
    }
}