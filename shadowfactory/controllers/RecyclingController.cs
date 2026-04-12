using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Hubs;
using shadowfactory.Models.Entities;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/orders")]
    public class RecyclingController : ControllerBase
    {
        private readonly ECoVDbContext _db;
        private readonly IHubContext<NotificationsHub> _hub;
        private readonly ILogger<RecyclingController> _logger;

        public RecyclingController(ECoVDbContext db, IHubContext<NotificationsHub> hub, ILogger<RecyclingController> logger)
        {
            _db = db;
            _hub = hub;
            _logger = logger;
        }

        /// <summary>
        /// Create a WasteRecyclingOrder from an existing Order and suggest recyclers based on waste type.
        /// Returns created recyclingOrderId and suggested recyclers (lightweight list).
        /// </summary>
        [HttpPost("{id}/send-to-recycler")]
        public async Task<IActionResult> SendToRecycler(long id)
        {
            var order = await _db.Orders
                .Include(o => o.WasteListing)
                .FirstOrDefaultAsync(o => o.Id == id);

            if (order == null) return NotFound(new { success = false, message = "Order not found" });

            // create a recycling order (keeps original order separate)
            var recyclingOrder = new WasteRecyclingOrder
            {
                WasteAssetId = null,
                BuyerFactoryId = order.BuyerFactoryId,
                SellerFactoryId = order.SellerFactoryId,
                Amount = order.Amount,
                Price = order.Price,
                Unit = order.Unit,
                WasteType = order.WasteType,
                Status = "AwaitingRecycler",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _db.WasteRecyclingOrders.Add(recyclingOrder);
            await _db.SaveChangesAsync();

            // Suggest recyclers: factories that advertise handling this waste type (simple heuristic)
            var suggested = await _db.Factories
                .Where(f => _db.FactoryWasteTypes.Any(ft => ft.FactoryId == f.Id && ft.WasteCode == order.WasteType))
                .Select(f => new { f.Id, f.FactoryName, f.Location })
                .Take(5)
                .ToListAsync();

            // create initial journey entry (seller -> recycler reservation)
            var journey = new WasteJourneyEntry
            {
                WasteAssetId = recyclingOrder.WasteAssetId ?? 0L,
                Status = WasteStatusEnum.InTransit,
                ResponsibleFactoryId = recyclingOrder.SellerFactoryId ?? order.SellerFactoryId,
                Timestamp = DateTime.UtcNow,
                ProofUrl = null,
                Notes = $"Recycling order created from Order #{order.Id}"
            };
            _db.WasteJourneyEntries.Add(journey);
            await _db.SaveChangesAsync();

            // Notify suggested recyclers via SignalR group (group naming convention: "factory-{id}")
            foreach (var r in suggested)
            {
                await _hub.Clients.Group($"factory-{r.Id}").SendAsync("NewSuggestedJob", new { recyclingOrderId = recyclingOrder.Id, wasteType = recyclingOrder.WasteType });
            }

            return Ok(new { success = true, recyclingOrderId = recyclingOrder.Id, suggestions = suggested });
        }
    }
}