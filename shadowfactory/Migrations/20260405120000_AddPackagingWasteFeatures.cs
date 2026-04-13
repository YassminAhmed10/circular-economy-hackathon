using Microsoft.EntityFrameworkCore.Migrations;

namespace shadowfactory.Migrations
{
    public partial class AddPackagingWasteFeatures : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add new columns to WasteListing table for packaging waste specifics
            migrationBuilder.AddColumn<string>(
                name: "ContaminationLevel",
                table: "WasteListings",
                type: "nvarchar(50)",
                nullable: true,
                defaultValue: null);

            migrationBuilder.AddColumn<bool>(
                name: "FoodContactSuitability",
                table: "WasteListings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "RecyclabilityOption",
                table: "WasteListings",
                type: "nvarchar(150)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PackagingWasteSubtype",
                table: "WasteListings",
                type: "nvarchar(100)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SourceRecyclerId",
                table: "WasteListings",
                type: "int",
                nullable: true);

            // Create PackagingWasteSubtypes table
            migrationBuilder.CreateTable(
                name: "PackagingWasteSubtypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    NameAr = table.Column<string>(type: "nvarchar(100)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    Icon = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackagingWasteSubtypes", x => x.Id);
                });

            // Create Recyclers table
            migrationBuilder.CreateTable(
                name: "Recyclers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: true),
                    CompanyName = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    CompanyNameAr = table.Column<string>(type: "nvarchar(200)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    DescriptionAr = table.Column<string>(type: "nvarchar(1000)", nullable: true),
                    ContactEmail = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    WhatsappNumber = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    Location = table.Column<string>(type: "nvarchar(255)", nullable: false),
                    LocationAr = table.Column<string>(type: "nvarchar(255)", nullable: true),
                    Latitude = table.Column<double>(type: "float", nullable: true),
                    Longitude = table.Column<double>(type: "float", nullable: true),
                    LogoUrl = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    CertificationNumber = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    Rating = table.Column<decimal>(type: "decimal(3,2)", nullable: false, defaultValue: 0m),
                    TotalConversions = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Recyclers", x => x.Id);
                });

            // Create RecyclerCapabilities table (input/output materials recyclers can handle)
            migrationBuilder.CreateTable(
                name: "RecyclerCapabilities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RecyclerId = table.Column<int>(type: "int", nullable: false),
                    InputWasteSubtypeId = table.Column<int>(type: "int", nullable: false),
                    OutputMaterialType = table.Column<string>(type: "nvarchar(150)", nullable: false),
                    OutputMaterialTypeAr = table.Column<string>(type: "nvarchar(150)", nullable: true),
                    CapacityPerMonth = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CapacityUnit = table.Column<string>(type: "nvarchar(20)", nullable: false),
                    CostPerUnit = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    LeadTime = table.Column<int>(type: "int", nullable: false),
                    ProcessDescription = table.Column<string>(type: "nvarchar(500)", nullable: true),
                    IsActive = table.Column<bool>(type: "bit", nullable: false, defaultValue: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecyclerCapabilities", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecyclerCapabilities_Recyclers_RecyclerId",
                        column: x => x.RecyclerId,
                        principalTable: "Recyclers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecyclerCapabilities_PackagingWasteSubtypes_InputWasteSubtypeId",
                        column: x => x.InputWasteSubtypeId,
                        principalTable: "PackagingWasteSubtypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Create RecyclerSuggestions table (tracks suggested recyclers for listings)
            migrationBuilder.CreateTable(
                name: "RecyclerSuggestions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WasteListingId = table.Column<int>(type: "int", nullable: false),
                    RecyclerId = table.Column<int>(type: "int", nullable: false),
                    MatchScore = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    ReasonCode = table.Column<string>(type: "nvarchar(100)", nullable: true),
                    EstimatedConversionOutputAmount = table.Column<decimal>(type: "decimal(10,2)", nullable: true),
                    EstimatedConversionOutputUnit = table.Column<string>(type: "nvarchar(20)", nullable: true),
                    IsInterested = table.Column<bool>(type: "bit", nullable: false, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RecyclerSuggestions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RecyclerSuggestions_WasteListings_WasteListingId",
                        column: x => x.WasteListingId,
                        principalTable: "WasteListings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_RecyclerSuggestions_Recyclers_RecyclerId",
                        column: x => x.RecyclerId,
                        principalTable: "Recyclers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Create index for faster queries
            migrationBuilder.CreateIndex(
                name: "IX_WasteListings_PackagingWasteSubtype",
                table: "WasteListings",
                column: "PackagingWasteSubtype");

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerCapabilities_RecyclerId",
                table: "RecyclerCapabilities",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerCapabilities_InputWasteSubtypeId",
                table: "RecyclerCapabilities",
                column: "InputWasteSubtypeId");

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerSuggestions_WasteListingId",
                table: "RecyclerSuggestions",
                column: "WasteListingId");

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerSuggestions_RecyclerId",
                table: "RecyclerSuggestions",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_Recyclers_IsVerified_IsActive",
                table: "Recyclers",
                columns: new[] { "IsVerified", "IsActive" });

            // Insert packaging waste subtypes
            migrationBuilder.InsertData(
                table: "PackagingWasteSubtypes",
                columns: new[] { "Name", "NameAr", "Description", "Icon", "IsActive" },
                values: new object[,]
                {
                    { "Plastic", "", "Plastic packaging waste materials", "♻️", true },
                    { "Paper", "", "Paper-based packaging materials", "📄", true },
                    { "Cardboard", "", "Cardboard and corrugated materials", "📦", true },
                    { "Biopolymers", "", "Biodegradable polymer materials", "🌱", true },
                    { "Agri-residues", "", "Agricultural byproduct packaging", "🌾", true }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(name: "RecyclerSuggestions");
            migrationBuilder.DropTable(name: "RecyclerCapabilities");
            migrationBuilder.DropTable(name: "Recyclers");
            migrationBuilder.DropTable(name: "PackagingWasteSubtypes");

            migrationBuilder.DropIndex(
                name: "IX_WasteListings_PackagingWasteSubtype",
                table: "WasteListings");

            migrationBuilder.DropColumn(name: "ContaminationLevel", table: "WasteListings");
            migrationBuilder.DropColumn(name: "FoodContactSuitability", table: "WasteListings");
            migrationBuilder.DropColumn(name: "RecyclabilityOption", table: "WasteListings");
            migrationBuilder.DropColumn(name: "PackagingWasteSubtype", table: "WasteListings");
            migrationBuilder.DropColumn(name: "SourceRecyclerId", table: "WasteListings");
        }
    }
}
