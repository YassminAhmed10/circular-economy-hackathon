using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("EnvironmentalImpactRecords", Schema = "dbo")]
    public class EnvironmentalImpactRecord
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public long? WasteAssetId { get; set; }

        public long? WasteRecyclingOrderId { get; set; }

        public long FactoryId { get; set; }

        public decimal CO2AvoidedKg { get; set; }

        public decimal EnergySavedKwh { get; set; }

        public decimal WaterSavedLiters { get; set; }

        public double TreesEquivalent { get; set; }

        public DateTime CalculationDate { get; set; }

        [StringLength(200)]
        public string CalculationMethod { get; set; } = string.Empty;

        public WasteTypeEnum WasteType { get; set; } = WasteTypeEnum.Mixed;
    }
}
