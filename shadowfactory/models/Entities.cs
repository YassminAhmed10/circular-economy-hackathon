using shadowfactory.Models.Entities;
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

        [Range(1900, 2100)]
        public int? EstablishmentYear { get; set; }

        // Keep both for backward compatibility
        public int? NumberOfEmployees { get; set; }
        public int? EmployeeCount { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? FactorySize { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ProductionCapacity { get; set; }

        [StringLength(500)]
        public string? LogoUrl { get; set; }

        public bool IsVerified { get; set; } = false;

        [StringLength(50)]
        public string Status { get; set; } = "Pending";

        [StringLength(1000)]
        public string? DescriptionAr { get; set; }

        [StringLength(1000)]
        public string? DescriptionEn { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal? Rating { get; set; }

        public int? TotalReviews { get; set; }

        [Column(TypeName = "decimal(10,8)")]
        public decimal? Latitude { get; set; }

        [Column(TypeName = "decimal(11,8)")]
        public decimal? Longitude { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [JsonIgnore]
        public virtual ICollection<FactoryWasteType> FactoryWasteTypes { get; set; } = new List<FactoryWasteType>();

        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; } = new List<User>();

        [JsonIgnore]
        public virtual ICollection<AuditLog>? AuditLogs { get; set; }

        [JsonIgnore]
        public virtual VerificationToken? VerificationToken { get; set; }

        [JsonIgnore]
        public virtual ICollection<Transaction>? SellerTransactions { get; set; }

        [JsonIgnore]
        public virtual ICollection<Transaction>? BuyerTransactions { get; set; }
    }
}