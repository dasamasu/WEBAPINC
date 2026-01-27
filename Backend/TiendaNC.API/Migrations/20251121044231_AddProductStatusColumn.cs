using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TiendaNC.API.Migrations
{
    /// <inheritdoc />
    public partial class AddProductStatusColumn : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Solo agregar la columna Status a la tabla Products existente
            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "Products",
                type: "int",
                nullable: false,
                defaultValue: 0); // ProductStatus.Disponible
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Eliminar la columna Status si se revierte la migración
            migrationBuilder.DropColumn(
                name: "Status",
                table: "Products");
        }
    }
}
