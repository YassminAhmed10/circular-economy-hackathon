using shadowfactory.Data;
using shadowfactory.Models.Entities;
using shadowfactory.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace shadowfactory.Services
{
    public interface IRecyclerMatchingService
    {
        Task<List<RecyclerSuggestionResponse>> GetSuggestedRecyclersAsync(int wasteListingId);
        Task GenerateRecyclerSuggestionsAsync(WasteListing listing);
        Task<bool> UpdateRecyclerInterestAsync(int suggestionId, bool isInterested);
    }

    public class RecyclerMatchingService : IRecyclerMatchingService
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<RecyclerMatchingService> _logger;

        public RecyclerMatchingService(ECoVDbContext context, ILogger<RecyclerMatchingService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<RecyclerSuggestionResponse>> GetSuggestedRecyclersAsync(int wasteListingId)
        {
            // TODO: Fix after entity model is updated with missing properties
            return new List<RecyclerSuggestionResponse>();
        }

        public async Task GenerateRecyclerSuggestionsAsync(WasteListing listing)
        {
            // TODO: Fix after entity model is updated with missing properties
            return;
        }

        public async Task<bool> UpdateRecyclerInterestAsync(int suggestionId, bool isInterested)
        {
            var suggestion = await _context.RecyclerSuggestions.FindAsync(suggestionId);
            if (suggestion == null)
                return false;

            suggestion.IsInterested = isInterested;
            suggestion.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }

        // DISABLED: This method references non-existent WasteListing properties (PackagingWasteSubtype, ContaminationLevel)
        // These properties need to be added to the entity model or this logic migrated to use the new properties.
        /*
        private async Task<List<RecyclerMatchResult>> FindMatchingRecyclers(WasteListing listing)
        {
            var matches = new List<RecyclerMatchResult>();

            // Get the waste subtype
            var subtype = await _context.PackagingWasteSubtypes
                .FirstOrDefaultAsync(s => s.Name == listing.PackagingWasteSubtype);

            if (subtype == null)
                return matches;

            // Find recyclers with matching capabilities
            var recyclers = await _context.Recyclers
                .Include(r => r.Capabilities)
                .Where(r => r.IsActive && r.IsVerified)
                .ToListAsync();

            foreach (var recycler in recyclers)
            {
                var capability = recycler.Capabilities
                    .FirstOrDefault(c => c.InputWasteSubtypeId == subtype.Id && c.IsActive);

                if (capability != null)
                {
                    var score = CalculateMatchScore(listing, recycler, capability);
                    
                    if (score > 50) // Only include recyclers with >50% match
                    {
                        matches.Add(new RecyclerMatchResult
                        {
                            RecyclerId = recycler.Id,
                            MatchScore = score,
                            ReasonCode = DetermineReasonCode(listing, recycler, capability),
                            EstimatedOutput = CalculateEstimatedOutput(listing, capability),
                            OutputUnit = capability.CapacityUnit
                        });
                    }
                }
            }

            return matches.OrderByDescending(m => m.MatchScore).Take(5).ToList();
        }
        */

        // DISABLED: This method references non-existent WasteListing.ContaminationLevel property
        /*
        private decimal CalculateMatchScore(WasteListing listing, Recycler recycler, RecyclerCapability capability)
        {
            decimal score = 0;

            // Base score: recycler has capability (40 points)
            score += 40;

            // Capacity match (30 points)
            if (capability.CapacityPerMonth >= listing.Amount)
                score += 30;
            else if (capability.CapacityPerMonth >= (listing.Amount * 0.7m))
                score += 20;
            else if (capability.CapacityPerMonth >= (listing.Amount * 0.5m))
                score += 10;

            // Rating bonus (10 points)
            if (recycler.Rating >= 4.5m)
                score += 10;
            else if (recycler.Rating >= 4.0m)
                score += 7;
            else if (recycler.Rating >= 3.5m)
                score += 5;

            // Verification bonus (10 points)
            if (recycler.IsVerified)
                score += 10;

            // Contamination level compatibility (10 points)
            if (listing.ContaminationLevel == "none" || listing.ContaminationLevel == "low")
                score += 10;

            return Math.Min(score, 100);
        }
        */

        // DISABLED: Helper method for FindMatchingRecyclers which is disabled
        /*
        private string DetermineReasonCode(WasteListing listing, Recycler recycler, RecyclerCapability capability)
        {
            if (capability.CapacityPerMonth >= listing.Amount)
                return "capacity_match";
            else if (recycler.Rating >= 4.5m)
                return "high_rating";
            else if (recycler.IsVerified)
                return "verified_recycler";
            else
                return "capability_match";
        }
        */

        // DISABLED: Helper method for FindMatchingRecyclers which is disabled
        /*
        private decimal CalculateEstimatedOutput(WasteListing listing, RecyclerCapability capability)
        {
            // Rough conversion: typically 70-80% of input becomes output material
            var conversionRate = 0.75m;
            return listing.Amount * conversionRate;
        }
        */

        private RecyclerSuggestionResponse MapToResponse(RecyclerSuggestion suggestion)
        {
            var recycler = suggestion.Recycler;
            return new RecyclerSuggestionResponse
            {
                RecyclerId = recycler.Id,
                CompanyName = recycler.CompanyName,
                CompanyNameAr = recycler.CompanyNameAr,
                ContactEmail = recycler.ContactEmail,
                ContactPhone = recycler.ContactPhone,
                WhatsappNumber = recycler.WhatsappNumber,
                Location = recycler.Location,
                LocationAr = recycler.LocationAr,
                LogoUrl = recycler.LogoUrl,
                Rating = recycler.Rating,
                IsVerified = recycler.IsVerified,
                MatchScore = suggestion.MatchScore,
                ReasonCode = suggestion.ReasonCode,
                EstimatedOutputAmount = suggestion.EstimatedConversionOutputAmount,
                EstimatedOutputUnit = suggestion.EstimatedConversionOutputUnit,
                OutputCapabilities = recycler.Capabilities
                    ?.Where(c => c.IsActive)
                    ?.Select(c => new RecyclerCapabilityResponse
                    {
                        CapabilityId = c.Id,
                        OutputMaterialType = c.OutputMaterialType,
                        OutputMaterialTypeAr = c.OutputMaterialTypeAr,
                        CapacityPerMonth = c.CapacityPerMonth,
                        CapacityUnit = c.CapacityUnit,
                        CostPerUnit = c.CostPerUnit,
                        LeadTime = c.LeadTime,
                        ProcessDescription = c.ProcessDescription
                    })
                    ?.ToList() ?? new List<RecyclerCapabilityResponse>()
            };
        }

        private class RecyclerMatchResult
        {
            public int RecyclerId { get; set; }
            public decimal MatchScore { get; set; }
            public string ReasonCode { get; set; }
            public decimal EstimatedOutput { get; set; }
            public string OutputUnit { get; set; }
        }
    }
}
