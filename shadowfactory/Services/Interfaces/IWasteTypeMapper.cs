using shadowfactory.Models.Entities;

namespace shadowfactory.Services.Interfaces
{
    public interface IWasteTypeMapper
    {
        WasteTypeEnum Map(string? wasteType);
    }
}