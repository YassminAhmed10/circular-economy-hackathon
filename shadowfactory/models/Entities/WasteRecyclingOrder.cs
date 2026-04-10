using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("WasteRecyclingOrders", Schema = "dbo")]
    public class WasteRecyclingOrder : IHasTimestamps
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public long? WasteAssetId { get; set; }

        public long? RecyclerId { get; set; }

        public long? BuyerFactoryId { get; set; }

        public long? SellerFactoryId { get; set; }

        // New: keep a WasteType string (existing code parses this to WasteTypeEnum)
        public string? WasteType { get; set; }

        public decimal Amount { get; set; }

        public string Unit { get; set; } = "kg";

        public decimal Price { get; set; }

        public string? Status { get; set; } = "Pending";

        public DateTime? AcceptedAt { get; set; }

        public DateTime? ProcessedAt { get; set; }

        public string? OutputMaterialDescription { get; set; }

        public decimal? RecyclerEfficiency { get; set; } = 0.8m;

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}