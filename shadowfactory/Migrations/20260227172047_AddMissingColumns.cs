using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    public partial class AddMissingColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ===== FACTORIES TABLE - Add missing columns =====
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Email')
                BEGIN
                    ALTER TABLE Factories ADD Email NVARCHAR(255) NOT NULL DEFAULT ''
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'UpdatedAt')
                BEGIN
                    ALTER TABLE Factories ADD UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Website')
                BEGIN
                    ALTER TABLE Factories ADD Website NVARCHAR(500) NULL
                END
            ");

            // ===== FACTORIES - New multilingual fields =====
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'DescriptionAr')
                BEGIN
                    ALTER TABLE Factories ADD DescriptionAr NVARCHAR(1000) NULL
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'DescriptionEn')
                BEGIN
                    ALTER TABLE Factories ADD DescriptionEn NVARCHAR(1000) NULL
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Latitude')
                BEGIN
                    ALTER TABLE Factories ADD Latitude DECIMAL(10,8) NULL
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Longitude')
                BEGIN
                    ALTER TABLE Factories ADD Longitude DECIMAL(11,8) NULL
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'Rating')
                BEGIN
                    ALTER TABLE Factories ADD Rating DECIMAL(3,2) NULL
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' AND COLUMN_NAME = 'TotalReviews')
                BEGIN
                    ALTER TABLE Factories ADD TotalReviews INT NULL
                END
            ");

            // ===== WASTELISTINGS TABLE - Add new fields =====
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'WasteListings' AND COLUMN_NAME = 'Badge')
                BEGIN
                    ALTER TABLE WasteListings ADD Badge NVARCHAR(50) NULL
                END
            ");

            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'WasteListings' AND COLUMN_NAME = 'CompanyNameAr')
                BEGIN
                    ALTER TABLE WasteListings ADD CompanyNameAr NVARCHAR(200) NULL
                END
            ");

            // ... add all other WasteListings columns similarly ...

            // ===== VERIFICATIONTOKENS TABLE =====
            migrationBuilder.Sql(@"
                IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'VerificationTokens' AND COLUMN_NAME = 'UpdatedAt')
                BEGIN
                    ALTER TABLE VerificationTokens ADD UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
                END
            ");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // We don't need to do anything in Down since we're only adding columns
            // This migration is just to sync EF with existing database
        }
    }
}