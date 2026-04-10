using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("WasteJourneyEntries", Schema = "dbo")]
    public class WasteJourneyEntry
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        public long WasteAssetId { get; set; }

        public WasteStatusEnum Status { get; set; }

        public long ResponsibleFactoryId { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string? ProofUrl { get; set; }

        public string? Notes { get; set; }
    }

    public enum WasteStatusEnum
    {
        Created,
        Offered,
        Accepted,
        InTransit,
        Processed,
        Completed,
        Cancelled
    }
}