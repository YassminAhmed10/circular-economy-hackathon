using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models.Entities;
using shadowfactory.Services.Interfaces;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OffersController : ControllerBase
    {
        private readonly ECoVDbContext _db;
        private readonly IEscrowService _escrowService;
        private readonly ILogger<OffersController> _logger;

        public OffersController(ECoVDbContext db, IEscrowService escrowService, ILogger<OffersController> logger)
        {
            _db = db;
            _escrowService = escrowService;
            _logger = logger;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOffer([FromBody] Offer offer)
        {
            if (offer == null || offer.Amount <= 0 || offer.Price <= 0) return BadRequest();
            offer.Status = "Pending";
            offer.CreatedAt = DateTime.UtcNow;
            offer.UpdatedAt = DateTime.UtcNow;
            _db.Offers.Add(offer);
            await _db.SaveChangesAsync();
            return Ok(offer);
        }

        [HttpPost("{id}/accept")]
        public async Task<IActionResult> AcceptOffer(long id)
        {
            var offer = await _db.Offers.FindAsync(id);
            if (offer == null) return NotFound();

            if (offer.Status != "Pending") return BadRequest(new { message = "Offer not pending" });

            // Create order
            var order = new WasteRecyclingOrder
            {
                WasteAssetId = offer.WasteAssetId,
                BuyerFactoryId = offer.BuyerFactoryId,
                Amount = offer.Amount,
                Unit = offer.Unit,
                Price = offer.Price,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.WasteRecyclingOrders.Add(order);
            await _db.SaveChangesAsync();

            // Put payment on hold (escrow)
            var escrow = await _escrowService.CreateHoldAsync(order.Id, offer.Price);

            // Link escrow to order (if you add an EscrowId on the order, set it here)
            order.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            offer.Status = "Accepted";
            offer.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return Ok(new { order, escrow });
        }
    }
}