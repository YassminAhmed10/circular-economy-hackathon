using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models
{
    [Table("VerificationTokens")]
    public class VerificationToken
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Token { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string TokenType { get; set; } = "email_verification";

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; } = false;

        public long? FactoryId { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation property
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }
    }
}