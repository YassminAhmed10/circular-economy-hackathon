using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace shadowfactory.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string Salt { get; set; } = string.Empty;

        [Required]
        [StringLength(500)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Role { get; set; } = "FactoryOwner";

        public long? FactoryId { get; set; }

        public DateTime? LastLogin { get; set; }

        public bool IsActive { get; set; } = true;

        [StringLength(20)]
        public string? Phone { get; set; }

        public bool EmailNotifications { get; set; } = true;

        public bool AppNotifications { get; set; } = true;

        public bool PublicProfile { get; set; } = true;

        public DateTime? RegistrationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }
    }
}