using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("Offers", Schema = "dbo")]
    public class Offer : IHasTimestamps
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        // Link to a listing or asset (choose one as you migrate)
        public long? WasteListingId { get; set; }
        public long? WasteAssetId { get; set; }

        public long BuyerFactoryId { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [StringLength(20)]
        public string Unit { get; set; } = "kg";

        [StringLength(50)]
        public string Status { get; set; } = "Pending"; // Pending, Accepted, Rejected, Withdrawn, Expired

        public DateTime? ExpiresAt { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}