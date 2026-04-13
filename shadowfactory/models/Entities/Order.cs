using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace shadowfactory.Models.Entities
{
    [Table("Orders")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { get; set; }

        [Required]
        [StringLength(50)]
        public string OrderNumber { get; set; } = string.Empty;

        [Required]
        public long WasteListingId { get; set; }

        [Required]
        public long BuyerFactoryId { get; set; }

        [Required]
        public long SellerFactoryId { get; set; }

        [Required]
        [StringLength(100)]
        public string WasteType { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string WasteCategory { get; set; } = string.Empty;

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = string.Empty;

        [Required]
        public decimal Price { get; set; }

        [Required]
        [StringLength(100)]
        public string BuyerName { get; set; } = string.Empty;

        [Required]
        [StringLength(100)]
        public string SellerName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "معلق";

        /// <summary>
        /// Order lifecycle status: Pending, Confirmed, In Progress, Sent to Recycler, Completed, Cancelled
        /// </summary>
        [StringLength(50)]
        public string OrderStatus { get; set; } = "Pending";

        /// <summary>
        /// Payment status for buyer->seller payment: Pending, Paid, Failed
        /// </summary>
        [StringLength(50)]
        public string PaymentStatus { get; set; } = "Pending";

        /// <summary>
        /// Recycler request status (optional): None, Requested, Accepted, Processing, Completed, Rejected
        /// </summary>
        [StringLength(50)]
        public string? RecyclerStatus { get; set; } = "None";

        [StringLength(500)]
        public string? Notes { get; set; }

        // ════════════════════════════════════════
        // PRICING
        // ════════════════════════════════════════
        /// <summary>
        /// Total price for buyer to pay seller (Amount * Price per unit)
        /// </summary>
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        /// <summary>
        /// Recycler processing fee (only if recycler is involved)
        /// </summary>
        [Column(TypeName = "decimal(18,2)")]
        public decimal? RecyclerProcessingFee { get; set; }

        // ════════════════════════════════════════
        // RECYCLER WORKFLOW (Optional)
        // ════════════════════════════════════════
        /// <summary>
        /// Reference to Recycler if waste is being sent for recycling
        /// </summary>
        public int? RecyclerId { get; set; }

        /// <summary>
        /// Reference to WasteRecyclingOrder for tracking recycler processing
        /// </summary>
        public long? WasteRecyclingOrderId { get; set; }

        // ════════════════════════════════════════
        // DIRECT USAGE ORDER FIELDS
        // ════════════════════════════════════════
        /// <summary>
        /// Name of delivery recipient (for direct orders)
        /// </summary>
        [StringLength(100)]
        public string? RecipientName { get; set; }

        /// <summary>
        /// Phone of delivery recipient (for direct orders)
        /// </summary>
        [StringLength(20)]
        public string? RecipientPhone { get; set; }

        /// <summary>
        /// Delivery address (for direct orders)
        /// </summary>
        [StringLength(500)]
        public string? DeliveryAddress { get; set; }

        /// <summary>
        /// Governorate name (for direct orders)
        /// </summary>
        [StringLength(100)]
        public string? Governorate { get; set; }

        /// <summary>
        /// Delivery method: 'pickup' or 'delivery'
        /// </summary>
        [StringLength(50)]
        public string? DeliveryMethod { get; set; }

        /// <summary>
        /// Payment method: 'cash', 'bank_transfer', 'credit_card', etc.
        /// </summary>
        [StringLength(50)]
        public string? PaymentMethod { get; set; }

        /// <summary>
        /// Order type: 'direct' (direct usage) or 'recycler' (recycling)
        /// </summary>
        [StringLength(50)]
        public string? OrderType { get; set; } = "direct";

        // ════════════════════════════════════════
        // TIMELINE
        // ════════════════════════════════════════
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;

        public DateTime? DeliveryDate { get; set; }

        public DateTime? CompletedDate { get; set; }

        /// <summary>
        /// When buyer requested waste to be sent to recycler
        /// </summary>
        public DateTime? RecyclerRequestedAt { get; set; }

        /// <summary>
        /// When recycler accepted the recycling request
        /// </summary>
        public DateTime? RecyclerAcceptedAt { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        // ════════════════════════════════════════
        // NAVIGATION PROPERTIES
        // ════════════════════════════════════════
        [ForeignKey("WasteListingId")]
        public virtual WasteListing? WasteListing { get; set; }

        [ForeignKey("BuyerFactoryId")]
        public virtual Factory? BuyerFactory { get; set; }

        [ForeignKey("SellerFactoryId")]
        public virtual Factory? SellerFactory { get; set; }

        [ForeignKey("RecyclerId")]
        public virtual Recycler? Recycler { get; set; }

        [ForeignKey("WasteRecyclingOrderId")]
        public virtual WasteRecyclingOrder? WasteRecyclingOrder { get; set; }

        /// <summary>
        /// Payment records for this order (buyer to seller, and buyer to recycler if applicable)
        /// </summary>
        public virtual ICollection<OrderPayment> Payments { get; set; } = new List<OrderPayment>();
    }
}