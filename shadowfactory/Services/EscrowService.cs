using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using shadowfactory.Data;
using shadowfactory.Models.Entities;
using shadowfactory.Services.Interfaces;
using Stripe;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace shadowfactory.Services
{
    public class EscrowService : IEscrowService
    {
        private readonly ECoVDbContext _db;
        private readonly ILogger<EscrowService> _logger;

        public EscrowService(ECoVDbContext db, IConfiguration cfg, ILogger<EscrowService> logger)
        {
            _db = db;
            _logger = logger;
            StripeConfiguration.ApiKey = cfg["Stripe:SecretKey"] ?? string.Empty;
        }

        public async Task<Escrow> CreateHoldAsync(long orderId, decimal amount, string currency = "usd")
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100),
                Currency = currency,
                CaptureMethod = "manual",
                PaymentMethodTypes = new List<string> { "card" },
                Description = $"Escrow hold for order {orderId}"
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);

            var escrow = new Escrow
            {
                WasteRecyclingOrderId = orderId,
                PaymentIntentId = intent.Id,
                Amount = amount,
                Currency = currency,
                Status = "Held",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.Escrows.Add(escrow);
            await _db.SaveChangesAsync();
            _logger.LogInformation("Created escrow hold {EscrowId} intent={IntentId}", escrow.Id, intent.Id);
            return escrow;
        }

        public async Task CaptureAsync(long escrowId)
        {
            var escrow = await _db.Escrows.FindAsync(escrowId);
            if (escrow == null) return;

            var service = new PaymentIntentService();
            await service.CaptureAsync(escrow.PaymentIntentId);

            escrow.Status = "Captured";
            escrow.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            _logger.LogInformation("Captured escrow {EscrowId}", escrowId);
        }

        public async Task ReleaseAsync(long escrowId)
        {
            var escrow = await _db.Escrows.FindAsync(escrowId);
            if (escrow == null) return;

            var service = new PaymentIntentService();
            await service.CancelAsync(escrow.PaymentIntentId);

            escrow.Status = "Released";
            escrow.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            _logger.LogInformation("Released escrow {EscrowId}", escrowId);
        }

        public async Task RefundAsync(long escrowId)
        {
            var escrow = await _db.Escrows.FindAsync(escrowId);
            if (escrow == null) return;

            // Refund logic placeholder — capture stores a charge id; implement refund against charge id after capture.
            escrow.Status = "Refunded";
            escrow.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            _logger.LogInformation("Marked escrow {EscrowId} as refunded (implement real refund against charge)", escrowId);
        }
    }
}