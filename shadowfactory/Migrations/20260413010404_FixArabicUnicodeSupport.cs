using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class FixArabicUnicodeSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // =====================================================
            // 1. FIX COLUMN TYPES TO SUPPORT UNICODE
            // =====================================================
            
            // Fix WasteListings table columns
            migrationBuilder.Sql(@"
                -- Alter WasteListings table columns to nvarchar
                ALTER TABLE WasteListings ALTER COLUMN [Type] NVARCHAR(100) NOT NULL;
                ALTER TABLE WasteListings ALTER COLUMN TypeEn NVARCHAR(100) NOT NULL;
                ALTER TABLE WasteListings ALTER COLUMN TitleAr NVARCHAR(200) NULL;
                ALTER TABLE WasteListings ALTER COLUMN TitleEn NVARCHAR(200) NULL;
                ALTER TABLE WasteListings ALTER COLUMN DescriptionAr NVARCHAR(1000) NULL;
                ALTER TABLE WasteListings ALTER COLUMN DescriptionEn NVARCHAR(1000) NULL;
                ALTER TABLE WasteListings ALTER COLUMN CompanyNameAr NVARCHAR(200) NULL;
                ALTER TABLE WasteListings ALTER COLUMN CompanyNameEn NVARCHAR(200) NULL;
                ALTER TABLE WasteListings ALTER COLUMN FactoryName NVARCHAR(200) NOT NULL;
                ALTER TABLE WasteListings ALTER COLUMN LocationAr NVARCHAR(100) NULL;
                ALTER TABLE WasteListings ALTER COLUMN LocationEn NVARCHAR(100) NULL;
                ALTER TABLE WasteListings ALTER COLUMN Category NVARCHAR(50) NOT NULL;
                ALTER TABLE WasteListings ALTER COLUMN Status NVARCHAR(20) NOT NULL;
                ALTER TABLE WasteListings ALTER COLUMN Badge NVARCHAR(50) NULL;
                ALTER TABLE WasteListings ALTER COLUMN SellerJoined NVARCHAR(20) NULL;
            ");

            // Fix Orders table columns
            migrationBuilder.Sql(@"
                -- Alter Orders table columns to nvarchar
                ALTER TABLE Orders ALTER COLUMN WasteType NVARCHAR(100) NOT NULL;
                ALTER TABLE Orders ALTER COLUMN WasteCategory NVARCHAR(50) NOT NULL;
                ALTER TABLE Orders ALTER COLUMN BuyerName NVARCHAR(100) NOT NULL;
                ALTER TABLE Orders ALTER COLUMN SellerName NVARCHAR(100) NOT NULL;
                ALTER TABLE Orders ALTER COLUMN [Status] NVARCHAR(50) NOT NULL;
                ALTER TABLE Orders ALTER COLUMN RecipientName NVARCHAR(100) NULL;
                ALTER TABLE Orders ALTER COLUMN DeliveryAddress NVARCHAR(500) NULL;
                ALTER TABLE Orders ALTER COLUMN Governorate NVARCHAR(100) NULL;
                ALTER TABLE Orders ALTER COLUMN Notes NVARCHAR(500) NULL;
                ALTER TABLE Orders ALTER COLUMN OrderStatus NVARCHAR(50) NULL;
                ALTER TABLE Orders ALTER COLUMN PaymentStatus NVARCHAR(50) NULL;
                ALTER TABLE Orders ALTER COLUMN RecyclerStatus NVARCHAR(50) NULL;
                ALTER TABLE Orders ALTER COLUMN DeliveryMethod NVARCHAR(50) NULL;
                ALTER TABLE Orders ALTER COLUMN PaymentMethod NVARCHAR(50) NULL;
                ALTER TABLE Orders ALTER COLUMN OrderType NVARCHAR(50) NULL;
            ");

            // Fix Factories table columns
            migrationBuilder.Sql(@"
                -- Alter Factories table columns to nvarchar
                ALTER TABLE Factories ALTER COLUMN FactoryName NVARCHAR(255) NOT NULL;
                ALTER TABLE Factories ALTER COLUMN FactoryNameEn NVARCHAR(255) NOT NULL;
                ALTER TABLE Factories ALTER COLUMN IndustryType NVARCHAR(100) NOT NULL;
                ALTER TABLE Factories ALTER COLUMN [Location] NVARCHAR(100) NOT NULL;
                ALTER TABLE Factories ALTER COLUMN Address NVARCHAR(500) NOT NULL;
                ALTER TABLE Factories ALTER COLUMN OwnerName NVARCHAR(255) NOT NULL;
                ALTER TABLE Factories ALTER COLUMN [Status] NVARCHAR(50) NULL;
                ALTER TABLE Factories ALTER COLUMN DescriptionAr NVARCHAR(1000) NULL;
                ALTER TABLE Factories ALTER COLUMN DescriptionEn NVARCHAR(1000) NULL;
            ");

            // Fix Users table columns
            migrationBuilder.Sql(@"
                -- Alter Users table columns to nvarchar
                ALTER TABLE Users ALTER COLUMN FullName NVARCHAR(255) NOT NULL;
                ALTER TABLE Users ALTER COLUMN [Role] NVARCHAR(50) NOT NULL;
            ");

            // =====================================================
            // 2. FIX CORRUPTED DATA USING ENGLISH FALLBACKS
            // =====================================================
            
            migrationBuilder.Sql(@"
                -- Fix WasteListings: replace question marks with English fallbacks
                UPDATE WasteListings
                SET 
                    TitleAr = CASE 
                        WHEN TitleAr LIKE '%?%' OR TitleAr IS NULL THEN ISNULL(TitleEn, TypeEn)
                        ELSE TitleAr
                    END,
                    DescriptionAr = CASE 
                        WHEN DescriptionAr LIKE '%?%' OR DescriptionAr IS NULL THEN ISNULL(DescriptionEn, 'No description available')
                        ELSE DescriptionAr
                    END,
                    CompanyNameAr = CASE 
                        WHEN CompanyNameAr LIKE '%?%' OR CompanyNameAr IS NULL THEN ISNULL(CompanyNameEn, FactoryName)
                        ELSE CompanyNameAr
                    END,
                    LocationAr = CASE 
                        WHEN LocationAr LIKE '%?%' OR LocationAr IS NULL THEN ISNULL(LocationEn, 'Egypt')
                        ELSE LocationAr
                    END
                WHERE TitleAr LIKE '%?%' OR DescriptionAr LIKE '%?%' OR CompanyNameAr LIKE '%?%' OR LocationAr LIKE '%?%';
            ");

            migrationBuilder.Sql(@"
                -- Fix Orders: replace question marks with data from WasteListings
                UPDATE o
                SET 
                    WasteType = CASE 
                        WHEN o.WasteType LIKE '%?%' OR o.WasteType IS NULL OR o.WasteType = 'packaging'
                        THEN ISNULL(w.TypeEn, 'Waste Material')
                        ELSE o.WasteType
                    END,
                    SellerName = CASE 
                        WHEN o.SellerName LIKE '%?%' OR o.SellerName IS NULL
                        THEN ISNULL(w.CompanyNameEn, ISNULL(w.FactoryName, 'Seller'))
                        ELSE o.SellerName
                    END,
                    WasteCategory = CASE 
                        WHEN o.WasteCategory LIKE '%?%' OR o.WasteCategory IS NULL
                        THEN ISNULL(w.Category, 'General')
                        ELSE o.WasteCategory
                    END
                FROM Orders o
                LEFT JOIN WasteListings w ON o.WasteListingId = w.Id
                WHERE o.WasteType LIKE '%?%' OR o.SellerName LIKE '%?%' OR o.WasteCategory LIKE '%?%';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Revert columns back to varchar if needed (optional)
            migrationBuilder.Sql(@"
                ALTER TABLE WasteListings ALTER COLUMN [Type] VARCHAR(100);
                ALTER TABLE Orders ALTER COLUMN WasteType VARCHAR(100);
                ALTER TABLE Factories ALTER COLUMN FactoryName VARCHAR(255);
                ALTER TABLE Users ALTER COLUMN FullName VARCHAR(255);
            ");
        }
    }
}