using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Hubs;
using shadowfactory.Models.Entities;
using shadowfactory.Services.Interfaces;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/recycler")]
    [Authorize]
    public class RecyclerFulfillmentController : ControllerBase
    {
        private readonly ECoVDbContext _db;
        private readonly IWebHostEnvironment _env;
        private readonly IHubContext<NotificationsHub> _hub;
        private readonly IImpactCalculationService _impactService;
        private readonly IWasteTypeMapper _wasteTypeMapper;
        private readonly ILogger<RecyclerFulfillmentController> _logger;

        public RecyclerFulfillmentController(
            ECoVDbContext db,
            IWebHostEnvironment env,
            IHubContext<NotificationsHub> hub,
            IImpactCalculationService impactService,
            IWasteTypeMapper wasteTypeMapper,
            ILogger<RecyclerFulfillmentController> logger)
        {
            _db = db;
            _env = env;
            _hub = hub;
            _impactService = impactService;
            _wasteTypeMapper = wasteTypeMapper;
            _logger = logger;
        }

        // Helper: get current factory id from claims (same pattern used elsewhere)
        private long? GetCurrentFactoryId()
        {
            var idClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (long.TryParse(idClaim, out var userId))
            {
                var user = _db.Users.FirstOrDefault(u => u.Id == userId);
                return user?.FactoryId;
            }
            return null;
        }

        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingJobs()
        {
            var factoryId = GetCurrentFactoryId();
            if (factoryId == null) return Unauthorized();

            var jobs = await _db.WasteRecyclingOrders
                .Where(o => (o.RecyclerId == null && o.Status == "AwaitingRecycler") || o.RecyclerId == factoryId)
                .OrderBy(o => o.CreatedAt)
                .ToListAsync();

            return Ok(new { success = true, items = jobs });
        }

        [HttpPost("{orderId}/accept")]
        public async Task<IActionResult> AcceptJob(long orderId)
        {
            var factoryId = GetCurrentFactoryId();
            if (factoryId == null) return Unauthorized();

            var job = await _db.WasteRecyclingOrders.FindAsync(orderId);
            if (job == null) return NotFound();

            // assign recycler (factoryId is non-null here because of the check above)
            job.RecyclerId = factoryId.Value;
            job.Status = "Accepted";
            job.AcceptedAt = DateTime.UtcNow;
            job.UpdatedAt = DateTime.UtcNow;
            _db.WasteRecyclingOrders.Update(job);

            var journey = new WasteJourneyEntry
            {
                WasteAssetId = job.WasteAssetId ?? 0L,
                Status = WasteStatusEnum.Accepted,
                ResponsibleFactoryId = factoryId.Value,
                Timestamp = DateTime.UtcNow,
                Notes = "Recycler accepted the job"
            };
            _db.WasteJourneyEntries.Add(journey);

            await _db.SaveChangesAsync();

            await _hub.Clients.Group($"factory-{job.BuyerFactoryId}").SendAsync("JobAccepted", new { orderId = job.Id });
            await _hub.Clients.Group($"factory-{job.SellerFactoryId}").SendAsync("JobAccepted", new { orderId = job.Id });

            return Ok(new { success = true, orderId = job.Id });
        }

        [HttpPost("{orderId}/upload-proof")]
        public async Task<IActionResult> UploadProof(long orderId, IFormFile file)
        {
            var factoryId = GetCurrentFactoryId();
            if (factoryId == null) return Unauthorized();

            var job = await _db.WasteRecyclingOrders.FindAsync(orderId);
            if (job == null) return NotFound();

            if (file == null || file.Length == 0) return BadRequest(new { success = false, message = "No file uploaded" });

            var uploads = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads", "recycling", orderId.ToString());
            Directory.CreateDirectory(uploads);

            var filename = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
            var filePath = Path.Combine(uploads, filename);
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var publicUrl = $"/uploads/recycling/{orderId}/{filename}";

            var journey = new WasteJourneyEntry
            {
                WasteAssetId = job.WasteAssetId ?? 0L,
                Status = WasteStatusEnum.Processed,
                ResponsibleFactoryId = factoryId.Value,
                Timestamp = DateTime.UtcNow,
                ProofUrl = publicUrl,
                Notes = "Recycler uploaded proof"
            };
            _db.WasteJourneyEntries.Add(journey);
            await _db.SaveChangesAsync();

            await _hub.Clients.Group($"factory-{job.BuyerFactoryId}").SendAsync("ProofUploaded", new { orderId = job.Id, url = publicUrl });
            await _hub.Clients.Group($"factory-{job.SellerFactoryId}").SendAsync("ProofUploaded", new { orderId = job.Id, url = publicUrl });

            return Ok(new { success = true, url = publicUrl });
        }

        public class CompleteRequest
        {
            public decimal OutputAmount { get; set; }
            public string OutputUnit { get; set; } = "kg";
            public string OutputDescription { get; set; } = string.Empty;
            public decimal RecyclerEfficiency { get; set; } = 0.8m;
        }

        [HttpPost("{orderId}/complete")]
        public async Task<IActionResult> CompleteJob(long orderId, [FromBody] CompleteRequest req)
        {
            var factoryId = GetCurrentFactoryId();
            if (factoryId == null) return Unauthorized();

            var job = await _db.WasteRecyclingOrders.FindAsync(orderId);
            if (job == null) return NotFound();

            job.ProcessedAt = DateTime.UtcNow;
            job.Status = "Completed";
            job.OutputMaterialDescription = req.OutputDescription;
            job.RecyclerEfficiency = req.RecyclerEfficiency;
            job.UpdatedAt = DateTime.UtcNow;
            _db.WasteRecyclingOrders.Update(job);

            // Map waste type string -> WasteTypeEnum using the injected mapper
            var mappedType = _wasteTypeMapper.Map(job.WasteType);

            var processed = new WasteAsset
            {
                GeneratorFactoryId = job.RecyclerId ?? factoryId.Value,
                Type = mappedType,
                Amount = req.OutputAmount,
                Unit = req.OutputUnit,
                Price = 0m,
                CurrentStatus = "Available",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
            _db.WasteAssets.Add(processed);

            var journey = new WasteJourneyEntry
            {
                WasteAssetId = job.WasteAssetId ?? 0L,
                Status = WasteStatusEnum.Completed,
                ResponsibleFactoryId = job.RecyclerId ?? factoryId.Value,
                Timestamp = DateTime.UtcNow,
                Notes = $"Recycling completed; output asset id: {processed.Id}"
            };
            _db.WasteJourneyEntries.Add(journey);

            await _db.SaveChangesAsync();

            try
            {
                await _impactService.CalculateForOrderAsync(job.Id);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Impact calculation failed for order {OrderId}", job.Id);
            }

            await _hub.Clients.Group($"factory-{job.BuyerFactoryId}").SendAsync("JobCompleted", new { orderId = job.Id, processedAssetId = processed.Id });
            await _hub.Clients.Group($"factory-{job.SellerFactoryId}").SendAsync("JobCompleted", new { orderId = job.Id, processedAssetId = processed.Id });

            return Ok(new { success = true, orderId = job.Id, processedAssetId = processed.Id });
        }
    }
}