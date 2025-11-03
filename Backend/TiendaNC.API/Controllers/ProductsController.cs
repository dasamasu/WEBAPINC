using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TiendaNC.API.Data;
using TiendaNC.API.DTOs;
using TiendaNC.API.Models;
using TiendaNC.API.Repository;

namespace TiendaNC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(IUnitOfWork unitOfWork, ApplicationDbContext context, ILogger<ProductsController> logger)
        {
            _unitOfWork = unitOfWork;
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetProducts([FromQuery] ProductQueryDto query)
        {
            try
            {
                var productsQuery = _context.Products.AsQueryable();

                // Aplicar filtros
                if (!string.IsNullOrEmpty(query.Search))
                {
                    var searchLower = query.Search.ToLower();
                    productsQuery = productsQuery.Where(p => 
                        p.Name.ToLower().Contains(searchLower) || 
                        p.Description.ToLower().Contains(searchLower));
                }

                if (!string.IsNullOrEmpty(query.Type) && query.Type != "Todos")
                {
                    productsQuery = productsQuery.Where(p => p.Type == query.Type);
                }

                if (query.MinPrice.HasValue)
                {
                    productsQuery = productsQuery.Where(p => p.Price >= query.MinPrice.Value);
                }

                if (query.MaxPrice.HasValue)
                {
                    productsQuery = productsQuery.Where(p => p.Price <= query.MaxPrice.Value);
                }

                // Aplicar ordenamiento
                productsQuery = query.OrderBy.ToLower() switch
                {
                    "price" => query.OrderDesc ? productsQuery.OrderByDescending(p => p.Price) : productsQuery.OrderBy(p => p.Price),
                    "date" => query.OrderDesc ? productsQuery.OrderByDescending(p => p.CreatedAt) : productsQuery.OrderBy(p => p.CreatedAt),
                    _ => query.OrderDesc ? productsQuery.OrderByDescending(p => p.Name) : productsQuery.OrderBy(p => p.Name)
                };

                // Contar total
                var totalCount = await productsQuery.CountAsync();

                // Aplicar paginación
                var products = await productsQuery
                    .Skip((query.Page - 1) * query.PageSize)
                    .Take(query.PageSize)
                    .Select(p => new ProductDto
                    {
                        Id = p.Id,
                        Name = p.Name,
                        Description = p.Description,
                        ImageUrl = p.ImageUrl,
                        Price = p.Price,
                        Type = p.Type,
                        CreatedAt = p.CreatedAt,
                        UpdatedAt = p.UpdatedAt
                    })
                    .ToListAsync();

                var result = new PagedResultDto<ProductDto>
                {
                    Items = products,
                    TotalCount = totalCount,
                    Page = query.Page,
                    PageSize = query.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / query.PageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener productos");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProduct(int id)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    ImageUrl = product.ImageUrl,
                    Price = product.Price,
                    Type = product.Type,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt
                };

                return Ok(productDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener producto {ProductId}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto createProductDto)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (!int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized(new { message = "Usuario no válido" });
                }

                var product = new Product
                {
                    Name = createProductDto.Name,
                    Description = createProductDto.Description,
                    ImageUrl = createProductDto.ImageUrl,
                    Price = createProductDto.Price,
                    Type = createProductDto.Type,
                    CreatedByUserId = userId,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                await _unitOfWork.Products.AddAsync(product);
                await _unitOfWork.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    ImageUrl = product.ImageUrl,
                    Price = product.Price,
                    Type = product.Type,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt
                };

                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, productDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear producto");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(int id, [FromBody] UpdateProductDto updateProductDto)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                product.Name = updateProductDto.Name;
                product.Description = updateProductDto.Description;
                product.ImageUrl = updateProductDto.ImageUrl;
                product.Price = updateProductDto.Price;
                product.Type = updateProductDto.Type;
                product.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.Products.UpdateAsync(product);
                await _unitOfWork.SaveChangesAsync();

                var productDto = new ProductDto
                {
                    Id = product.Id,
                    Name = product.Name,
                    Description = product.Description,
                    ImageUrl = product.ImageUrl,
                    Price = product.Price,
                    Type = product.Type,
                    CreatedAt = product.CreatedAt,
                    UpdatedAt = product.UpdatedAt
                };

                return Ok(productDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar producto {ProductId}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            try
            {
                var product = await _unitOfWork.Products.GetByIdAsync(id);
                if (product == null)
                {
                    return NotFound(new { message = "Producto no encontrado" });
                }

                await _unitOfWork.Products.DeleteAsync(product);
                await _unitOfWork.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar producto {ProductId}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }
}
