using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("WasteListings")]
    public class WasteListing
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Type { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string TypeEn { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        public long FactoryId { get; set; }

        [Required]
        [StringLength(200)]
        public string FactoryName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [StringLength(500)]
        public string Description { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Category { get; set; } = string.Empty;

        [StringLength(500)]
        public string? ImageUrl { get; set; }

        [Required]
        [StringLength(20)]
        public string Status { get; set; } = "Active";

        public int Views { get; set; } = 0;
        public int Offers { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ExpiresAt { get; set; }

        // Navigation property - Use the correct Factory type from shadowfactory.Models
        [ForeignKey("FactoryId")]
        public virtual shadowfactory.Models.Factory? Factory { get; set; }
    }
}