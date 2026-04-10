using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("Escrows", Schema = "dbo")]
    public class Escrow : IHasTimestamps
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public long? WasteRecyclingOrderId { get; set; }

        [StringLength(200)]
        public string? PaymentIntentId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [StringLength(10)]
        public string Currency { get; set; } = "usd";

        [StringLength(50)]
        public string Status { get; set; } = "Held"; // Held, Captured, Released, Refunded

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}