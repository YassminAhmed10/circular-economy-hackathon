namespace shadowfactory.Models.Enums
{
    /// <summary>
    /// Primary waste classification types in circular economy
    /// </summary>
    public enum WasteType
    {
        Plastic = 1,
        Metal = 2,
        Paper = 3,
        Glass = 4,
        Packaging = 5,
        Electronic = 6,
        Textile = 7,
        Chemical = 8,
        Organic = 9,
        Wood = 10
    }

    /// <summary>
    /// Detailed waste subtypes for granular classification
    /// Enables better matching with recycler capabilities
    /// </summary>
    public enum WasteSubType
    {
        // Plastic Subtypes
        PET = 101,
        HDPE = 102,
        PVC = 103,
        LDPE = 104,
        PP = 105,
        PS = 106,
        MixedPlastic = 107,

        // Metal Subtypes
        Aluminum = 201,
        Steel = 202,
        Copper = 203,
        Iron = 204,
        MixedMetal = 205,
        Brass = 206,

        // Paper Subtypes
        Cardboard = 301,
        OfficePaper = 302,
        Newspaper = 303,
        MixedPaper = 304,
        Tissue = 305,

        // Glass Subtypes
        ClearGlass = 401,
        GreenGlass = 402,
        BrownGlass = 403,
        MixedGlass = 404,

        // Packaging Subtypes
        PlasticPackaging = 501,
        PaperPackaging = 502,
        FoamPackaging = 503,
        GlassPackaging = 504,
        MetalPackaging = 505,
        MixedPackaging = 506,

        // Electronic Subtypes
        EWaste_Computers = 601,
        EWaste_Phones = 602,
        EWaste_Appliances = 603,
        EWaste_Batteries = 604,
        EWaste_Mixed = 605,

        // Textile Subtypes
        Cotton = 701,
        Polyester = 702,
        Wool = 703,
        Mixed = 704,

        // Chemical Subtypes
        NonHazardousChem = 801,
        HazardousChem = 802,
        SolventsAndOils = 803,

        // Organic Subtypes
        FoodWaste = 901,
        GardenWaste = 902,
        WoodWaste = 903,
        MixedOrganic = 904
    }

    /// <summary>
    /// Contamination levels for waste materials
    /// Affects recyclability and matching with processors
    /// </summary>
    public enum ContaminationLevel
    {
        Low = 1,      // >95% pure, minimal contamination
        Medium = 2,   // 80-95% pure, moderate contamination
        High = 3      // <80% pure, significant contamination
    }

    /// <summary>
    /// Recyclability classification
    /// Determines how waste can be processed or reused
    /// </summary>
    public enum RecyclabilityType
    {
        DirectUse = 1,    // Can be used directly without processing
        Recyclable = 2,   // Requires processing/transformation to be reused
        Reusable = 3      // Can be reused multiple times as-is
    }
}
