using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DrawingBot.Migrations
{
    /// <inheritdoc />
    public partial class AddPromptToDrawing : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Prompt",
                table: "Drawings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prompt",
                table: "Drawings");
        }
    }
}
