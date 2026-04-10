using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    public enum WasteTypeEnum
    {
        Plastic,
        Metal,
        Paper,
        Glass,
        PackagingPlastic,
        PackagingPaper,
        PackagingFoam,
        Mixed
    }

    [Table("WasteAssets", Schema = "dbo")]
    public class WasteAsset : IHasTimestamps
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public long GeneratorFactoryId { get; set; }

        public WasteTypeEnum Type { get; set; }

        public decimal Amount { get; set; }

        [StringLength(20)]
        public string Unit { get; set; } = "kg";

        public decimal Price { get; set; }

        [StringLength(50)]
        public string CurrentStatus { get; set; } = "Available";

        public DateTime CreatedAt { get; set; }

        public DateTime LastUpdatedAt { get; set; }
    }
}