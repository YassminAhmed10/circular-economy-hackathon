using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using shadowfactory.Services.Interfaces;
using Stripe;
using Stripe.Checkout;

namespace shadowfactory.Services
{
    public class PaymentService : IPaymentService
    {
        private readonly ILogger<PaymentService> _logger;

        public PaymentService(IConfiguration config, ILogger<PaymentService> logger)
        {
            _logger = logger;
            StripeConfiguration.ApiKey = config["Stripe:SecretKey"] ?? string.Empty;
        }

        // Creates a payment intent and returns client secret
        public async Task<string> CreatePaymentIntentAsync(decimal amount, string currency = "usd")
        {
            var options = new PaymentIntentCreateOptions
            {
                Amount = (long)(amount * 100), // Stripe expects cents
                Currency = currency,
                PaymentMethodTypes = new List<string> { "card" },
                Description = "ECoV Payment"
            };

            var service = new PaymentIntentService();
            var intent = await service.CreateAsync(options);
            _logger.LogInformation("Created payment intent {PaymentIntentId} for amount {Amount} {Currency}", intent.Id, amount, currency);
            return intent.ClientSecret;
        }
    }
}