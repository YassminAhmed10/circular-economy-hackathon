using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class CircularEconomyEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<long>(
                name: "WasteAssetId",
                table: "RecyclerSuggestions",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WasteAssets",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GeneratorFactoryId = table.Column<long>(type: "bigint", nullable: false),
                    GeneratedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WasteTypeId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    VerifiedComposition = table.Column<bool>(type: "bit", nullable: false),
                    EstimatedCO2EquivalentIfLandfilled = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    QualityNotes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    PackagingWasteSubtypeId = table.Column<int>(type: "int", nullable: true),
                    CanBeWashed = table.Column<bool>(type: "bit", nullable: false),
                    IsReusable = table.Column<bool>(type: "bit", nullable: false),
                    MaxReuseCount = table.Column<int>(type: "int", nullable: false),
                    CurrentReuseNumber = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CurrentLocationFactoryId = table.Column<long>(type: "bigint", nullable: true),
                    AcquiredDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IsPublic = table.Column<bool>(type: "bit", nullable: false),
                    ListingPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PublicDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ListingExpiredAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Views = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WasteAssets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WasteAssets_Factories_CurrentLocationFactoryId",
                        column: x => x.CurrentLocationFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WasteAssets_Factories_GeneratorFactoryId",
                        column: x => x.GeneratorFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WasteAssets_PackagingWasteSubtypes_PackagingWasteSubtypeId",
                        column: x => x.PackagingWasteSubtypeId,
                        principalTable: "PackagingWasteSubtypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "EnvironmentalImpactRecords",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WasteAssetId = table.Column<long>(type: "bigint", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    WasteTypeId = table.Column<int>(type: "int", nullable: false),
                    CO2EquivalentKgIfLandfilled = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    MethaneEmissionKgIfLandfilled = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    LandfillSpaceM3IfLandfilled = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    FinalStatus = table.Column<int>(type: "int", nullable: false),
                    RecyclerId = table.Column<int>(type: "int", nullable: true),
                    RecyclingProcessType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CO2KgAvoided = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    MethaneEmissionAvoided = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    LandfillSpaceM3Saved = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    WasEnergyRecovered = table.Column<bool>(type: "bit", nullable: false),
                    EnergyRecoveredKWh = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    OutputMaterialType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    OutputQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OutputUnit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    JobsCreatedInRecycling = table.Column<int>(type: "int", nullable: false),
                    CostSavingsForFactory = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    RevenueForRecycler = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    VerifiedByAdminId = table.Column<long>(type: "bigint", nullable: true),
                    VerifiedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    VerificationNotes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CertificateNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CertificateIssuedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CertificateUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EnvironmentalImpactRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_EnvironmentalImpactRecords_Recyclers_RecyclerId",
                        column: x => x.RecyclerId,
                        principalTable: "Recyclers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_EnvironmentalImpactRecords_WasteAssets_WasteAssetId",
                        column: x => x.WasteAssetId,
                        principalTable: "WasteAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WasteAssetOffers",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WasteAssetId = table.Column<long>(type: "bigint", nullable: false),
                    BuyerFactoryId = table.Column<long>(type: "bigint", nullable: false),
                    OfferNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    OfferedQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OfferedPricePerUnit = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    TotalOfferedPrice = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CompletedTransactionId = table.Column<long>(type: "bigint", nullable: true),
                    DeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    IntendedUseType = table.Column<int>(type: "int", nullable: true),
                    IntendedUseDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WasteAssetOffers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WasteAssetOffers_Factories_BuyerFactoryId",
                        column: x => x.BuyerFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WasteAssetOffers_WasteAssets_WasteAssetId",
                        column: x => x.WasteAssetId,
                        principalTable: "WasteAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "WasteRecyclingOrders",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WasteAssetId = table.Column<long>(type: "bigint", nullable: false),
                    RecyclerId = table.Column<int>(type: "int", nullable: false),
                    OrderedByFactoryId = table.Column<long>(type: "bigint", nullable: false),
                    RecyclerCapabilityId = table.Column<int>(type: "int", nullable: true),
                    OrderNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    QuantityToProcess = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ProcessingCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SpecialInstructions = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AcceptedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProcessingStartedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProcessingCompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    DeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ProcessingMethodUsed = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    ProcessDescriptionActual = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ActualEfficiencyPercent = table.Column<decimal>(type: "decimal(5,2)", nullable: false),
                    OutputMaterialType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    OutputQuantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OutputUnit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    OutputDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BeforePhoto = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    AfterPhoto = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ProcessProofDocument = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CO2AvoidedKg = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    ImpactVerified = table.Column<bool>(type: "bit", nullable: false),
                    ImpactRecordId = table.Column<long>(type: "bigint", nullable: true),
                    HasQualityCertification = table.Column<bool>(type: "bit", nullable: false),
                    CertificationType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CertificationNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WasteRecyclingOrders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WasteRecyclingOrders_EnvironmentalImpactRecords_ImpactRecordId",
                        column: x => x.ImpactRecordId,
                        principalTable: "EnvironmentalImpactRecords",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WasteRecyclingOrders_Factories_OrderedByFactoryId",
                        column: x => x.OrderedByFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WasteRecyclingOrders_RecyclerCapabilities_RecyclerCapabilityId",
                        column: x => x.RecyclerCapabilityId,
                        principalTable: "RecyclerCapabilities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WasteRecyclingOrders_Recyclers_RecyclerId",
                        column: x => x.RecyclerId,
                        principalTable: "Recyclers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_WasteRecyclingOrders_WasteAssets_WasteAssetId",
                        column: x => x.WasteAssetId,
                        principalTable: "WasteAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "WasteJourneyEntries",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WasteAssetId = table.Column<long>(type: "bigint", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Timestamp = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ResponsibleFactoryId = table.Column<long>(type: "bigint", nullable: true),
                    ResponsiblePersonName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    ProofUrl = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ProofType = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    LocationCoordinates = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    LocationName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    TransportMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    QualityCheckPassed = table.Column<bool>(type: "bit", nullable: false),
                    QualityIssues = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    WasteRecyclingOrderId = table.Column<long>(type: "bigint", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WasteJourneyEntries", x => x.Id);
                    table.ForeignKey(
                        name: "FK_WasteJourneyEntries_Factories_ResponsibleFactoryId",
                        column: x => x.ResponsibleFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_WasteJourneyEntries_WasteAssets_WasteAssetId",
                        column: x => x.WasteAssetId,
                        principalTable: "WasteAssets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_WasteJourneyEntries_WasteRecyclingOrders_WasteRecyclingOrderId",
                        column: x => x.WasteRecyclingOrderId,
                        principalTable: "WasteRecyclingOrders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RecyclerSuggestions_WasteAssetId",
                table: "RecyclerSuggestions",
                column: "WasteAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_EnvironmentalImpactRecords_RecyclerId",
                table: "EnvironmentalImpactRecords",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_EnvironmentalImpactRecords_WasteAssetId",
                table: "EnvironmentalImpactRecords",
                column: "WasteAssetId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_WasteAssetOffers_BuyerFactoryId",
                table: "WasteAssetOffers",
                column: "BuyerFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteAssetOffers_WasteAssetId",
                table: "WasteAssetOffers",
                column: "WasteAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteAssets_CurrentLocationFactoryId",
                table: "WasteAssets",
                column: "CurrentLocationFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteAssets_GeneratorFactoryId",
                table: "WasteAssets",
                column: "GeneratorFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteAssets_PackagingWasteSubtypeId",
                table: "WasteAssets",
                column: "PackagingWasteSubtypeId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteJourneyEntries_ResponsibleFactoryId",
                table: "WasteJourneyEntries",
                column: "ResponsibleFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteJourneyEntries_WasteAssetId",
                table: "WasteJourneyEntries",
                column: "WasteAssetId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteJourneyEntries_WasteRecyclingOrderId",
                table: "WasteJourneyEntries",
                column: "WasteRecyclingOrderId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecyclingOrders_ImpactRecordId",
                table: "WasteRecyclingOrders",
                column: "ImpactRecordId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecyclingOrders_OrderedByFactoryId",
                table: "WasteRecyclingOrders",
                column: "OrderedByFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecyclingOrders_RecyclerCapabilityId",
                table: "WasteRecyclingOrders",
                column: "RecyclerCapabilityId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecyclingOrders_RecyclerId",
                table: "WasteRecyclingOrders",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecyclingOrders_WasteAssetId",
                table: "WasteRecyclingOrders",
                column: "WasteAssetId");

            migrationBuilder.AddForeignKey(
                name: "FK_RecyclerSuggestions_WasteAssets_WasteAssetId",
                table: "RecyclerSuggestions",
                column: "WasteAssetId",
                principalTable: "WasteAssets",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RecyclerSuggestions_WasteAssets_WasteAssetId",
                table: "RecyclerSuggestions");

            migrationBuilder.DropTable(
                name: "WasteAssetOffers");

            migrationBuilder.DropTable(
                name: "WasteJourneyEntries");

            migrationBuilder.DropTable(
                name: "WasteRecyclingOrders");

            migrationBuilder.DropTable(
                name: "EnvironmentalImpactRecords");

            migrationBuilder.DropTable(
                name: "WasteAssets");

            migrationBuilder.DropIndex(
                name: "IX_RecyclerSuggestions_WasteAssetId",
                table: "RecyclerSuggestions");

            migrationBuilder.DropColumn(
                name: "WasteAssetId",
                table: "RecyclerSuggestions");
        }
    }
}
