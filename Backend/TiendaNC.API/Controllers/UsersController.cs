using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TiendaNC.API.DTOs;
using TiendaNC.API.Repository;
using TiendaNC.API.Enums;

namespace TiendaNC.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class UsersController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUnitOfWork unitOfWork, ILogger<UsersController> logger)
        {
            _unitOfWork = unitOfWork;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var users = await _unitOfWork.Users.GetAllAsync();
                var userDtos = users.Select(u => new UserResponseDto
                {
                    Id = u.Id.ToString(),
                    Name = u.Name,
                    Email = u.Email,
                    Role = u.Role.ToString(),
                    CreatedAt = u.CreatedAt
                }).ToList();

                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al obtener usuarios");
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpPatch("{id}/role")]
        public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleDto updateRoleDto)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                // Verificar que el rol sea válido
                if (!Enum.TryParse<UserRole>(updateRoleDto.Role, out var newRole))
                {
                    return BadRequest(new { message = "Rol inválido" });
                }

                // Verificar que siempre haya al menos un admin
                if (user.Role == UserRole.Admin && newRole != UserRole.Admin)
                {
                    var adminCount = await _unitOfWork.Users.CountAsync(u => u.Role == UserRole.Admin);
                    if (adminCount <= 1)
                    {
                        return BadRequest(new { message = "Debe haber al menos un administrador en el sistema" });
                    }
                }

                user.Role = newRole;
                user.UpdatedAt = DateTime.UtcNow;

                await _unitOfWork.Users.UpdateAsync(user);
                await _unitOfWork.SaveChangesAsync();

                var userDto = new UserResponseDto
                {
                    Id = user.Id.ToString(),
                    Name = user.Name,
                    Email = user.Email,
                    Role = user.Role.ToString(),
                    CreatedAt = user.CreatedAt
                };

                return Ok(userDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar rol del usuario {UserId}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _unitOfWork.Users.GetByIdAsync(id);
                if (user == null)
                {
                    return NotFound(new { message = "Usuario no encontrado" });
                }

                // Verificar que no sea el último admin
                if (user.Role == UserRole.Admin)
                {
                    var adminCount = await _unitOfWork.Users.CountAsync(u => u.Role == UserRole.Admin);
                    if (adminCount <= 1)
                    {
                        return BadRequest(new { message = "No se puede eliminar el último administrador del sistema" });
                    }
                }

                await _unitOfWork.Users.DeleteAsync(user);
                await _unitOfWork.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar usuario {UserId}", id);
                return StatusCode(500, new { message = "Error interno del servidor" });
            }
        }
    }

    public class UpdateUserRoleDto
    {
        public string Role { get; set; } = string.Empty;
    }
}
