using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class RelacaoServicoSetor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SetorId",
                table: "Servicos",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Servicos_SetorId",
                table: "Servicos",
                column: "SetorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Servicos_Setores_SetorId",
                table: "Servicos",
                column: "SetorId",
                principalTable: "Setores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Servicos_Setores_SetorId",
                table: "Servicos");

            migrationBuilder.DropIndex(
                name: "IX_Servicos_SetorId",
                table: "Servicos");

            migrationBuilder.DropColumn(
                name: "SetorId",
                table: "Servicos");
        }
    }
}
