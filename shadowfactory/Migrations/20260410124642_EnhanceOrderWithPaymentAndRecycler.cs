using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class EnhanceOrderWithPaymentAndRecycler : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EnvironmentalImpactRecords_Recyclers_RecyclerId",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_EnvironmentalImpactRecords_WasteAssets_WasteAssetId",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropIndex(
                name: "IX_EnvironmentalImpactRecords_RecyclerId",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropIndex(
                name: "IX_EnvironmentalImpactRecords_WasteAssetId",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "CertificateIssuedAt",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "CertificateNumber",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "CertificateUrl",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "IsVerified",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "VerificationNotes",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "VerifiedAt",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "VerifiedByAdminId",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.AddColumn<long>(
                name: "OrderId",
                table: "WasteRecyclingOrders",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OrderStatus",
                table: "Orders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Pending");

            migrationBuilder.AddColumn<string>(
                name: "PaymentStatus",
                table: "Orders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                defaultValue: "Pending");

            migrationBuilder.AddColumn<DateTime>(
                name: "RecyclerAcceptedAt",
                table: "Orders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecyclerId",
                table: "Orders",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "RecyclerProcessingFee",
                table: "Orders",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "RecyclerRequestedAt",
                table: "Orders",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "RecyclerStatus",
                table: "Orders",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true,
                defaultValue: "None");

            migrationBuilder.AddColumn<decimal>(
                name: "TotalPrice",
                table: "Orders",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<long>(
                name: "WasteRecyclingOrderId",
                table: "Orders",
                type: "bigint",
                nullable: true);

            migrationBuilder.AlterColumn<long>(
                name: "WasteAssetId",
                table: "EnvironmentalImpactRecords",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddColumn<decimal>(
                name: "BaselineCO2EquivalentKg",
                table: "EnvironmentalImpactRecords",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<DateTime>(
                name: "CalculatedAt",
                table: "EnvironmentalImpactRecords",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CalculationMethodVersion",
                table: "EnvironmentalImpactRecords",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "EnergySavedKwh",
                table: "EnvironmentalImpactRecords",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "ItemsReuseCount",
                table: "EnvironmentalImpactRecords",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "LandfillDiversionKg",
                table: "EnvironmentalImpactRecords",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MaterialRecoveredKg",
                table: "EnvironmentalImpactRecords",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "NetCO2AvoidedKg",
                table: "EnvironmentalImpactRecords",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "RecyclingCO2AvoidedKg",
                table: "EnvironmentalImpactRecords",
                type: "decimal(10,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "WaterSavedLiters",
                table: "EnvironmentalImpactRecords",
                type: "decimal(12,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.CreateTable(
                name: "OrderPayments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderId = table.Column<long>(type: "bigint", nullable: false),
                    PaymentType = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    PayerFactoryId = table.Column<long>(type: "bigint", nullable: false),
                    PayeeFactoryId = table.Column<long>(type: "bigint", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false, defaultValue: 0),
                    PaymentMethod = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    TransactionReference = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    CompletedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FailedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderPayments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrderPayments_Factories_PayeeFactoryId",
                        column: x => x.PayeeFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderPayments_Factories_PayerFactoryId",
                        column: x => x.PayerFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_OrderPayments_Orders_OrderId",
                        column: x => x.OrderId,
                        principalTable: "Orders",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WasteRecyclingOrders_OrderId",
                table: "WasteRecyclingOrders",
                column: "OrderId",
                unique: true,
                filter: "[OrderId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_RecyclerId",
                table: "Orders",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_EnvironmentalImpactRecords_WasteAssetId",
                table: "EnvironmentalImpactRecords",
                column: "WasteAssetId",
                unique: true,
                filter: "[WasteAssetId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_CreatedAt",
                table: "OrderPayments",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_OrderId",
                table: "OrderPayments",
                column: "OrderId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_OrderId_PaymentType_Status",
                table: "OrderPayments",
                columns: new[] { "OrderId", "PaymentType", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_PayeeFactoryId",
                table: "OrderPayments",
                column: "PayeeFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_OrderPayments_PayerFactoryId",
                table: "OrderPayments",
                column: "PayerFactoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_EnvironmentalImpactRecords_WasteAssets_WasteAssetId",
                table: "EnvironmentalImpactRecords",
                column: "WasteAssetId",
                principalTable: "WasteAssets",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Recyclers_RecyclerId",
                table: "Orders",
                column: "RecyclerId",
                principalTable: "Recyclers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_WasteRecyclingOrders_Orders_OrderId",
                table: "WasteRecyclingOrders",
                column: "OrderId",
                principalTable: "Orders",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EnvironmentalImpactRecords_WasteAssets_WasteAssetId",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Recyclers_RecyclerId",
                table: "Orders");

            migrationBuilder.DropForeignKey(
                name: "FK_WasteRecyclingOrders_Orders_OrderId",
                table: "WasteRecyclingOrders");

            migrationBuilder.DropTable(
                name: "OrderPayments");

            migrationBuilder.DropIndex(
                name: "IX_WasteRecyclingOrders_OrderId",
                table: "WasteRecyclingOrders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_RecyclerId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_EnvironmentalImpactRecords_WasteAssetId",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "OrderId",
                table: "WasteRecyclingOrders");

            migrationBuilder.DropColumn(
                name: "OrderStatus",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "PaymentStatus",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "RecyclerAcceptedAt",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "RecyclerId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "RecyclerProcessingFee",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "RecyclerRequestedAt",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "RecyclerStatus",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "TotalPrice",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "WasteRecyclingOrderId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "BaselineCO2EquivalentKg",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "CalculatedAt",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "CalculationMethodVersion",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "EnergySavedKwh",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "ItemsReuseCount",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "LandfillDiversionKg",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "MaterialRecoveredKg",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "NetCO2AvoidedKg",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "RecyclingCO2AvoidedKg",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.DropColumn(
                name: "WaterSavedLiters",
                table: "EnvironmentalImpactRecords");

            migrationBuilder.AlterColumn<long>(
                name: "WasteAssetId",
                table: "EnvironmentalImpactRecords",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CertificateIssuedAt",
                table: "EnvironmentalImpactRecords",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CertificateNumber",
                table: "EnvironmentalImpactRecords",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CertificateUrl",
                table: "EnvironmentalImpactRecords",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsVerified",
                table: "EnvironmentalImpactRecords",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "VerificationNotes",
                table: "EnvironmentalImpactRecords",
                type: "nvarchar(500)",
                maxLength: 500,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "VerifiedAt",
                table: "EnvironmentalImpactRecords",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "VerifiedByAdminId",
                table: "EnvironmentalImpactRecords",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_EnvironmentalImpactRecords_RecyclerId",
                table: "EnvironmentalImpactRecords",
                column: "RecyclerId");

            migrationBuilder.CreateIndex(
                name: "IX_EnvironmentalImpactRecords_WasteAssetId",
                table: "EnvironmentalImpactRecords",
                column: "WasteAssetId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_EnvironmentalImpactRecords_Recyclers_RecyclerId",
                table: "EnvironmentalImpactRecords",
                column: "RecyclerId",
                principalTable: "Recyclers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_EnvironmentalImpactRecords_WasteAssets_WasteAssetId",
                table: "EnvironmentalImpactRecords",
                column: "WasteAssetId",
                principalTable: "WasteAssets",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
