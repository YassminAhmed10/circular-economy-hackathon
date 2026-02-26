using ECoV.API.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shadowfactory.Models
{
    [Table("Factories")]
    public class Factory
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(255)]
        public string FactoryName { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string FactoryNameEn { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string IndustryType { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string Address { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string Phone { get; set; } = string.Empty;

        [StringLength(20)]
        public string? Fax { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Website { get; set; }

        [Required]
        [StringLength(255)]
        public string OwnerName { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string OwnerPhone { get; set; } = string.Empty;

        [EmailAddress]
        [StringLength(255)]
        public string? OwnerEmail { get; set; }

        [Required]
        [StringLength(50)]
        public string TaxNumber { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string RegistrationNumber { get; set; } = string.Empty;

        public int? EstablishmentYear { get; set; }

        public int? NumberOfEmployees { get; set; }

        public decimal? FactorySize { get; set; }

        public decimal ProductionCapacity { get; set; }

        public string? LogoUrl { get; set; }

        public bool Verified { get; set; } = false;

        [StringLength(50)]
        public string Status { get; set; } = "Pending";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<FactoryWasteType> FactoryWasteTypes { get; set; } = new List<FactoryWasteType>();
    }
}