using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class ResponsavelChamado : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ResponsavelId",
                table: "Chamados",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Chamados_ResponsavelId",
                table: "Chamados",
                column: "ResponsavelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Chamados_Usuarios_ResponsavelId",
                table: "Chamados",
                column: "ResponsavelId",
                principalTable: "Usuarios",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Chamados_Usuarios_ResponsavelId",
                table: "Chamados");

            migrationBuilder.DropIndex(
                name: "IX_Chamados_ResponsavelId",
                table: "Chamados");

            migrationBuilder.DropColumn(
                name: "ResponsavelId",
                table: "Chamados");
        }
    }
}
