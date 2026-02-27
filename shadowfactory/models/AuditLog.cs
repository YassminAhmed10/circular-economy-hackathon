using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models
{
    [Table("AuditLogs")]
    public class AuditLog
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public long? UserId { get; set; }
        public long? FactoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string Action { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string EntityType { get; set; } = string.Empty;

        public long? EntityId { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }

        [StringLength(45)]
        public string? IpAddress { get; set; }

        [StringLength(500)]
        public string? UserAgent { get; set; }

        [StringLength(500)]
        public string? Url { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        // ⭐⭐⭐ ADD THIS NAVIGATION PROPERTY ⭐⭐⭐
        [ForeignKey("FactoryId")]
        public virtual Factory? Factory { get; set; }
    }
}