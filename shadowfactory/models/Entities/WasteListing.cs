using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using shadowfactory.Models.Enums;

namespace shadowfactory.Models.Entities
{
    [Table("WasteListings", Schema = "dbo")]
    public class WasteListing
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Column("Id")]
        public long Id { get; set; }

        // ════════════════════════════════════════════════════════════
        // NEW STRUCTURED WASTE CLASSIFICATION SYSTEM
        // ════════════════════════════════════════════════════════════

        /// <summary>
        /// Primary waste type (Plastic, Metal, Paper, etc.)
        /// </summary>
        // [Column("WasteTypeId")]
        // public int? WasteTypeId { get; set; } // FK to WasteType enum, nullable for backward compatibility

        /// <summary>
        /// Detailed subtype within the waste type
        /// </summary>
        // [Column("WasteSubTypeId")]
        // public int? WasteSubTypeId { get; set; } // FK to WasteSubType enum, nullable for backward compatibility

        /// <summary>
        /// Contamination level: Low, Medium, High
        /// </summary>
        // [Column("ContaminationLevelId")]
        // public int? ContaminationLevelId { get; set; } // Maps to ContaminationLevel enum

        /// <summary>
        /// How material can be used: DirectUse, Recyclable, Reusable
        /// </summary>
        // [Column("RecyclabilityTypeId")]
        // public int? RecyclabilityTypeId { get; set; } // Maps to RecyclabilityType enum

        // ════════════════════════════════════════════════════════════
        // LEGACY FIELDS (backward compatibility)
        // ════════════════════════════════════════════════════════════

        [Required]
        [StringLength(100)]
        [Column("Type")]
        public string Type { get; set; } = string.Empty; // Legacy: Keep for compatibility

        [Required]
        [StringLength(50)]
        [Column("TypeEn")]
        public string TypeEn { get; set; } = string.Empty; // Legacy: Keep for compatibility

        [Required]
        [Column("Amount")]
        public decimal Amount { get; set; }

        [Column("ReservedAmount")]
        public decimal ReservedAmount { get; set; } = 0; // ✅ Quantity reserved by pending orders

        [Required]
        [StringLength(20)]
        [Column("Unit")]
        public string Unit { get; set; } = string.Empty;

        [Required]
        [Column("Price")]
        public decimal Price { get; set; }

        // ════════════════════════════════════════════════════════════
        // PACKAGING-SPECIFIC ATTRIBUTES (DISABLED - Not in DB schema yet)
        // ════════════════════════════════════════════════════════════

        /// <summary>
        /// Is this item safe for food contact?
        /// Only applicable when WasteType == Packaging
        /// </summary>
        // [Column("FoodContactSafe")]
        // public bool? FoodContactSafe { get; set; }

        /// <summary>
        /// Can this packaging be washed and reused?
        /// Only applicable when WasteType == Packaging
        /// </summary>
        // [Column("CanBeWashed")]
        // public bool? CanBeWashed { get; set; }

        /// <summary>
        /// Maximum number of times this can be reused
        /// Only applicable when WasteType == Packaging && Recyclability == Reusable
        /// </summary>
        // [Column("MaxReuseCount")]
        // public int? MaxReuseCount { get; set; }

        /// <summary>
        /// Estimated CO2 savings if this is recycled instead of landfilled (kg CO2)
        /// </summary>
        // [Column("Co2SavingsEstimate")]
        // public decimal? Co2SavingsEstimate { get; set; }

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

        [StringLength(100)]
        [Column("SellerEmail")]
        public string? SellerEmail { get; set; } // 🌐 For Profile API enrichment

        // ════════════════════════════════════════════════════════════
        // DEPRECATED FIELDS (kept for migration compatibility)
        // Use the new WasteTypeId, WasteSubTypeId, ContaminationLevelId,
        // RecyclabilityTypeId, and packaging attributes above instead
        // ════════════════════════════════════════════════════════════

        // Legacy: use WasteTypeId instead
        [StringLength(50)]
        [Column("ContaminationLevel")]
        [Obsolete("Use ContaminationLevelId enum instead")]
        public string? ContaminationLevel_Legacy { get; set; }

        // Legacy: use FoodContactSafe instead
        [Column("FoodContactSuitability")]
        [Obsolete("Use FoodContactSafe property instead")]
        public bool FoodContactSuitability_Legacy { get; set; } = false;

        // Legacy: use RecyclabilityTypeId instead
        [StringLength(150)]
        [Column("RecyclabilityOption")]
        [Obsolete("Use RecyclabilityTypeId enum instead")]
        public string? RecyclabilityOption_Legacy { get; set; }

        // Legacy: use WasteSubTypeId instead
        [StringLength(100)]
        [Column("PackagingWasteSubtype")]
        [Obsolete("Use WasteSubTypeId enum instead")]
        public string? PackagingWasteSubtype_Legacy { get; set; }

        [Column("SourceRecyclerId")]
        public int? SourceRecyclerId { get; set; }

        // Navigation properties
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }

        // Relationships for packaging waste features
        public virtual ICollection<RecyclerSuggestion>? RecyclerSuggestions { get; set; } = new List<RecyclerSuggestion>();
    }
}