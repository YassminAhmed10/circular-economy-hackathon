using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class AddContaminationColumnsToWasteAssets : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WasteAssets_PackagingWasteSubtypes_PackagingWasteSubtypeId",
                table: "WasteAssets");

            migrationBuilder.DropColumn(
                name: "CanBeWashed",
                table: "WasteAssets");

            migrationBuilder.DropColumn(
                name: "IsReusable",
                table: "WasteAssets");

            migrationBuilder.RenameColumn(
                name: "PackagingWasteSubtypeId",
                table: "WasteAssets",
                newName: "PackagingWasteSubtypeId_Legacy");

            migrationBuilder.RenameColumn(
                name: "MaxReuseCount",
                table: "WasteAssets",
                newName: "RecyclabilityOption");

            migrationBuilder.RenameColumn(
                name: "CurrentReuseNumber",
                table: "WasteAssets",
                newName: "PackagingWasteSubtype");

            migrationBuilder.RenameIndex(
                name: "IX_WasteAssets_PackagingWasteSubtypeId",
                table: "WasteAssets",
                newName: "IX_WasteAssets_PackagingWasteSubtypeId_Legacy");

            migrationBuilder.AddColumn<int>(
                name: "ContaminationLevel",
                table: "WasteAssets",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "FoodContactSafe",
                table: "WasteAssets",
                type: "bit",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_WasteAssets_WasteTypeId",
                table: "WasteAssets",
                column: "WasteTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_WasteAssets_PackagingWasteSubtypes_PackagingWasteSubtypeId_Legacy",
                table: "WasteAssets",
                column: "PackagingWasteSubtypeId_Legacy",
                principalTable: "PackagingWasteSubtypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_WasteAssets_WasteTypes_WasteTypeId",
                table: "WasteAssets",
                column: "WasteTypeId",
                principalTable: "WasteTypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WasteAssets_PackagingWasteSubtypes_PackagingWasteSubtypeId_Legacy",
                table: "WasteAssets");

            migrationBuilder.DropForeignKey(
                name: "FK_WasteAssets_WasteTypes_WasteTypeId",
                table: "WasteAssets");

            migrationBuilder.DropIndex(
                name: "IX_WasteAssets_WasteTypeId",
                table: "WasteAssets");

            migrationBuilder.DropColumn(
                name: "ContaminationLevel",
                table: "WasteAssets");

            migrationBuilder.DropColumn(
                name: "FoodContactSafe",
                table: "WasteAssets");

            migrationBuilder.RenameColumn(
                name: "RecyclabilityOption",
                table: "WasteAssets",
                newName: "MaxReuseCount");

            migrationBuilder.RenameColumn(
                name: "PackagingWasteSubtypeId_Legacy",
                table: "WasteAssets",
                newName: "PackagingWasteSubtypeId");

            migrationBuilder.RenameColumn(
                name: "PackagingWasteSubtype",
                table: "WasteAssets",
                newName: "CurrentReuseNumber");

            migrationBuilder.RenameIndex(
                name: "IX_WasteAssets_PackagingWasteSubtypeId_Legacy",
                table: "WasteAssets",
                newName: "IX_WasteAssets_PackagingWasteSubtypeId");

            migrationBuilder.AddColumn<bool>(
                name: "CanBeWashed",
                table: "WasteAssets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsReusable",
                table: "WasteAssets",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddForeignKey(
                name: "FK_WasteAssets_PackagingWasteSubtypes_PackagingWasteSubtypeId",
                table: "WasteAssets",
                column: "PackagingWasteSubtypeId",
                principalTable: "PackagingWasteSubtypes",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
