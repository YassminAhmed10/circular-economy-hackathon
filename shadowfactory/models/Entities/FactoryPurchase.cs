using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("FactoryPurchases")]
    public class FactoryPurchase
    {
        [Key]
        public long Id { get; set; }

        public long FactoryId { get; set; }

        public int WasteTypeId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Quantity { get; set; }

        [StringLength(10)]
        public string Unit { get; set; } = "ton";

        [StringLength(20)]
        public string Frequency { get; set; } = "monthly";

        [StringLength(500)]
        public string? Purpose { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }

        [ForeignKey("WasteTypeId")]
        public virtual WasteType? WasteType { get; set; }
    }
}