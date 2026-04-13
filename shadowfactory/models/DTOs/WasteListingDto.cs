using System.ComponentModel.DataAnnotations;
using shadowfactory.Models.Enums;

namespace shadowfactory.Models.DTOs
{
    /// <summary>
    /// DTO for WasteListing with structured classification (NEW - enhanced version)
    /// Used for modern API responses with detailed waste type hierarchy
    /// </summary>
    public class WasteListingStructuredDto
    {
        public long Id { get; set; }

        // ════════════════════════════════════════════════════════════
        // BASIC INFORMATION (English-primary)
        // ════════════════════════════════════════════════════════════
        public string? Title { get; set; }
        public string? TitleAr { get; set; }  // Backward compatibility only
        public string? TitleEn { get; set; }  // Backward compatibility only
        
        public string? Description { get; set; }
        public string? DescriptionAr { get; set; }  // Backward compatibility only
        public string? DescriptionEn { get; set; }  // Backward compatibility only

        public decimal Amount { get; set; }
        public string Unit { get; set; } = "kg";
        public decimal Price { get; set; }
        public string? ImageUrl { get; set; }

        // ════════════════════════════════════════════════════════════
        // STRUCTURED WASTE CLASSIFICATION (NEW - DISABLED: Not in DB schema yet)
        // ════════════════════════════════════════════════════════════

        /// <summary>
        /// Primary waste type ID (e.g., 1 = Plastic, 2 = Metal)
        /// </summary>
        // public int? WasteTypeId { get; set; }

        /// <summary>
        /// Primary waste type name (e.g., "Plastic", "Metal")
        /// </summary>
        // public string? WasteTypeName { get; set; }

        /// <summary>
        /// Detailed subtype ID (e.g., 102 = HDPE, 201 = Aluminum)
        /// </summary>
        // public int? WasteSubTypeId { get; set; }

        /// <summary>
        /// Detailed subtype name (e.g., "HDPE", "Aluminum")
        /// </summary>
        // public string? WasteSubTypeName { get; set; }

        /// <summary>
        /// Contamination level: 1=Low, 2=Medium, 3=High
        /// </summary>
        // public int? ContaminationLevelId { get; set; }

        /// <summary>
        /// Contamination level text
        /// </summary>
        // public string? ContaminationLevel { get; set; }

        /// <summary>
        /// Recyclability type: 1=DirectUse, 2=Recyclable, 3=Reusable
        /// </summary>
        // public int? RecyclabilityTypeId { get; set; }

        /// <summary>
        /// Recyclability type text
        /// </summary>
        // public string? RecyclabilityType { get; set; }

        // ════════════════════════════════════════════════════════════
        // PACKAGING-SPECIFIC ATTRIBUTES (DISABLED: Not in DB schema yet)
        // ════════════════════════════════════════════════════════════

        /// <summary>
        /// Is this packaging safe for direct food contact?
        /// </summary>
        // public bool? FoodContactSafe { get; set; }

        /// <summary>
        /// Can this packaging be washed and reused?
        /// </summary>
        // public bool? CanBeWashed { get; set; }

        /// <summary>
        /// Maximum reuse count (if reusable)
        /// </summary>
        // public int? MaxReuseCount { get; set; }

        /// <summary>
        /// Estimated CO2 savings in kg if recycled
        /// </summary>
        // public decimal? Co2SavingsEstimate { get; set; }

        // ════════════════════════════════════════════════════════════
        // SELLER INFORMATION (English-primary)
        // ════════════════════════════════════════════════════════════
        public long FactoryId { get; set; }
        public string? CompanyName { get; set; }
        public string? CompanyNameAr { get; set; }  // Backward compatibility only
        public string? CompanyNameEn { get; set; }  // Backward compatibility only
        
        public string? Location { get; set; }
        public string? LocationAr { get; set; }  // Backward compatibility only
        public string? LocationEn { get; set; }  // Backward compatibility only
        
        public decimal? Rating { get; set; }
        public int? Reviews { get; set; }
        public decimal? SellerRating { get; set; }

        // ════════════════════════════════════════════════════════════
        // STATUS & METADATA
        // ════════════════════════════════════════════════════════════
        public string Status { get; set; } = "Active";
        public string? Badge { get; set; }
        public int Views { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }

        // ════════════════════════════════════════════════════════════
        // LOCATION DATA
        // ════════════════════════════════════════════════════════════
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }

        // ════════════════════════════════════════════════════════════
        // COMPUTED BADGES (for UI display)
        // ════════════════════════════════════════════════════════════
        public List<string> BadgesList { get; set; } = new();

        // ════════════════════════════════════════════════════════════
        // LEGACY PROPERTIES (for backwards compatibility with existing code)
        // ════════════════════════════════════════════════════════════
        public string? Type_Legacy { get; set; }  // Old legacy property
        public string? TypeEn_Legacy { get; set; }  // Old legacy property
        public string? Category { get; set; }  // Legacy: use WasteTypeId classification
        public string? FactoryName { get; set; }  // Can be derived from Company
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public string? Weight_Legacy_Ar { get; set; }
        public string? Weight_Legacy_En { get; set; }
        public string? Specifications { get; set; }
        public int? SellerTotalSales { get; set; }
        public string? SellerJoined { get; set; }
        public string? SellerWhatsapp { get; set; }
        public string? LocationLink { get; set; }
    }

    /// <summary>
    /// DTO for creating/updating a waste listing with structured classification
    /// </summary>
    public class CreateWasteListingDto
    {
        public string? Title { get; set; }
        public string? TitleAr { get; set; }  // Backward compatibility only
        public string? TitleEn { get; set; }  // Backward compatibility only
        
        public string? Description { get; set; }
        public string? DescriptionAr { get; set; }  // Backward compatibility only
        public string? DescriptionEn { get; set; }  // Backward compatibility only

        public decimal Amount { get; set; }
        public string Unit { get; set; } = "kg";
        public decimal Price { get; set; }

        // Structured classification (REQUIRED)
        [Required]
        // public int WasteTypeId { get; set; }
        // DISABLED: Not in DB schema yet

        // [Required]
        // public int WasteSubTypeId { get; set; }
        // DISABLED: Not in DB schema yet

        // Optional attributes
        // public int? ContaminationLevelId { get; set; } = (int)ContaminationLevel.Medium;
        // DISABLED: Not in DB schema yet
        
        // public int? RecyclabilityTypeId { get; set; } = (int)RecyclabilityType.Recyclable;
        // DISABLED: Not in DB schema yet

        // Packaging attributes (if applicable)
        // public bool? FoodContactSafe { get; set; }
        // DISABLED: Not in DB schema yet
        
        // public bool? CanBeWashed { get; set; }
        // DISABLED: Not in DB schema yet
        
        // public int? MaxReuseCount { get; set; }
        // DISABLED: Not in DB schema yet
        
        // public decimal? Co2SavingsEstimate { get; set; }
        // DISABLED: Not in DB schema yet

        // Legacy support (to be migrated)
        public string? Category { get; set; }
        public string? Type { get; set; }
    }

    /// <summary>
    /// Response for waste type/subtype hierarchy
    /// </summary>
    public class WasteTypeHierarchyDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;  // English-primary
        public string? NameAr { get; set; }  // Backward compatibility only
        public string? NameEn { get; set; }  // Backward compatibility only
        public List<WasteSubTypeDto> SubTypes { get; set; } = new();
    }

    /// <summary>
    /// Response for waste subtype details (English-primary)
    /// </summary>
    public class WasteSubTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;  // English-primary
        public string? NameAr { get; set; }  // Backward compatibility only
        public string? NameEn { get; set; }  // Backward compatibility only
        public string? Description { get; set; }
    }

    /// <summary>
    /// Response for filtering options
    /// </summary>
    public class WasteFilterOptionsDto
    {
        public List<WasteTypeHierarchyDto> WasteTypes { get; set; } = new();
        public List<ContaminationLevelDto> ContaminationLevels { get; set; } = new();
        public List<RecyclabilityTypeDto> RecyclabilityTypes { get; set; } = new();
    }

    /// <summary>
    /// Contamination level option (English-primary)
    /// </summary>
    public class ContaminationLevelDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;  // English-primary
        public string? NameAr { get; set; }  // Backward compatibility only
        public string? NameEn { get; set; }  // Backward compatibility only
    }

    /// <summary>
    /// Recyclability type option (English-primary)
    /// </summary>
    public class RecyclabilityTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;  // English-primary
        public string? NameAr { get; set; }  // Backward compatibility only
        public string? NameEn { get; set; }  // Backward compatibility only
    }
}
