using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using shadowfactory.Services.Interfaces;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;

        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        [HttpPost("create-payment-intent")]
        [Authorize]
        public async Task<IActionResult> CreatePaymentIntent([FromBody] PaymentIntentRequest req)
        {
            if (req == null || req.Amount <= 0)
                return BadRequest(new { success = false, message = "Invalid amount" });

            var clientSecret = await _paymentService.CreatePaymentIntentAsync(req.Amount, req.Currency ?? "usd");
            return Ok(new { success = true, clientSecret });
        }
    }

    public class PaymentIntentRequest
    {
        public decimal Amount { get; set; }
        public string? Currency { get; set; } = "usd";
    }
}