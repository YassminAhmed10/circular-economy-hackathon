using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace shadowfactory.Models.DTOs
{
    // ════════════════════════════════════════════════════════════════════════════════════════
    // CREATE/UPDATE REQUESTS
    // ════════════════════════════════════════════════════════════════════════════════════════

    public class CreateWasteAssetRequest
    {
        [Required]
        public long GeneratorFactoryId { get; set; }

        [Required]
        public int WasteTypeId { get; set; }

        [Required]
        public decimal Quantity { get; set; }

        [Required]
        [StringLength(20)]
        public string Unit { get; set; } = "kg";

        public int? PackagingWasteSubtypeId { get; set; }

        public bool CanBeWashed { get; set; }

        public bool IsReusable { get; set; }

        [StringLength(500)]
        public string QualityNotes { get; set; }

        public decimal EstimatedCO2EquivalentIfLandfilled { get; set; } = 0;
    }

    public class UpdateWasteAssetRequest
    {
        public int? Status { get; set; }

        public long? CurrentLocationFactoryId { get; set; }

        public bool? IsPublic { get; set; }

        public decimal? ListingPrice { get; set; }

        [StringLength(500)]
        public string PublicDescription { get; set; }
    }

    public class CreateWasteAssetOfferRequest
    {
        [Required]
        public long WasteAssetId { get; set; }

        [Required]
        public long BuyerFactoryId { get; set; }

        [Required]
        public decimal OfferedQuantity { get; set; }

        [Required]
        public decimal OfferedPricePerUnit { get; set; }

        [StringLength(500)]
        public string Message { get; set; }

        public int? IntendedUseType { get; set; }

        [StringLength(500)]
        public string IntendedUseDescription { get; set; }
    }

    public class AcceptWasteAssetOfferRequest
    {
        [Required]
        public long OfferId { get; set; }

        public DateTime? DeliveryDate { get; set; }
    }

    public class RejectWasteAssetOfferRequest
    {
        [Required]
        public long OfferId { get; set; }

        [StringLength(500)]
        public string RejectionReason { get; set; }
    }

    public class CreateRecyclingOrderRequest
    {
        [Required]
        public long WasteAssetId { get; set; }

        [Required]
        public int RecyclerId { get; set; }

        [Required]
        public long OrderedByFactoryId { get; set; }

        public int? RecyclerCapabilityId { get; set; }

        [Required]
        public decimal QuantityToProcess { get; set; }

        [Required]
        public decimal ProcessingCost { get; set; }

        [StringLength(500)]
        public string SpecialInstructions { get; set; }
    }

    public class CompleteRecyclingOrderRequest
    {
        [Required]
        public long OrderId { get; set; }

        [StringLength(100)]
        public string ProcessingMethodUsed { get; set; }

        [StringLength(500)]
        public string ProcessDescriptionActual { get; set; }

        public decimal ActualEfficiencyPercent { get; set; }

        [StringLength(100)]
        public string OutputMaterialType { get; set; }

        public decimal OutputQuantity { get; set; }

        [StringLength(20)]
        public string OutputUnit { get; set; }

        [StringLength(500)]
        public string OutputDescription { get; set; }

        [StringLength(500)]
        public string BeforePhoto { get; set; }

        [StringLength(500)]
        public string AfterPhoto { get; set; }

        [StringLength(500)]
        public string ProcessProofDocument { get; set; }

        public decimal CO2AvoidedKg { get; set; }

        public bool HasQualityCertification { get; set; }

        [StringLength(100)]
        public string CertificationType { get; set; }

        [StringLength(100)]
        public string CertificationNumber { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }
    }

    public class AddWasteJourneyEntryRequest
    {
        [Required]
        public long WasteAssetId { get; set; }

        [Required]
        public int Status { get; set; }

        public long? ResponsibleFactoryId { get; set; }

        [StringLength(255)]
        public string ResponsiblePersonName { get; set; }

        [StringLength(500)]
        public string ProofUrl { get; set; }

        [StringLength(50)]
        public string ProofType { get; set; }

        [StringLength(100)]
        public string LocationCoordinates { get; set; }

        [StringLength(255)]
        public string LocationName { get; set; }

        [StringLength(1000)]
        public string Notes { get; set; }

        [StringLength(50)]
        public string TransportMethod { get; set; }

        public bool QualityCheckPassed { get; set; } = true;

        [StringLength(500)]
        public string QualityIssues { get; set; }
    }

    // ════════════════════════════════════════════════════════════════════════════════════════
    // RESPONSE DTOs
    // ════════════════════════════════════════════════════════════════════════════════════════

    public class WasteAssetDto
    {
        public long Id { get; set; }
        public long GeneratorFactoryId { get; set; }
        public string GeneratorFactoryName { get; set; }
        public DateTime GeneratedDate { get; set; }
        public int WasteTypeId { get; set; }
        public string WasteTypeName { get; set; }
        public decimal Quantity { get; set; }
        public string Unit { get; set; }
        public bool VerifiedComposition { get; set; }
        public decimal EstimatedCO2EquivalentIfLandfilled { get; set; }
        public string QualityNotes { get; set; }
        public int? PackagingWasteSubtypeId { get; set; }
        public string PackagingSubtypeName { get; set; }
        public bool CanBeWashed { get; set; }
        public bool IsReusable { get; set; }
        public int MaxReuseCount { get; set; }
        public int CurrentReuseNumber { get; set; }
        public int Status { get; set; }
        public string StatusName { get; set; }
        public long? CurrentLocationFactoryId { get; set; }
        public string CurrentLocationName { get; set; }
        public DateTime? AcquiredDate { get; set; }
        public bool IsPublic { get; set; }
        public decimal? ListingPrice { get; set; }
        public string PublicDescription { get; set; }
        public DateTime? ListingExpiredAt { get; set; }
        public int Views { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class WasteAssetOfferDto
    {
        public long Id { get; set; }
        public long WasteAssetId { get; set; }
        public long BuyerFactoryId { get; set; }
        public string BuyerFactoryName { get; set; }
        public string OfferNumber { get; set; }
        public decimal OfferedQuantity { get; set; }
        public decimal OfferedPricePerUnit { get; set; }
        public decimal TotalOfferedPrice { get; set; }
        public string Message { get; set; }
        public int Status { get; set; }
        public string StatusName { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        public string RejectionReason { get; set; }
        public DateTime? CompletedDate { get; set; }
        public int? IntendedUseType { get; set; }
        public string IntendedUseDescription { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class WasteRecyclingOrderDto
    {
        public long Id { get; set; }
        public long WasteAssetId { get; set; }
        public int RecyclerId { get; set; }
        public string RecyclerName { get; set; }
        public long OrderedByFactoryId { get; set; }
        public string OrderedByFactoryName { get; set; }
        public int? RecyclerCapabilityId { get; set; }
        public string OrderNumber { get; set; }
        public decimal QuantityToProcess { get; set; }
        public string Unit { get; set; }
        public decimal ProcessingCost { get; set; }
        public string SpecialInstructions { get; set; }
        public int Status { get; set; }
        public string StatusName { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? AcceptedAt { get; set; }
        public DateTime? ProcessingStartedAt { get; set; }
        public DateTime? ProcessingCompletedAt { get; set; }
        public string ProcessingMethodUsed { get; set; }
        public string ProcessDescriptionActual { get; set; }
        public decimal ActualEfficiencyPercent { get; set; }
        public string OutputMaterialType { get; set; }
        public decimal OutputQuantity { get; set; }
        public string OutputUnit { get; set; }
        public string OutputDescription { get; set; }
        public decimal CO2AvoidedKg { get; set; }
        public bool ImpactVerified { get; set; }
        public bool HasQualityCertification { get; set; }
        public string CertificationType { get; set; }
        public string CertificationNumber { get; set; }
        public string Notes { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class WasteJourneyEntryDto
    {
        public long Id { get; set; }
        public long WasteAssetId { get; set; }
        public int Status { get; set; }
        public string StatusName { get; set; }
        public DateTime Timestamp { get; set; }
        public long? ResponsibleFactoryId { get; set; }
        public string ResponsibleFactoryName { get; set; }
        public string ResponsiblePersonName { get; set; }
        public string ProofUrl { get; set; }
        public string ProofType { get; set; }
        public string LocationCoordinates { get; set; }
        public string LocationName { get; set; }
        public string Notes { get; set; }
        public string TransportMethod { get; set; }
        public bool QualityCheckPassed { get; set; }
        public string QualityIssues { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class EnvironmentalImpactRecordDto
    {
        public long Id { get; set; }
        public long? WasteAssetId { get; set; }
        public decimal BaselineCO2EquivalentKg { get; set; }
        public decimal RecyclingCO2AvoidedKg { get; set; }
        public decimal NetCO2AvoidedKg { get; set; }
        public decimal WaterSavedLiters { get; set; }
        public decimal EnergySavedKwh { get; set; }
        public decimal LandfillDiversionKg { get; set; }
        public decimal MaterialRecoveredKg { get; set; }
        public int ItemsReuseCount { get; set; }
        public DateTime CalculatedAt { get; set; }
        public string CalculationMethodVersion { get; set; }
    }

    public class FactoryImpactSummaryDto
    {
        public long FactoryId { get; set; }
        public string FactoryName { get; set; }
        public int TotalWasteAssetsProcessed { get; set; }
        public decimal TotalCO2Avoided { get; set; }
        public decimal TotalWaterSaved { get; set; }
        public decimal TotalEnergySaved { get; set; }
        public decimal TotalMaterialRecovered { get; set; }
        public int TotalItemsReused { get; set; }
        public DateTime LastUpdated { get; set; }
    }

    public class PlatformImpactStatsDto
    {
        public int TotalWasteAssets { get; set; }
        public int TotalAssetsRecycled { get; set; }
        public int TotalAssetsReused { get; set; }
        public decimal TotalCO2Avoided { get; set; }
        public decimal TotalWaterSaved { get; set; }
        public decimal TotalEnergySaved { get; set; }
        public decimal TotalMaterialRecovered { get; set; }
        public int TotalItemsReused { get; set; }
        public int ActiveFactories { get; set; }
        public int ActiveRecyclers { get; set; }
        public DateTime CalculatedAt { get; set; }
    }
}
