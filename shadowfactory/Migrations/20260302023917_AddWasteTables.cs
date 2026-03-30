using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class AddWasteTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Factories_FactoryId",
                table: "Transactions");

            migrationBuilder.DropForeignKey(
                name: "FK_Transactions_Factories_FactoryId1",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_FactoryId",
                table: "Transactions");

            migrationBuilder.DropIndex(
                name: "IX_Transactions_FactoryId1",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "FactoryId",
                table: "Transactions");

            migrationBuilder.DropColumn(
                name: "FactoryId1",
                table: "Transactions");

            migrationBuilder.CreateTable(
                name: "WasteTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NameAr = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    NameEn = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WasteTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FactoryPurchases",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FactoryId = table.Column<long>(type: "bigint", nullable: false),
                    WasteTypeId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Purpose = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactoryPurchases", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FactoryPurchases_Factories_FactoryId",
                        column: x => x.FactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactoryPurchases_WasteTypes_WasteTypeId",
                        column: x => x.WasteTypeId,
                        principalTable: "WasteTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FactoryWastes",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FactoryId = table.Column<long>(type: "bigint", nullable: false),
                    WasteTypeId = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Unit = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Frequency = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FactoryWastes", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FactoryWastes_Factories_FactoryId",
                        column: x => x.FactoryId,
                        principalTable: "Factories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FactoryWastes_WasteTypes_WasteTypeId",
                        column: x => x.WasteTypeId,
                        principalTable: "WasteTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FactoryPurchases_FactoryId",
                table: "FactoryPurchases",
                column: "FactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryPurchases_WasteTypeId",
                table: "FactoryPurchases",
                column: "WasteTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryWastes_FactoryId",
                table: "FactoryWastes",
                column: "FactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_FactoryWastes_WasteTypeId",
                table: "FactoryWastes",
                column: "WasteTypeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FactoryPurchases");

            migrationBuilder.DropTable(
                name: "FactoryWastes");

            migrationBuilder.DropTable(
                name: "WasteTypes");

            migrationBuilder.AddColumn<long>(
                name: "FactoryId",
                table: "Transactions",
                type: "bigint",
                nullable: true);

            migrationBuilder.AddColumn<long>(
                name: "FactoryId1",
                table: "Transactions",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_FactoryId",
                table: "Transactions",
                column: "FactoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_FactoryId1",
                table: "Transactions",
                column: "FactoryId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Factories_FactoryId",
                table: "Transactions",
                column: "FactoryId",
                principalTable: "Factories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transactions_Factories_FactoryId1",
                table: "Transactions",
                column: "FactoryId1",
                principalTable: "Factories",
                principalColumn: "Id");
        }
    }
}
