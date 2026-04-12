using System;
using shadowfactory.Models.Entities;
using shadowfactory.Services.Interfaces;

namespace shadowfactory.Services
{
    public class WasteTypeMapper : IWasteTypeMapper
    {
        public WasteTypeEnum Map(string? wasteType)
        {
            if (string.IsNullOrWhiteSpace(wasteType))
                return WasteTypeEnum.Mixed;

            var t = wasteType.Trim().ToLowerInvariant();

            return t switch
            {
                "plastic" or "plasticindustrial" or "packagingplastic" or "packaging_plastic" => WasteTypeEnum.Plastic,
                "metal" or "metals" => WasteTypeEnum.Metal,
                "paper" or "cardboard" or "paperboard" => WasteTypeEnum.Paper,
                "glass" => WasteTypeEnum.Glass,
                "packagingpaper" or "packaging_paper" => WasteTypeEnum.PackagingPaper,
                "packagingfoam" or "foam" or "packaging_foam" => WasteTypeEnum.PackagingFoam,
                "mixed" => WasteTypeEnum.Mixed,
                _ => WasteTypeEnum.Mixed
            };
        }
    }
}