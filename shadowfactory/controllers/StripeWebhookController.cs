using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Stripe;
using System.IO;
using System.Threading.Tasks;
using shadowfactory.Data;
using System.Linq;
using System;

namespace shadowfactory.Controllers
{
    [Route("api/webhooks/stripe")]
    public class StripeWebhookController : ControllerBase
    {
        private readonly IWebHostEnvironment _env;
        private readonly ECoVDbContext _db;
        private readonly ILogger<StripeWebhookController> _logger;
        private readonly IConfiguration _config;

        public StripeWebhookController(
            IWebHostEnvironment env,
            ECoVDbContext db,
            ILogger<StripeWebhookController> logger,
            IConfiguration config)
        {
            _env = env;
            _db = db;
            _logger = logger;
            _config = config;
        }

        [HttpPost]
        public async Task<IActionResult> Post()
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            var sigHeader = Request.Headers["Stripe-Signature"].ToString();
            var webhookSecret = _config["Stripe:WebhookSecret"];

            Event stripeEvent;
            try
            {
                stripeEvent = EventUtility.ConstructEvent(json, sigHeader, webhookSecret);
            }
            catch (StripeException ex)
            {
                _logger.LogWarning(ex, "Invalid Stripe webhook signature");
                return BadRequest();
            }

            try
            {
                switch (stripeEvent.Type)
                {
                    case "payment_intent.succeeded":
                        var pi = stripeEvent.Data.Object as PaymentIntent;
                        if (pi != null)
                        {
                            var escrow = _db.Escrows.FirstOrDefault(e => e.PaymentIntentId == pi.Id);
                            if (escrow != null)
                            {
                                escrow.Status = "Captured";
                                escrow.UpdatedAt = DateTime.UtcNow;
                                _db.Escrows.Update(escrow);
                                await _db.SaveChangesAsync();
                                _logger.LogInformation("Escrow {EscrowId} marked captured for PaymentIntent {PI}", escrow.Id, pi.Id);
                            }
                        }
                        break;

                    case "payment_intent.canceled":
                        var pic = stripeEvent.Data.Object as PaymentIntent;
                        if (pic != null)
                        {
                            var escrowC = _db.Escrows.FirstOrDefault(e => e.PaymentIntentId == pic.Id);
                            if (escrowC != null)
                            {
                                escrowC.Status = "Canceled";
                                escrowC.UpdatedAt = DateTime.UtcNow;
                                _db.Escrows.Update(escrowC);
                                await _db.SaveChangesAsync();
                                _logger.LogInformation("Escrow {EscrowId} marked canceled for PaymentIntent {PI}", escrowC.Id, pic.Id);
                            }
                        }
                        break;

                    case "charge.refunded":
                        _logger.LogInformation("Received charge.refunded event");
                        // optional: reconcile refund into escrow/order records here
                        break;

                    default:
                        _logger.LogInformation("Unhandled Stripe event type: {Type}", stripeEvent.Type);
                        break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing Stripe webhook");
                return StatusCode(500);
            }

            return Ok();
        }
    }
}