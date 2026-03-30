using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("FactoryWastes")]
    public class FactoryWaste
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
        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // العلاقات
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }

        [ForeignKey("WasteTypeId")]
        public virtual WasteType? WasteType { get; set; }
    }
}