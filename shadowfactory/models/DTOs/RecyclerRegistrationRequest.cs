namespace shadowfactory.Models.DTOs
{
    public class RecyclerRegistrationRequest
    {
        public string CompanyName { get; set; }
        public string CompanyNameAr { get; set; }
        public string Description { get; set; }
        public string DescriptionAr { get; set; }
        public string ContactEmail { get; set; }
        public string ContactPhone { get; set; }
        public string WhatsappNumber { get; set; }
        public string Location { get; set; }
        public string LocationAr { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string LogoUrl { get; set; }
        public string CertificationNumber { get; set; }
        public List<RecyclerCapabilityRequest> Capabilities { get; set; }
    }

    public class RecyclerCapabilityRequest
    {
        public int PackagingWasteSubtypeId { get; set; }
        public string OutputMaterialType { get; set; }
        public string OutputMaterialTypeAr { get; set; }
        public decimal CapacityPerMonth { get; set; }
        public string CapacityUnit { get; set; }
        public decimal? CostPerUnit { get; set; }
        public int LeadTime { get; set; }
        public string ProcessDescription { get; set; }
    }
}
