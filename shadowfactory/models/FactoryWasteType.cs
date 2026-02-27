using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models
{
    [Table("FactoryWasteTypes")]
    public class FactoryWasteType
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        public long FactoryId { get; set; }

        [Required]
        [StringLength(50)]
        public string WasteCode { get; set; } = string.Empty;

        [Required]
        [Range(0.01, 1000000)]
        public decimal WasteAmount { get; set; }

        [Required]
        [StringLength(20)]
        public string WasteUnit { get; set; } = "kg";

        [Required]
        [StringLength(50)]
        public string Frequency { get; set; } = "monthly";

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(255)]
        public string? WasteNameAr { get; set; }

        [StringLength(255)]
        public string? WasteNameEn { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("FactoryId")]
        public virtual Factory Factory { get; set; } = null!;
    }
}