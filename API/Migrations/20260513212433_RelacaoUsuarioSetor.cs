using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class RelacaoUsuarioSetor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SetorId",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_SetorId",
                table: "Usuarios",
                column: "SetorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Setores_SetorId",
                table: "Usuarios",
                column: "SetorId",
                principalTable: "Setores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Setores_SetorId",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_SetorId",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "SetorId",
                table: "Usuarios");
        }
    }
}
