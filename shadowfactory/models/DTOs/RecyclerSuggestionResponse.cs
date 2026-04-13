namespace shadowfactory.Models.DTOs
{
    public class RecyclerSuggestionResponse
    {
        public int RecyclerId { get; set; }
        public string CompanyName { get; set; }
        public string CompanyNameAr { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string WhatsappNumber { get; set; }
        public string Location { get; set; }
        public string LocationAr { get; set; }
        public string LogoUrl { get; set; }
        public decimal Rating { get; set; }
        public bool IsVerified { get; set; }
        public decimal MatchScore { get; set; }
        public string ReasonCode { get; set; }
        
        // Output capabilities
        public List<RecyclerCapabilityResponse> OutputCapabilities { get; set; }
        
        // Estimated conversion
        public decimal? EstimatedOutputAmount { get; set; }
        public string EstimatedOutputUnit { get; set; }
        public string EstimatedOutputMaterial { get; set; }
    }

    public class RecyclerCapabilityResponse
    {
        public int CapabilityId { get; set; }
        public string OutputMaterialType { get; set; }
        public string OutputMaterialTypeAr { get; set; }
        public decimal CapacityPerMonth { get; set; }
        public string CapacityUnit { get; set; }
        public decimal? CostPerUnit { get; set; }
        public int LeadTime { get; set; }
        public string ProcessDescription { get; set; }
    }
}
