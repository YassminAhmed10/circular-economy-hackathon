using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class AddPackagingWasteColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ContaminationLevel",
                schema: "dbo",
                table: "WasteListings",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FoodContactSuitability",
                schema: "dbo",
                table: "WasteListings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "PackagingWasteSubtype",
                schema: "dbo",
                table: "WasteListings",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecyclabilityOption",
                schema: "dbo",
                table: "WasteListings",
                type: "nvarchar(150)",
                maxLength: 150,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SourceRecyclerId",
                schema: "dbo",
                table: "WasteListings",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PackagingWasteSubtypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackagingWasteSubtypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Recyclers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    CompanyName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CompanyNameAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DescriptionAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactEmail = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WhatsappNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Location = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    LocationAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CertificationNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Rating = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalConversions = table.Column<int>(type: "int", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recyclers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RecyclerCapabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecyclerId = table.Column<int>(type: "int", nullable: false),
                    InputWasteSubtypeId = table.Column<int>(type: "int", nullable: false),
                    OutputMaterialType = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    OutputMaterialTypeAr = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CapacityPerMonth = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    CapacityUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CostPerUnit = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    LeadTime = table.Column<int>(type: "int", nullable: false),
                    ProcessDescription = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecyclerCapabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecyclerCapabilities_PackagingWasteSubtypes_InputWasteSubtypeId",
                        column: x => x.InputWasteSubtypeId,
                        principalTable: "PackagingWasteSubtypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecyclerCapabilities_Recyclers_RecyclerId",
                        column: x => x.RecyclerId,
                        principalTable: "Recyclers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "RecyclerSuggestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WasteListingId = table.Column<long>(type: "bigint", nullable: false),
                    RecyclerId = table.Column<int>(type: "int", nullable: false),
                    MatchScore = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ReasonCode = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    EstimatedConversionOutputAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EstimatedConversionOutputUnit = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IsInterested = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecyclerSuggestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecyclerSuggestions_Recyclers_RecyclerId",
                        column: x => x.RecyclerId,
                        principalTable: "Recyclers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecyclerSuggestions_WasteListings_WasteListingId",
                        column: x => x.WasteListingId,
                        principalSchema: "dbo",
                        principalTable: "WasteListings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerCapabilities_InputWasteSubtypeId",
                table: "RecyclerCapabilities",
                column: "InputWasteSubtypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerCapabilities_RecyclerId",
                table: "RecyclerCapabilities",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerSuggestions_RecyclerId",
                table: "RecyclerSuggestions",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerSuggestions_WasteListingId",
                table: "RecyclerSuggestions",
                column: "WasteListingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RecyclerCapabilities");

            migrationBuilder.DropTable(
                name: "RecyclerSuggestions");

            migrationBuilder.DropTable(
                name: "PackagingWasteSubtypes");

            migrationBuilder.DropTable(
                name: "Recyclers");

            migrationBuilder.DropColumn(
                name: "ContaminationLevel",
                schema: "dbo",
                table: "WasteListings");

            migrationBuilder.DropColumn(
                name: "FoodContactSuitability",
                schema: "dbo",
                table: "WasteListings");

            migrationBuilder.DropColumn(
                name: "PackagingWasteSubtype",
                schema: "dbo",
                table: "WasteListings");

            migrationBuilder.DropColumn(
                name: "RecyclabilityOption",
                schema: "dbo",
                table: "WasteListings");

            migrationBuilder.DropColumn(
                name: "SourceRecyclerId",
                schema: "dbo",
                table: "WasteListings");
        }
    }
}
