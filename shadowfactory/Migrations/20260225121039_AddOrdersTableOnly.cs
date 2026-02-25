using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class AddOrdersTableOnly : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // ⚠️ REMOVE ALL EXISTING TABLE CREATIONS ⚠️
            // Keep ONLY the Orders table creation
            // Delete or comment out all the other CreateTable calls

            // Remove or comment out these lines:
            // migrationBuilder.EnsureSchema(name: "dbo");
            // migrationBuilder.CreateTable(name: "Factories", ...);
            // migrationBuilder.CreateTable(name: "Partners", ...);
            // migrationBuilder.CreateTable(name: "AuditLogs", ...);
            // migrationBuilder.CreateTable(name: "FactoryWasteTypes", ...);
            // migrationBuilder.CreateTable(name: "Users", ...);
            // migrationBuilder.CreateTable(name: "VerificationTokens", ...);
            // migrationBuilder.CreateTable(name: "WasteListings", ...);
            // migrationBuilder.CreateTable(name: "Transactions", ...);

            // ✅ Keep ONLY this part for Orders table
            migrationBuilder.CreateTable(
                name: "Orders",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    OrderNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    WasteListingId = table.Column<long>(type: "bigint", nullable: false),
                    BuyerFactoryId = table.Column<long>(type: "bigint", nullable: false),
                    SellerFactoryId = table.Column<long>(type: "bigint", nullable: false),
                    WasteType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    WasteCategory = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    BuyerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SellerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false, defaultValue: "معلق"),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    OrderDate = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    DeliveryDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CompletedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()"),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "GETUTCDATE()")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Orders", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Orders_Factories_BuyerFactoryId",
                        column: x => x.BuyerFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_Factories_SellerFactoryId",
                        column: x => x.SellerFactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Orders_WasteListings_WasteListingId",
                        column: x => x.WasteListingId,
                        principalSchema: "dbo",
                        principalTable: "WasteListings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            // ✅ Keep the indexes for Orders table
            migrationBuilder.CreateIndex(
                name: "IX_Orders_BuyerFactoryId",
                table: "Orders",
                column: "BuyerFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderDate",
                table: "Orders",
                column: "OrderDate");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_OrderNumber",
                table: "Orders",
                column: "OrderNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_SellerFactoryId",
                table: "Orders",
                column: "SellerFactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_Status",
                table: "Orders",
                column: "Status");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_WasteListingId",
                table: "Orders",
                column: "WasteListingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Only drop the Orders table
            migrationBuilder.DropTable(
                name: "Orders");
        }
    }
}