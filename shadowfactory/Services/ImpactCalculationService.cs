using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using shadowfactory.Data;
using shadowfactory.Models.Entities;
using shadowfactory.Services.Interfaces;

namespace shadowfactory.Services
{
    public class ImpactCalculationService : IImpactCalculationService
    {
        private readonly ECoVDbContext _db;
        private readonly ILogger<ImpactCalculationService> _logger;

        // Baseline CO2 in kg per unit (unit assumed kg). Adjust units accordingly
        private readonly Dictionary<WasteTypeEnum, decimal> _co2Baseline = new()
        {
            { WasteTypeEnum.Plastic, 2.5m },
            { WasteTypeEnum.Metal, 1.5m },
            { WasteTypeEnum.Paper, 0.8m },
            { WasteTypeEnum.Glass, 0.6m },
            { WasteTypeEnum.PackagingPlastic, 2.2m },
            { WasteTypeEnum.PackagingPaper, 0.9m },
            { WasteTypeEnum.PackagingFoam, 3.0m },
            { WasteTypeEnum.Mixed, 1.5m }
        };

        private readonly decimal _defaultRecyclerEfficiency = 0.8m;

        public ImpactCalculationService(ECoVDbContext db, ILogger<ImpactCalculationService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task CalculateForOrderAsync(long orderId)
        {
            var order = await _db.WasteRecyclingOrders.FindAsync(orderId);
            if (order == null) return;

            // Map string type to enum if necessary
            if (!Enum.TryParse<WasteTypeEnum>(order.WasteType ?? "Mixed", out var wasteType))
                wasteType = WasteTypeEnum.Mixed;

            var baseline = _co2Baseline.ContainsKey(wasteType) ? _co2Baseline[wasteType] : 1.5m;
            var efficiency = order.RecyclerEfficiency ?? _defaultRecyclerEfficiency;
            var co2Avoided = (order.Amount * baseline) * efficiency; // amount units should match baseline units

            var record = new EnvironmentalImpactRecord
            {
                WasteAssetId = order.WasteAssetId,
                WasteRecyclingOrderId = order.Id,
                FactoryId = order.BuyerFactoryId ?? order.SellerFactoryId ?? 0,
                CO2AvoidedKg = co2Avoided,
                EnergySavedKwh = 0,
                WaterSavedLiters = 0,
                TreesEquivalent = Math.Round((double)(co2Avoided / 21.77m), 2),
                CalculationDate = DateTime.UtcNow,
                CalculationMethod = "Default baseline x efficiency"
            };

            _db.EnvironmentalImpactRecords.Add(record);
            await _db.SaveChangesAsync();
            _logger.LogInformation("Impact calculated for order {OrderId}: {CO2} kg", orderId, co2Avoided);
        }

        public async Task CalculateForFactoryAsync(long factoryId, DateTime from, DateTime to)
        {
            // Example aggregation - placeholder
            var orders = await _db.WasteRecyclingOrders
                .Where(o => (o.BuyerFactoryId == factoryId || o.SellerFactoryId == factoryId) && o.CreatedAt >= from && o.CreatedAt <= to)
                .ToListAsync();

            foreach (var o in orders)
            {
                await CalculateForOrderAsync(o.Id);
            }
        }
    }
}