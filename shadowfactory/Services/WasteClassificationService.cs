using shadowfactory.Models.Enums;
using System.Collections.Generic;

namespace shadowfactory.Services
{
    /// <summary>
    /// Provides mapping between legacy category strings and new structured classification system
    /// Ensures backward compatibility for existing data
    /// </summary>
    public class WasteClassificationService
    {
        // Mapping from old flat categories to new structured types
        private static readonly Dictionary<string, (WasteType type, WasteSubType subtype)> LegacyCategoryMap = new()
        {
            // Plastic
            { "Plastic", (WasteType.Plastic, WasteSubType.MixedPlastic) },
            { "plastic", (WasteType.Plastic, WasteSubType.MixedPlastic) },
            { "PET", (WasteType.Plastic, WasteSubType.PET) },
            { "HDPE", (WasteType.Plastic, WasteSubType.HDPE) },
            { "PVC", (WasteType.Plastic, WasteSubType.PVC) },

            // Metal
            { "Metal", (WasteType.Metal, WasteSubType.MixedMetal) },
            { "metal", (WasteType.Metal, WasteSubType.MixedMetal) },
            { "Aluminum", (WasteType.Metal, WasteSubType.Aluminum) },
            { "Steel", (WasteType.Metal, WasteSubType.Steel) },
            { "Copper", (WasteType.Metal, WasteSubType.Copper) },

            // Paper
            { "Paper", (WasteType.Paper, WasteSubType.MixedPaper) },
            { "paper", (WasteType.Paper, WasteSubType.MixedPaper) },
            { "Cardboard", (WasteType.Paper, WasteSubType.Cardboard) },
            { "cardboard", (WasteType.Paper, WasteSubType.Cardboard) },

            // Glass
            { "Glass", (WasteType.Glass, WasteSubType.MixedGlass) },
            { "glass", (WasteType.Glass, WasteSubType.MixedGlass) },

            // Packaging
            { "Packaging", (WasteType.Packaging, WasteSubType.MixedPackaging) },
            { "packaging", (WasteType.Packaging, WasteSubType.MixedPackaging) },
            { "PlasticPackaging", (WasteType.Packaging, WasteSubType.PlasticPackaging) },
            { "PaperPackaging", (WasteType.Packaging, WasteSubType.PaperPackaging) },

            // Electronics
            { "Electronics", (WasteType.Electronic, WasteSubType.EWaste_Mixed) },
            { "electronics", (WasteType.Electronic, WasteSubType.EWaste_Mixed) },
            { "Electronic", (WasteType.Electronic, WasteSubType.EWaste_Mixed) },

            // Textile
            { "Textile", (WasteType.Textile, WasteSubType.Mixed) },
            { "textile", (WasteType.Textile, WasteSubType.Mixed) },

            // Wood
            { "Wood", (WasteType.Wood, WasteSubType.WoodWaste) },
            { "wood", (WasteType.Wood, WasteSubType.WoodWaste) },
        };

        /// <summary>
        /// Convert legacy category string to new structured classification
        /// </summary>
        public static (WasteType type, WasteSubType subtype) MapLegacyCategory(string legacyCategory)
        {
            if (string.IsNullOrWhiteSpace(legacyCategory))
            {
                // Default to MixedPlastic if unknown
                return (WasteType.Plastic, WasteSubType.MixedPlastic);
            }

            if (LegacyCategoryMap.TryGetValue(legacyCategory, out var mapping))
            {
                return mapping;
            }

            // Try case-insensitive match
            var caseInsensitiveKey = LegacyCategoryMap.Keys.FirstOrDefault(k => 
                k.Equals(legacyCategory, System.StringComparison.OrdinalIgnoreCase));

            if (caseInsensitiveKey != null)
            {
                return LegacyCategoryMap[caseInsensitiveKey];
            }

            // Default fallback
            return (WasteType.Plastic, WasteSubType.MixedPlastic);
        }

        /// <summary>
        /// Convert contamination level string to enum
        /// </summary>
        public static ContaminationLevel? MapContaminationLevel(string? legacyLevel)
        {
            if (string.IsNullOrWhiteSpace(legacyLevel))
                return ContaminationLevel.Medium;

            return legacyLevel.ToLower() switch
            {
                "low" => ContaminationLevel.Low,
                "medium" => ContaminationLevel.Medium,
                "high" => ContaminationLevel.High,
                _ => ContaminationLevel.Medium
            };
        }

        /// <summary>
        /// Convert recyclability option string to enum
        /// </summary>
        public static RecyclabilityType? MapRecyclabilityType(string? legacyOption)
        {
            if (string.IsNullOrWhiteSpace(legacyOption))
                return RecyclabilityType.Recyclable;

            return legacyOption.ToLower() switch
            {
                "directuse" or "direct use" or "direct_use" => RecyclabilityType.DirectUse,
                "recyclable" => RecyclabilityType.Recyclable,
                "reusable" or "reuse" => RecyclabilityType.Reusable,
                _ => RecyclabilityType.Recyclable
            };
        }

        /// <summary>
        /// Get all WasteSubTypes for a given WasteType
        /// Useful for frontend filtering and selection
        /// </summary>
        public static List<WasteSubType> GetSubTypesForType(WasteType wasteType)
        {
            return wasteType switch
            {
                WasteType.Plastic => new() { WasteSubType.PET, WasteSubType.HDPE, WasteSubType.PVC, WasteSubType.LDPE, WasteSubType.PP, WasteSubType.PS, WasteSubType.MixedPlastic },
                WasteType.Metal => new() { WasteSubType.Aluminum, WasteSubType.Steel, WasteSubType.Copper, WasteSubType.Iron, WasteSubType.Brass, WasteSubType.MixedMetal },
                WasteType.Paper => new() { WasteSubType.Cardboard, WasteSubType.OfficePaper, WasteSubType.Newspaper, WasteSubType.MixedPaper, WasteSubType.Tissue },
                WasteType.Glass => new() { WasteSubType.ClearGlass, WasteSubType.GreenGlass, WasteSubType.BrownGlass, WasteSubType.MixedGlass },
                WasteType.Packaging => new() { WasteSubType.PlasticPackaging, WasteSubType.PaperPackaging, WasteSubType.FoamPackaging, WasteSubType.GlassPackaging, WasteSubType.MetalPackaging, WasteSubType.MixedPackaging },
                WasteType.Electronic => new() { WasteSubType.EWaste_Computers, WasteSubType.EWaste_Phones, WasteSubType.EWaste_Appliances, WasteSubType.EWaste_Batteries, WasteSubType.EWaste_Mixed },
                WasteType.Textile => new() { WasteSubType.Cotton, WasteSubType.Polyester, WasteSubType.Wool, WasteSubType.Mixed },
                WasteType.Chemical => new() { WasteSubType.NonHazardousChem, WasteSubType.HazardousChem, WasteSubType.SolventsAndOils },
                WasteType.Organic => new() { WasteSubType.FoodWaste, WasteSubType.GardenWaste, WasteSubType.WoodWaste, WasteSubType.MixedOrganic },
                WasteType.Wood => new() { WasteSubType.WoodWaste },
                _ => new()
            };
        }

        /// <summary>
        /// Get display name for enum values (multilingual support)
        /// </summary>
        public static string GetDisplayName(WasteType type, bool isArabic = false)
        {
            return (type, isArabic) switch
            {
                (WasteType.Plastic, true) => "بلاستيك",
                (WasteType.Plastic, false) => "Plastic",
                (WasteType.Metal, true) => "معادن",
                (WasteType.Metal, false) => "Metal",
                (WasteType.Paper, true) => "ورق",
                (WasteType.Paper, false) => "Paper",
                (WasteType.Glass, true) => "زجاج",
                (WasteType.Glass, false) => "Glass",
                (WasteType.Packaging, true) => "تغليف",
                (WasteType.Packaging, false) => "Packaging",
                (WasteType.Electronic, true) => "إلكترونيات",
                (WasteType.Electronic, false) => "Electronics",
                (WasteType.Textile, true) => "نسيج",
                (WasteType.Textile, false) => "Textile",
                (WasteType.Chemical, true) => "مواد كيميائية",
                (WasteType.Chemical, false) => "Chemicals",
                (WasteType.Organic, true) => "عضوي",
                (WasteType.Organic, false) => "Organic",
                (WasteType.Wood, true) => "خشب",
                (WasteType.Wood, false) => "Wood",
                _ => "Unknown"
            };
        }

        /// <summary>
        /// Get display name for SubType  
        /// </summary>
        public static string GetDisplayName(WasteSubType subtype, bool isArabic = false)
        {
            return (subtype, isArabic) switch
            {
                // Plastic
                (WasteSubType.PET, true) => "PET",
                (WasteSubType.PET, false) => "PET",
                (WasteSubType.HDPE, true) => "HDPE",
                (WasteSubType.HDPE, false) => "HDPE",
                (WasteSubType.MixedPlastic, true) => "بلاستيك مختلط",
                (WasteSubType.MixedPlastic, false) => "Mixed Plastic",

                // Metal
                (WasteSubType.Aluminum, true) => "ألومنيوم",
                (WasteSubType.Aluminum, false) => "Aluminum",
                (WasteSubType.Steel, true) => "فولاذ",
                (WasteSubType.Steel, false) => "Steel",
                (WasteSubType.MixedMetal, true) => "معادن مختلطة",
                (WasteSubType.MixedMetal, false) => "Mixed Metal",

                // Paper
                (WasteSubType.Cardboard, true) => "كرتون",
                (WasteSubType.Cardboard, false) => "Cardboard",
                (WasteSubType.MixedPaper, true) => "ورق مختلط",
                (WasteSubType.MixedPaper, false) => "Mixed Paper",

                // Packaging
                (WasteSubType.PlasticPackaging, true) => "تغليف بلاستيكي",
                (WasteSubType.PlasticPackaging, false) => "Plastic Packaging",
                (WasteSubType.PaperPackaging, true) => "تغليف ورقي",
                (WasteSubType.PaperPackaging, false) => "Paper Packaging",

                _ => subtype.ToString()
            };
        }
    }
}
