using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using shadowfactory.Models.Entities; // Add this for Transaction if needed

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

        // ============ NAVIGATION PROPERTIES ============

        // Collection of Users associated with this factory
        [JsonIgnore]
        public virtual ICollection<User> Users { get; set; } = new List<User>();

        // Collection of FactoryWasteTypes associated with this factory
        [JsonIgnore]
        public virtual ICollection<FactoryWasteType> FactoryWasteTypes { get; set; } = new List<FactoryWasteType>();

        // ⭐⭐⭐ ADD THIS MISSING NAVIGATION PROPERTY ⭐⭐⭐
        // Collection of AuditLogs associated with this factory
        [JsonIgnore]
        public virtual ICollection<AuditLog>? AuditLogs { get; set; }

        // ⭐⭐⭐ ADD THIS MISSING NAVIGATION PROPERTY ⭐⭐⭐
        // Single VerificationToken associated with this factory (one-to-one)
        [JsonIgnore]
        public virtual VerificationToken? VerificationToken { get; set; }

        // Optional: Add these if you need them for transactions
        [JsonIgnore]
        public virtual ICollection<Transaction>? SellerTransactions { get; set; }

        [JsonIgnore]
        public virtual ICollection<Transaction>? BuyerTransactions { get; set; }
    }
}