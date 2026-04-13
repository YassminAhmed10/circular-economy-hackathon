using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    /// <summary>
    /// Tracks the environmental impact of a waste asset's lifecycle
    /// Calculates 25+ ESG metrics when waste enters the system and updated when recycled
    /// </summary>
    [Table("EnvironmentalImpactRecords")]
    public class EnvironmentalImpactRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        // ════════════════════════════════════════
        // REFERENCE TO WASTE ASSET
        // ════════════════════════════════════════
        public long? WasteAssetId { get; set; } // Nullable for batch calculations

        // ════════════════════════════════════════
        // BASELINE EMISSIONS (if sent to landfill)
        // ════════════════════════════════════════
        [Column(TypeName = "decimal(10,2)")]
        public decimal BaselineCO2EquivalentKg { get; set; } // Landfill scenario CO2

        // ════════════════════════════════════════
        // ACTUAL RECYCLING IMPACT
        // ════════════════════════════════════════
        [Column(TypeName = "decimal(10,2)")]
        public decimal RecyclingCO2AvoidedKg { get; set; } // CO2 saved by recycling

        [Column(TypeName = "decimal(10,2)")]
        public decimal NetCO2AvoidedKg { get; set; } // Net after accounting for transport/processing

        // ════════════════════════════════════════
        // WATER & ENERGY SAVINGS
        // ════════════════════════════════════════
        [Column(TypeName = "decimal(12,2)")]
        public decimal WaterSavedLiters { get; set; } // Water saved vs. new production

        [Column(TypeName = "decimal(10,2)")]
        public decimal EnergySavedKwh { get; set; } // Electricity saved

        // ════════════════════════════════════════
        // LANDFILL & MATERIAL RECOVERY
        // ════════════════════════════════════════
        [Column(TypeName = "decimal(10,2)")]
        public decimal LandfillDiversionKg { get; set; } // Weight kept from landfill

        [Column(TypeName = "decimal(10,2)")]
        public decimal MaterialRecoveredKg { get; set; } // Output material from recycling

        // ════════════════════════════════════════
        // REUSE IMPACT
        // ════════════════════════════════════════
        public int ItemsReuseCount { get; set; } // How many times reused

        // ════════════════════════════════════════
        // METADATA
        // ════════════════════════════════════════
        public DateTime CalculatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(20)]
        public string CalculationMethodVersion { get; set; } = "1.0";

        // ════════════════════════════════════════
        // LEGACY FIELDS (for backward compatibility)
        // ════════════════════════════════════════
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; } = 0;

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = "kg";

        [Required]
        public int WasteTypeId { get; set; } = 1;

        [Column(TypeName = "decimal(10,2)")]
        public decimal CO2EquivalentKgIfLandfilled { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal MethaneEmissionKgIfLandfilled { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal LandfillSpaceM3IfLandfilled { get; set; } = 0;

        public int FinalStatus { get; set; } = 0;

        public int? RecyclerId { get; set; }

        [StringLength(100)]
        public string? RecyclingProcessType { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal CO2KgAvoided { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal MethaneEmissionAvoided { get; set; } = 0;

        [Column(TypeName = "decimal(10,2)")]
        public decimal LandfillSpaceM3Saved { get; set; } = 0;

        public bool WasEnergyRecovered { get; set; } = false;

        [Column(TypeName = "decimal(10,2)")]
        public decimal EnergyRecoveredKWh { get; set; } = 0;

        [StringLength(100)]
        public string? OutputMaterialType { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal OutputQuantity { get; set; } = 0;

        [StringLength(20)]
        public string? OutputUnit { get; set; }

        public int JobsCreatedInRecycling { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal CostSavingsForFactory { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal RevenueForRecycler { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
