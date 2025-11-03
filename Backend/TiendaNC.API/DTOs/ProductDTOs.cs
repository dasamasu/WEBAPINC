using System.ComponentModel.DataAnnotations;

namespace TiendaNC.API.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Type { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreateProductDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor que 0")]
        public decimal Price { get; set; }

        [Required]
        [RegularExpression("^(Venta|Alquiler)$", ErrorMessage = "El tipo debe ser 'Venta' o 'Alquiler'")]
        public string Type { get; set; } = string.Empty;
    }

    public class UpdateProductDto
    {
        [Required]
        [StringLength(200)]
        public string Name { get; set; } = string.Empty;

        [StringLength(1000)]
        public string Description { get; set; } = string.Empty;

        [StringLength(500)]
        public string ImageUrl { get; set; } = string.Empty;

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor que 0")]
        public decimal Price { get; set; }

        [Required]
        [RegularExpression("^(Venta|Alquiler)$", ErrorMessage = "El tipo debe ser 'Venta' o 'Alquiler'")]
        public string Type { get; set; } = string.Empty;
    }

    public class ProductQueryDto
    {
        public string? Search { get; set; }
        public string? Type { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string OrderBy { get; set; } = "name";
        public bool OrderDesc { get; set; } = false;
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 12;
    }

    public class PagedResultDto<T>
    {
        public List<T> Items { get; set; } = new();
        public int TotalCount { get; set; }
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}
