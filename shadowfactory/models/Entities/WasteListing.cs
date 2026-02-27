using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
        [StringLength(100)]
        [Column("Type")]
        public string Type { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("TypeEn")]
        public string TypeEn { get; set; } = string.Empty;

        [Required]
        [Column("Amount")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        [Column("Unit")]
        public string Unit { get; set; } = string.Empty;

        [Required]
        [Column("Price")]
        public decimal Price { get; set; }

        [Required]
        [Column("FactoryId")]
        public long FactoryId { get; set; }

        [Required]
        [StringLength(200)]
        [Column("FactoryName")]
        public string FactoryName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        [Column("Location")]
        public string Location { get; set; } = string.Empty;

        [StringLength(500)]
        [Column("Description")]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        [Column("Category")]
        public string Category { get; set; } = string.Empty;

        [StringLength(500)]
        [Column("ImageUrl")]
        public string? ImageUrl { get; set; }

        [Required]
        [StringLength(20)]
        [Column("Status")]
        public string Status { get; set; } = "Active";

        [Column("Views")]
        public int Views { get; set; } = 0;

        [Column("Offers")]
        public int Offers { get; set; } = 0;

        [Column("CreatedAt")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("UpdatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [Column("ExpiresAt")]
        public DateTime? ExpiresAt { get; set; }

        // New multilingual fields
        [StringLength(200)]
        [Column("TitleAr")]
        public string? TitleAr { get; set; }

        [StringLength(200)]
        [Column("TitleEn")]
        public string? TitleEn { get; set; }

        [StringLength(1000)]
        [Column("DescriptionAr")]
        public string? DescriptionAr { get; set; }

        [StringLength(1000)]
        [Column("DescriptionEn")]
        public string? DescriptionEn { get; set; }

        [StringLength(200)]
        [Column("CompanyNameAr")]
        public string? CompanyNameAr { get; set; }

        [StringLength(200)]
        [Column("CompanyNameEn")]
        public string? CompanyNameEn { get; set; }

        [StringLength(100)]
        [Column("LocationAr")]
        public string? LocationAr { get; set; }

        [StringLength(100)]
        [Column("LocationEn")]
        public string? LocationEn { get; set; }

        [StringLength(50)]
        [Column("WeightAr")]
        public string? WeightAr { get; set; }

        [StringLength(50)]
        [Column("WeightEn")]
        public string? WeightEn { get; set; }

        [Column("Rating")]
        public decimal? Rating { get; set; }

        [Column("Reviews")]
        public int? Reviews { get; set; }

        [StringLength(50)]
        [Column("Badge")]
        public string? Badge { get; set; }

        [Column("Specifications")]
        public string? Specifications { get; set; }

        [Column("SellerRating")]
        public decimal? SellerRating { get; set; }

        [Column("SellerTotalSales")]
        public int? SellerTotalSales { get; set; }

        [StringLength(20)]
        [Column("SellerJoined")]
        public string? SellerJoined { get; set; }

        [StringLength(20)]
        [Column("SellerWhatsapp")]
        public string? SellerWhatsapp { get; set; }

        [Column("Latitude")]
        public decimal? Latitude { get; set; }

        [Column("Longitude")]
        public decimal? Longitude { get; set; }

        [StringLength(500)]
        [Column("LocationLink")]
        public string? LocationLink { get; set; }

        // Navigation property
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }
    }
}