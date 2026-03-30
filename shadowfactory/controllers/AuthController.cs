using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using shadowfactory.Data;
using shadowfactory.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;

        public AuthController(
            ECoVDbContext context,
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Email and password are required"
                    });
                }

                var email = request.Email.Trim().ToLowerInvariant();

                var user = await _context.Users
                    .Include(u => u.Factory)
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == email);

                if (user == null || !user.IsActive)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }

                if (!VerifyPassword(request.Password, user.Salt, user.PasswordHash))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid credentials"
                    });
                }

                user.LastLogin = DateTime.UtcNow;
                user.UpdatedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                var token = GenerateJwtToken(user.Id, user.Email, user.Role, user.FactoryId);

                var response = new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = token,
                    User = new UserDto
                    {
                        Id = user.Id,
                        Email = user.Email,
                        FullName = user.FullName,
                        Role = user.Role,
                        FactoryId = user.FactoryId,
                        Phone = user.Phone,
                        EmailNotifications = user.EmailNotifications,
                        AppNotifications = user.AppNotifications,
                        PublicProfile = user.PublicProfile,
                        LastLogin = user.LastLogin,
                        RegistrationDate = user.RegistrationDate ?? user.CreatedAt
                    },
                    Factory = user.Factory == null ? null : new FactoryDto
                    {
                        Id = user.Factory.Id,
                        FactoryName = user.Factory.FactoryName,
                        FactoryNameEn = user.Factory.FactoryNameEn,
                        IndustryType = user.Factory.IndustryType,
                        Location = user.Factory.Location,
                        Address = user.Factory.Address,
                        Phone = user.Factory.Phone,
                        Fax = user.Factory.Fax,
                        Email = user.Factory.Email,
                        Website = user.Factory.Website,
                        OwnerName = user.Factory.OwnerName,
                        OwnerPhone = user.Factory.OwnerPhone,
                        OwnerEmail = user.Factory.OwnerEmail,
                        TaxNumber = user.Factory.TaxNumber,
                        RegistrationNumber = user.Factory.RegistrationNumber,
                        EstablishmentYear = user.Factory.EstablishmentYear,
                        EmployeeCount = user.Factory.EmployeeCount ?? user.Factory.NumberOfEmployees,
                        FactorySize = user.Factory.FactorySize ?? 0,
                        ProductionCapacity = user.Factory.ProductionCapacity,
                        LogoUrl = user.Factory.LogoUrl,
                        IsVerified = user.Factory.IsVerified,
                        Status = user.Factory.Status,
                        DescriptionAr = user.Factory.DescriptionAr,
                        DescriptionEn = user.Factory.DescriptionEn,
                        Rating = user.Factory.Rating,
                        TotalReviews = user.Factory.TotalReviews,
                        Latitude = user.Factory.Latitude,
                        Longitude = user.Factory.Longitude,
                        CreatedAt = user.Factory.CreatedAt,
                        UpdatedAt = user.Factory.UpdatedAt,
                        RegistrationDate = user.Factory.CreatedAt
                    }
                };

                return Ok(new ApiResponse<LoginResponse>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error during login");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Internal server error"
                });
            }
        }

        [HttpGet("test-db")]
        public async Task<IActionResult> TestDb()
        {
            try
            {
                var canConnect = await _context.Database.CanConnectAsync();
                var users = await _context.Users.CountAsync();
                var factories = await _context.Factories.CountAsync();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Database connection successful",
                    Data = new
                    {
                        canConnect,
                        users,
                        factories,
                        serverTime = DateTime.UtcNow
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error testing database connection");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Database connection failed",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        private bool VerifyPassword(string plainPassword, string saltBase64, string storedHashBase64)
        {
            try
            {
                var saltBytes = Convert.FromBase64String(saltBase64);
                using var deriveBytes = new Rfc2898DeriveBytes(
                    plainPassword,
                    saltBytes,
                    69,
                    HashAlgorithmName.SHA256);
                var hashBytes = deriveBytes.GetBytes(24);
                var computedHash = Convert.ToBase64String(hashBytes);
                return computedHash == storedHashBase64;
            }
            catch
            {
                return false;
            }
        }

        private string GenerateJwtToken(long userId, string email, string role, long? factoryId)
        {
            var jwtKey = _configuration["Jwt:Key"] ?? "YourSuperSecretKeyForTesting1234567890!@#$%";
            var jwtIssuer = _configuration["Jwt:Issuer"] ?? "shadowfactory";
            var jwtAudience = _configuration["Jwt:Audience"] ?? "shadowfactory-client";
            var expireHours = int.TryParse(_configuration["Jwt:ExpireHours"], out var h) ? h : 8;

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Email, email),
                new(ClaimTypes.Role, role)
            };

            if (factoryId.HasValue)
            {
                claims.Add(new Claim("FactoryId", factoryId.Value.ToString()));
            }

            var token = new JwtSecurityToken(
                issuer: jwtIssuer,
                audience: jwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expireHours),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}