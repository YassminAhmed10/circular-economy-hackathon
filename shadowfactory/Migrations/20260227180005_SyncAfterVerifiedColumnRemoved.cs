using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace shadowfactory.Migrations
{
    /// <inheritdoc />
    public partial class SyncAfterVerifiedColumnRemoved : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "NumberOfEmployees",
                table: "Factories",
                type: "int",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NumberOfEmployees",
                table: "Factories");
        }
    }
}
