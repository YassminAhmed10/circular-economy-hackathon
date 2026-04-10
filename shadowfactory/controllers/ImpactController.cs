using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImpactController : ControllerBase
    {
        private readonly ECoVDbContext _db;

        public ImpactController(ECoVDbContext db)
        {
            _db = db;
        }

        [HttpGet("factory/{factoryId}")]
        [Authorize]
        public async Task<IActionResult> GetFactoryImpact(long factoryId)
        {
            var totals = await _db.EnvironmentalImpactRecords
                .Where(r => r.FactoryId == factoryId)
                .GroupBy(r => r.WasteType)
                .Select(g => new
                {
                    WasteType = g.Key.ToString(),
                    CO2AvoidedKg = g.Sum(x => x.CO2AvoidedKg)
                })
                .ToListAsync();

            var totalCO2 = totals.Sum(t => t.CO2AvoidedKg);
            return Ok(new { totalCO2, breakdown = totals });
        }

        [HttpGet("platform/stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPlatformStats()
        {
            var totals = await _db.EnvironmentalImpactRecords
                .GroupBy(r => r.WasteType)
                .Select(g => new
                {
                    WasteType = g.Key.ToString(),
                    CO2AvoidedKg = g.Sum(x => x.CO2AvoidedKg)
                })
                .ToListAsync();

            var totalCO2 = totals.Sum(t => t.CO2AvoidedKg);
            return Ok(new { totalCO2, breakdown = totals });
        }
    }
}