using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        [NotMapped]  // ⭐⭐⭐ ADD THIS - TELL EF TO IGNORE THIS COLUMN ⭐⭐⭐
        public string Phone { get; set; } = string.Empty;

        [NotMapped]  // ⭐⭐⭐ ADD THIS ⭐⭐⭐
        public bool? EmailNotifications { get; set; }

        [NotMapped]  // ⭐⭐⭐ ADD THIS ⭐⭐⭐
        public bool? AppNotifications { get; set; }

        [NotMapped]  // ⭐⭐⭐ ADD THIS ⭐⭐⭐
        public bool? PublicProfile { get; set; }

        [NotMapped]  // ⭐⭐⭐ ADD THIS ⭐⭐⭐
        public DateTime RegistrationDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }
    }
}