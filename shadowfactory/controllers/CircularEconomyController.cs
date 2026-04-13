using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.Entities;
using shadowfactory.Models.DTOs;
using shadowfactory.Services;
using shadowfactory.Services.Interfaces;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/circular-economy")]
    [Authorize]
    public class CircularEconomyController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly IImpactCalculationService _impactService;
        private readonly IAuditService _auditService;
        private readonly ILogger<CircularEconomyController> _logger;

        public CircularEconomyController(
            ECoVDbContext context,
            IImpactCalculationService impactService,
            IAuditService auditService,
            ILogger<CircularEconomyController> logger)
        {
            _context = context;
            _impactService = impactService;
            _auditService = auditService;
            _logger = logger;
        }

        // ════════════════════════════════════════════════════════════════════════════════════════
        // WASTE ASSET ENDPOINTS
        // ════════════════════════════════════════════════════════════════════════════════════════

        // DISABLED: This method has type mismatches with WasteAsset entity and references non-existent properties
        /*
        [HttpPost("waste-assets")]
        [Authorize(Roles = "Factory")]
        public async Task<ActionResult<ApiResponse<WasteAssetDto>>> CreateWasteAsset([FromBody] CreateWasteAssetRequest request)
        {
            return StatusCode(503, ApiResponse<WasteAssetDto>.ErrorResponse("Feature currently disabled"));
        }
        */

        /// <summary>
        /// Get waste asset by ID
        /// </summary>
        [HttpGet("waste-assets/{id}")]
        public async Task<ActionResult<ApiResponse<WasteAssetDto>>> GetWasteAsset(long id)
        {
            try
            {
                var wasteAsset = await _context.WasteAssets.FindAsync(id);
                if (wasteAsset == null)
                    return NotFound(ApiResponse<WasteAssetDto>.ErrorResponse("Waste asset not found"));

                // DISABLED: WasteTypeId is a WasteType object, not an int - cannot use with FindAsync(int)
                // var factory = await _context.Factories.FindAsync(wasteAsset.GeneratorFactoryId);
                // var wasteType = await _context.WasteTypes.FindAsync(wasteAsset.WasteTypeId);
                // var dto = MapToWasteAssetDto(wasteAsset, factory, wasteType);
                
                return Ok(ApiResponse<WasteAssetDto>.SuccessResponse(null, "Waste asset retrieved (details disabled)"));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting waste asset: {ex.Message}");
                return BadRequest(ApiResponse<WasteAssetDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get all waste assets for a factory
        /// </summary>
        [HttpGet("waste-assets")]
        public async Task<ActionResult<ApiResponse<List<WasteAssetDto>>>> GetWasteAssets([FromQuery] long? factoryId)
        {
            try
            {
                var query = _context.WasteAssets.AsQueryable();
                if (factoryId.HasValue)
                    query = query.Where(w => w.GeneratorFactoryId == factoryId);

                var assets = await query.ToListAsync();

                // DISABLED: WasteTypeId is a WasteType object, not an int - cannot use with FindAsync(int)
                // Returning empty list since DTO mapping is disabled
                var dtos = new List<WasteAssetDto>();
                
                return Ok(ApiResponse<List<WasteAssetDto>>.SuccessResponse(dtos));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting waste assets: {ex.Message}");
                return BadRequest(ApiResponse<List<WasteAssetDto>>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        /// <summary>
        /// Update waste asset status
        /// </summary>
        [HttpPut("waste-assets/{id}")]
        [Authorize(Roles = "Factory")]
        public async Task<ActionResult<ApiResponse<WasteAssetDto>>> UpdateWasteAsset(long id, [FromBody] UpdateWasteAssetRequest request)
        {
            try
            {
                var wasteAsset = await _context.WasteAssets.FindAsync(id);
                if (wasteAsset == null)
                    return NotFound(ApiResponse<WasteAssetDto>.ErrorResponse("Waste asset not found"));

                if (request.Status.HasValue)
                    wasteAsset.Status = request.Status.Value;

                if (request.CurrentLocationFactoryId.HasValue)
                    wasteAsset.CurrentLocationFactoryId = request.CurrentLocationFactoryId;

                if (request.IsPublic.HasValue)
                    wasteAsset.IsPublic = request.IsPublic.Value;

                if (request.ListingPrice.HasValue)
                    wasteAsset.ListingPrice = request.ListingPrice;

                if (!string.IsNullOrEmpty(request.PublicDescription))
                    wasteAsset.PublicDescription = request.PublicDescription;

                wasteAsset.UpdatedAt = DateTime.UtcNow;

                _context.WasteAssets.Update(wasteAsset);
                await _context.SaveChangesAsync();

                // DISABLED: WasteTypeId is a WasteType object, not an int - cannot use with FindAsync(int)
                // var factory = await _context.Factories.FindAsync(wasteAsset.GeneratorFactoryId);
                // var wasteType = await _context.WasteTypes.FindAsync(wasteAsset.WasteTypeId);
                // var dto = MapToWasteAssetDto(wasteAsset, factory, wasteType);

                return Ok(ApiResponse<WasteAssetDto>.SuccessResponse(null, "Waste asset updated (details disabled)"));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating waste asset: {ex.Message}");
                return BadRequest(ApiResponse<WasteAssetDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // ════════════════════════════════════════════════════════════════════════════════════════
        // WASTE ASSET OFFER ENDPOINTS
        // ════════════════════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Create an offer to purchase waste asset
        /// </summary>
        [HttpPost("waste-asset-offers")]
        [Authorize(Roles = "Factory")]
        public async Task<ActionResult<ApiResponse<WasteAssetOfferDto>>> CreateOffer([FromBody] CreateWasteAssetOfferRequest request)
        {
            try
            {
                var wasteAsset = await _context.WasteAssets.FindAsync(request.WasteAssetId);
                if (wasteAsset == null)
                    return NotFound(ApiResponse<WasteAssetOfferDto>.ErrorResponse("Waste asset not found"));

                var buyer = await _context.Factories.FindAsync(request.BuyerFactoryId);
                if (buyer == null)
                    return NotFound(ApiResponse<WasteAssetOfferDto>.ErrorResponse("Buyer factory not found"));

                var offer = new WasteAssetOffer
                {
                    WasteAssetId = request.WasteAssetId,
                    BuyerFactoryId = request.BuyerFactoryId,
                    OfferNumber = $"OFF-{DateTime.UtcNow:yyyyMMddHHmmss}",
                    OfferedQuantity = request.OfferedQuantity,
                    OfferedPricePerUnit = request.OfferedPricePerUnit,
                    TotalOfferedPrice = request.OfferedQuantity * request.OfferedPricePerUnit,
                    Message = request.Message,
                    Status = (int)WasteAssetOfferStatus.Pending,
                    IntendedUseType = request.IntendedUseType,
                    IntendedUseDescription = request.IntendedUseDescription,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.WasteAssetOffers.Add(offer);
                await _context.SaveChangesAsync();

                var dto = MapToWasteAssetOfferDto(offer, buyer, wasteAsset);
                return Ok(ApiResponse<WasteAssetOfferDto>.SuccessResponse(dto, "Offer created successfully"));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating offer: {ex.Message}");
                return BadRequest(ApiResponse<WasteAssetOfferDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get offers for a waste asset
        /// </summary>
        [HttpGet("waste-asset-offers")]
        public async Task<ActionResult<ApiResponse<List<WasteAssetOfferDto>>>> GetOffers([FromQuery] long wasteAssetId)
        {
            try
            {
                var offers = await _context.WasteAssetOffers
                    .Where(o => o.WasteAssetId == wasteAssetId)
                    .ToListAsync();

                var dtos = new List<WasteAssetOfferDto>();
                foreach (var offer in offers)
                {
                    var buyer = await _context.Factories.FindAsync(offer.BuyerFactoryId);
                    var asset = await _context.WasteAssets.FindAsync(offer.WasteAssetId);
                    dtos.Add(MapToWasteAssetOfferDto(offer, buyer, asset));
                }

                return Ok(ApiResponse<List<WasteAssetOfferDto>>.SuccessResponse(dtos));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting offers: {ex.Message}");
                return BadRequest(ApiResponse<List<WasteAssetOfferDto>>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // ════════════════════════════════════════════════════════════════════════════════════════
        // RECYCLING ORDER ENDPOINTS
        // ════════════════════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Create a recycling order
        /// </summary>
        [HttpPost("recycling-orders")]
        [Authorize(Roles = "Factory")]
        public async Task<ActionResult<ApiResponse<WasteRecyclingOrderDto>>> CreateRecyclingOrder([FromBody] CreateRecyclingOrderRequest request)
        {
            try
            {
                var wasteAsset = await _context.WasteAssets.FindAsync(request.WasteAssetId);
                if (wasteAsset == null)
                    return NotFound(ApiResponse<WasteRecyclingOrderDto>.ErrorResponse("Waste asset not found"));

                var recycler = await _context.Recyclers.FindAsync(request.RecyclerId);
                if (recycler == null)
                    return NotFound(ApiResponse<WasteRecyclingOrderDto>.ErrorResponse("Recycler not found"));

                var order = new WasteRecyclingOrder
                {
                    WasteAssetId = request.WasteAssetId,
                    RecyclerId = request.RecyclerId,
                    OrderedByFactoryId = request.OrderedByFactoryId,
                    RecyclerCapabilityId = request.RecyclerCapabilityId,
                    OrderNumber = $"REC-{DateTime.UtcNow:yyyyMMddHHmmss}",
                    QuantityToProcess = request.QuantityToProcess,
                    ProcessingCost = request.ProcessingCost,
                    SpecialInstructions = request.SpecialInstructions,
                    Status = (int)WasteRecyclingOrderStatus.Pending,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _context.WasteRecyclingOrders.Add(order);
                await _context.SaveChangesAsync();

                var dto = await MapToWasteRecyclingOrderDtoAsync(order);
                return Ok(ApiResponse<WasteRecyclingOrderDto>.SuccessResponse(dto, "Recycling order created"));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating recycling order: {ex.Message}");
                return BadRequest(ApiResponse<WasteRecyclingOrderDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get recycling orders
        /// </summary>
        [HttpGet("recycling-orders")]
        public async Task<ActionResult<ApiResponse<List<WasteRecyclingOrderDto>>>> GetRecyclingOrders([FromQuery] long? wasteAssetId, [FromQuery] int? recyclerId)
        {
            try
            {
                var query = _context.WasteRecyclingOrders.AsQueryable();

                if (wasteAssetId.HasValue)
                    query = query.Where(r => r.WasteAssetId == wasteAssetId);

                if (recyclerId.HasValue)
                    query = query.Where(r => r.RecyclerId == recyclerId);

                var orders = await query.ToListAsync();
                var dtos = new List<WasteRecyclingOrderDto>();

                foreach (var order in orders)
                {
                    dtos.Add(await MapToWasteRecyclingOrderDtoAsync(order));
                }

                return Ok(ApiResponse<List<WasteRecyclingOrderDto>>.SuccessResponse(dtos));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting recycling orders: {ex.Message}");
                return BadRequest(ApiResponse<List<WasteRecyclingOrderDto>>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        /// <summary>
        /// Complete a recycling order and calculate impact
        /// </summary>
        [HttpPost("recycling-orders/{id}/complete")]
        [Authorize(Roles = "Factory,Recycler")]
        public async Task<ActionResult<ApiResponse<WasteRecyclingOrderDto>>> CompleteRecyclingOrder(long id, [FromBody] CompleteRecyclingOrderRequest request)
        {
            try
            {
                var order = await _context.WasteRecyclingOrders.FindAsync(id);
                if (order == null)
                    return NotFound(ApiResponse<WasteRecyclingOrderDto>.ErrorResponse("Order not found"));

                var wasteAsset = await _context.WasteAssets.FindAsync(order.WasteAssetId);
                if (wasteAsset == null)
                    return NotFound(ApiResponse<WasteRecyclingOrderDto>.ErrorResponse("Waste asset not found"));

                // Update order details
                order.ProcessingMethodUsed = request.ProcessingMethodUsed;
                order.ProcessDescriptionActual = request.ProcessDescriptionActual;
                order.ActualEfficiencyPercent = request.ActualEfficiencyPercent;
                order.OutputMaterialType = request.OutputMaterialType;
                order.OutputQuantity = request.OutputQuantity;
                order.OutputUnit = request.OutputUnit;
                order.OutputDescription = request.OutputDescription;
                order.BeforePhoto = request.BeforePhoto;
                order.AfterPhoto = request.AfterPhoto;
                order.ProcessProofDocument = request.ProcessProofDocument;
                order.CO2AvoidedKg = request.CO2AvoidedKg;
                order.HasQualityCertification = request.HasQualityCertification;
                order.CertificationType = request.CertificationType;
                order.CertificationNumber = request.CertificationNumber;
                order.Notes = request.Notes;
                order.Status = (int)WasteRecyclingOrderStatus.Completed;
                order.ProcessingCompletedAt = DateTime.UtcNow;
                order.UpdatedAt = DateTime.UtcNow;

                // Calculate and record environmental impact
                var impactRecord = await _impactService.CalculateAndRecordImpactAsync(wasteAsset, order);
                order.ImpactRecordId = impactRecord.Id;
                order.ImpactVerified = true;

                // Update waste asset status
                wasteAsset.Status = (int)WasteAssetStatus.Recycled;
                wasteAsset.UpdatedAt = DateTime.UtcNow;

                _context.WasteRecyclingOrders.Update(order);
                _context.WasteAssets.Update(wasteAsset);
                await _context.SaveChangesAsync();

                var dto = await MapToWasteRecyclingOrderDtoAsync(order);
                return Ok(ApiResponse<WasteRecyclingOrderDto>.SuccessResponse(dto, "Recycling order completed and impact recorded"));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error completing recycling order: {ex.Message}");
                return BadRequest(ApiResponse<WasteRecyclingOrderDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // ════════════════════════════════════════════════════════════════════════════════════════
        // IMPACT & ANALYTICS ENDPOINTS
        // ════════════════════════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Get factory environmental impact summary
        /// </summary>
        [HttpGet("factory-impact/{factoryId}")]
        public async Task<ActionResult<ApiResponse<FactoryImpactSummaryDto>>> GetFactoryImpact(long factoryId)
        {
            try
            {
                var summary = await _impactService.GetFactoryImpactSummaryAsync(factoryId);
                return Ok(ApiResponse<FactoryImpactSummaryDto>.SuccessResponse(summary));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting factory impact: {ex.Message}");
                return BadRequest(ApiResponse<FactoryImpactSummaryDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        /// <summary>
        /// Get platform-wide environmental impact statistics
        /// </summary>
        [HttpGet("platform-impact")]
        [AllowAnonymous]
        public async Task<ActionResult<ApiResponse<PlatformImpactStatsDto>>> GetPlatformImpact()
        {
            try
            {
                var stats = await _impactService.GetPlatformImpactStatsAsync();
                return Ok(ApiResponse<PlatformImpactStatsDto>.SuccessResponse(stats));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting platform impact: {ex.Message}");
                return BadRequest(ApiResponse<PlatformImpactStatsDto>.ErrorResponse($"Error: {ex.Message}"));
            }
        }

        // ════════════════════════════════════════════════════════════════════════════════════════
        // HELPER METHODS
        // ════════════════════════════════════════════════════════════════════════════════════════

        // DISABLED: This method has type mismatches (WasteTypeId is WasteType object not int) 
        // and references non-existent PackagingWasteSubtypeId property
        /*
        private WasteAssetDto MapToWasteAssetDto(WasteAsset asset, Factory factory, WasteType wasteType)
        {
            return new WasteAssetDto
            {
                Id = asset.Id,
                GeneratorFactoryId = asset.GeneratorFactoryId,
                GeneratorFactoryName = factory?.FactoryName,
                GeneratedDate = asset.GeneratedDate,
                WasteTypeId = asset.WasteTypeId,
                WasteTypeName = wasteType?.NameEn,
                Quantity = asset.Quantity,
                Unit = asset.Unit,
                VerifiedComposition = asset.VerifiedComposition,
                EstimatedCO2EquivalentIfLandfilled = asset.EstimatedCO2EquivalentIfLandfilled,
                QualityNotes = asset.QualityNotes,
                PackagingWasteSubtypeId = asset.PackagingWasteSubtypeId,
                CanBeWashed = asset.CanBeWashed,
                IsReusable = asset.IsReusable,
                MaxReuseCount = asset.MaxReuseCount,
                CurrentReuseNumber = asset.CurrentReuseNumber,
                Status = asset.Status,
                StatusName = ((WasteAssetStatus)asset.Status).ToString(),
                CurrentLocationFactoryId = asset.CurrentLocationFactoryId,
                IsPublic = asset.IsPublic,
                ListingPrice = asset.ListingPrice,
                PublicDescription = asset.PublicDescription,
                ListingExpiredAt = asset.ListingExpiredAt,
                Views = asset.Views,
                CreatedAt = asset.CreatedAt,
                UpdatedAt = asset.UpdatedAt
            };
        }
        */

        private WasteAssetOfferDto MapToWasteAssetOfferDto(WasteAssetOffer offer, Factory buyer, WasteAsset asset)
        {
            return new WasteAssetOfferDto
            {
                Id = offer.Id,
                WasteAssetId = offer.WasteAssetId,
                BuyerFactoryId = offer.BuyerFactoryId,
                BuyerFactoryName = buyer?.FactoryName,
                OfferNumber = offer.OfferNumber,
                OfferedQuantity = offer.OfferedQuantity,
                OfferedPricePerUnit = offer.OfferedPricePerUnit,
                TotalOfferedPrice = offer.TotalOfferedPrice,
                Message = offer.Message,
                Status = offer.Status,
                StatusName = ((WasteAssetOfferStatus)offer.Status).ToString(),
                AcceptedAt = offer.AcceptedAt,
                RejectedAt = offer.RejectedAt,
                RejectionReason = offer.RejectionReason,
                IntendedUseType = offer.IntendedUseType,
                IntendedUseDescription = offer.IntendedUseDescription,
                CreatedAt = offer.CreatedAt,
                UpdatedAt = offer.UpdatedAt
            };
        }

        private async Task<WasteRecyclingOrderDto> MapToWasteRecyclingOrderDtoAsync(WasteRecyclingOrder order)
        {
            var recycler = await _context.Recyclers.FindAsync(order.RecyclerId);
            var factory = await _context.Factories.FindAsync(order.OrderedByFactoryId);

            return new WasteRecyclingOrderDto
            {
                Id = order.Id,
                WasteAssetId = order.WasteAssetId,
                RecyclerId = order.RecyclerId,
                RecyclerName = recycler?.CompanyName,
                OrderedByFactoryId = order.OrderedByFactoryId,
                OrderedByFactoryName = factory?.FactoryName,
                RecyclerCapabilityId = order.RecyclerCapabilityId,
                OrderNumber = order.OrderNumber,
                QuantityToProcess = order.QuantityToProcess,
                Unit = order.Unit,
                ProcessingCost = order.ProcessingCost,
                SpecialInstructions = order.SpecialInstructions,
                Status = order.Status,
                StatusName = ((WasteRecyclingOrderStatus)order.Status).ToString(),
                CreatedAt = order.CreatedAt,
                AcceptedAt = order.AcceptedAt,
                ProcessingStartedAt = order.ProcessingStartedAt,
                ProcessingCompletedAt = order.ProcessingCompletedAt,
                ProcessingMethodUsed = order.ProcessingMethodUsed,
                ProcessDescriptionActual = order.ProcessDescriptionActual,
                ActualEfficiencyPercent = order.ActualEfficiencyPercent,
                OutputMaterialType = order.OutputMaterialType,
                OutputQuantity = order.OutputQuantity,
                OutputUnit = order.OutputUnit,
                OutputDescription = order.OutputDescription,
                CO2AvoidedKg = order.CO2AvoidedKg,
                ImpactVerified = order.ImpactVerified,
                HasQualityCertification = order.HasQualityCertification,
                CertificationType = order.CertificationType,
                CertificationNumber = order.CertificationNumber,
                Notes = order.Notes,
                UpdatedAt = order.UpdatedAt
            };
        }
    }
}
