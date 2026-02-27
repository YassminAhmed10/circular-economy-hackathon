using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Factory = shadowfactory.Models.Factory;

namespace shadowfactory.Models.Entities
{
    [Table("Partners")]
    public class Partner
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Specialty { get; set; } = string.Empty;

        [Range(0, 5)]
        public decimal Rating { get; set; } = 0;

        public int CompletedDeals { get; set; } = 0;

        [StringLength(500)]
        public string? Description { get; set; }

        [StringLength(500)]
        public string? LogoUrl { get; set; }

        [StringLength(100)]
        public string? ContactEmail { get; set; }

        [StringLength(20)]
        public string? ContactPhone { get; set; }

        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}