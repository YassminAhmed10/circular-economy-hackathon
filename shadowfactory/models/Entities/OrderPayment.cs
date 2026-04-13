using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    /// <summary>
    /// Payment status enumeration
    /// </summary>
    public enum PaymentStatus
    {
        Pending = 0,
        Paid = 1,
        Failed = 2,
        Refunded = 3
    }

    /// <summary>
    /// Payment type enumeration
    /// </summary>
    public enum PaymentType
    {
        OrderPayment = 0,      // Buyer pays Seller for waste purchase
        RecyclerFee = 1        // Buyer pays Recycler for processing
    }

    /// <summary>
    /// Tracks payment records for Orders and Recycler fees
    /// This allows tracking of buyer->seller and buyer->recycler payments separately
    /// </summary>
    [Table("OrderPayments")]
    public class OrderPayment
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        /// <summary>
        /// Reference to the Order this payment is for
        /// </summary>
        [Required]
        public long OrderId { get; set; }

        /// <summary>
        /// Payment type: Order payment or Recycler processing fee
        /// </summary>
        [Required]
        public int PaymentType { get; set; } = (int)Models.Entities.PaymentType.OrderPayment;

        /// <summary>
        /// Who is paying (normally BuyerFactoryId from Order)
        /// </summary>
        [Required]
        public long PayerFactoryId { get; set; }

        /// <summary>
        /// Who is receiving payment (SellerFactoryId for OrderPayment, RecyclerId for RecyclerFee)
        /// </summary>
        [Required]
        public long PayeeFactoryId { get; set; }

        /// <summary>
        /// Amount to be paid
        /// </summary>
        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        /// <summary>
        /// Current payment status (Pending, Paid, Failed, Refunded)
        /// </summary>
        [Required]
        public int Status { get; set; } = (int)PaymentStatus.Pending;

        /// <summary>
        /// Payment method details (e.g., bank transfer, card, etc.)
        /// </summary>
        [StringLength(100)]
        public string? PaymentMethod { get; set; }

        /// <summary>
        /// Transaction reference or ID (for external payment gateway)
        /// </summary>
        [StringLength(200)]
        public string? TransactionReference { get; set; }

        /// <summary>
        /// Additional notes or error message
        /// </summary>
        [StringLength(500)]
        public string? Notes { get; set; }

        // ════════════════════════════════════════
        // TIMELINE
        // ════════════════════════════════════════
        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? CompletedAt { get; set; }

        public DateTime? FailedAt { get; set; }

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // ════════════════════════════════════════
        // NAVIGATION PROPERTIES
        // ════════════════════════════════════════
        [ForeignKey("OrderId")]
        public virtual Order? Order { get; set; }

        [ForeignKey("PayerFactoryId")]
        public virtual Factory? PayerFactory { get; set; }

        [ForeignKey("PayeeFactoryId")]
        public virtual Factory? PayeeFactory { get; set; }
    }
}
