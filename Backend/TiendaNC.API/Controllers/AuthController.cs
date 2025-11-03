//using Microsoft.AspNetCore.Mvc;
//using TiendaNC.API.DTOs;
//using TiendaNC.API.Models;
//using TiendaNC.API.Repository;
//using TiendaNC.API.Services;
//using TiendaNC.API.Enums;

//namespace TiendaNC.API.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AuthController : ControllerBase
//    {
//        private readonly IUnitOfWork _unitOfWork;
//        private readonly ITokenService _tokenService;
//        private readonly ILogger<AuthController> _logger;

//        public AuthController(IUnitOfWork unitOfWork, ITokenService tokenService, ILogger<AuthController> logger)
//        {
//            _unitOfWork = unitOfWork;
//            _tokenService = tokenService;
//            _logger = logger;
//        }

//        [HttpPost("register")]
//        public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
//        {
//            try
//            {
//                 Verificar si el usuario ya existe
//                var existingUser = await _unitOfWork.Users.GetAsync(u => u.Email == registerDto.Email);
//                if (existingUser != null)
//                {
//                    return BadRequest(new { message = "El usuario ya existe" });
//                }

//                 Crear nuevo usuario
//                var user = new User
//                {
//                    Name = registerDto.Name,
//                    Email = registerDto.Email,
//                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
//                    Role = UserRole.User,
//                    CreatedAt = DateTime.UtcNow,
//                    UpdatedAt = DateTime.UtcNow
//                };

//                await _unitOfWork.Users.AddAsync(user);
//                await _unitOfWork.SaveChangesAsync();

//                 Generar tokens
//                var accessToken = _tokenService.GenerateAccessToken(user);
//                var refreshToken = _tokenService.GenerateRefreshToken();

//                 Guardar refresh token
//                var refreshTokenEntity = new RefreshToken
//                {
//                    Token = refreshToken,
//                    UserId = user.Id,
//                    ExpiryDate = DateTime.UtcNow.AddDays(7),
//                    CreatedAt = DateTime.UtcNow
//                };

//                await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity);
//                await _unitOfWork.SaveChangesAsync();

//                var response = new AuthResponseDto
//                {
//                    Token = accessToken,
//                    RefreshToken = refreshToken,
//                    User = new UserResponseDto
//                    {
//                        Id = user.Id.ToString(),
//                        Name = user.Name,
//                        Email = user.Email,
//                        Role = user.Role.ToString(),
//                        CreatedAt = user.CreatedAt
//                    }
//                };

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error durante el registro");
//                return StatusCode(500, new { message = "Error interno del servidor" });
//            }
//        }

//        [HttpPost("login")]
//        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
//        {
//            try
//            {
//                var user = await _unitOfWork.Users.GetAsync(u => u.Email == loginDto.Email);
//                if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
//                {
//                    return Unauthorized(new { message = "Credenciales inválidas" });
//                }

//                 Generar tokens
//                var accessToken = _tokenService.GenerateAccessToken(user);
//                var refreshToken = _tokenService.GenerateRefreshToken();

//                 Revocar tokens anteriores
//                var existingTokens = await _unitOfWork.RefreshTokens.FindAsync(rt => rt.UserId == user.Id && !rt.IsRevoked);
//                foreach (var token in existingTokens)
//                {
//                    token.IsRevoked = true;
//                    await _unitOfWork.RefreshTokens.UpdateAsync(token);
//                }

//                 Crear nuevo refresh token
//                var refreshTokenEntity = new RefreshToken
//                {
//                    Token = refreshToken,
//                    UserId = user.Id,
//                    ExpiryDate = DateTime.UtcNow.AddDays(7),
//                    CreatedAt = DateTime.UtcNow
//                };

//                await _unitOfWork.RefreshTokens.AddAsync(refreshTokenEntity);
//                await _unitOfWork.SaveChangesAsync();

//                var response = new AuthResponseDto
//                {
//                    Token = accessToken,
//                    RefreshToken = refreshToken,
//                    User = new UserResponseDto
//                    {
//                        Id = user.Id.ToString(),
//                        Name = user.Name,
//                        Email = user.Email,
//                        Role = user.Role.ToString(),
//                        CreatedAt = user.CreatedAt
//                    }
//                };

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error durante el login");
//                return StatusCode(500, new { message = "Error interno del servidor" });
//            }
//        }

//        [HttpPost("refresh-token")]
//        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
//        {
//            try
//            {
//                var refreshTokenEntity = await _unitOfWork.RefreshTokens.GetAsync(rt => 
//                    rt.Token == refreshTokenDto.RefreshToken && 
//                    !rt.IsRevoked && 
//                    rt.ExpiryDate > DateTime.UtcNow);

//                if (refreshTokenEntity == null)
//                {
//                    return Unauthorized(new { message = "Token de actualización inválido" });
//                }

//                var user = await _unitOfWork.Users.GetByIdAsync(refreshTokenEntity.UserId);
//                if (user == null)
//                {
//                    return Unauthorized(new { message = "Usuario no encontrado" });
//                }

//                 Generar nuevos tokens
//                var newAccessToken = _tokenService.GenerateAccessToken(user);
//                var newRefreshToken = _tokenService.GenerateRefreshToken();

//                 Revocar el token actual
//                refreshTokenEntity.IsRevoked = true;
//                await _unitOfWork.RefreshTokens.UpdateAsync(refreshTokenEntity);

//                 Crear nuevo refresh token
//                var newRefreshTokenEntity = new RefreshToken
//                {
//                    Token = newRefreshToken,
//                    UserId = user.Id,
//                    ExpiryDate = DateTime.UtcNow.AddDays(7),
//                    CreatedAt = DateTime.UtcNow
//                };

//                await _unitOfWork.RefreshTokens.AddAsync(newRefreshTokenEntity);
//                await _unitOfWork.SaveChangesAsync();

//                var response = new AuthResponseDto
//                {
//                    Token = newAccessToken,
//                    RefreshToken = newRefreshToken,
//                    User = new UserResponseDto
//                    {
//                        Id = user.Id.ToString(),
//                        Name = user.Name,
//                        Email = user.Email,
//                        Role = user.Role.ToString(),
//                        CreatedAt = user.CreatedAt
//                    }
//                };

//                return Ok(response);
//            }
//            catch (Exception ex)
//            {
//                _logger.LogError(ex, "Error durante la actualización del token");
//                return StatusCode(500, new { message = "Error interno del servidor" });
//            }
//        }
//    }
//}
