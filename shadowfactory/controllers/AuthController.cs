using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.IdentityModel.Tokens;
using shadowfactory.Models.DTOs;
using System.Data;
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
        private readonly IConfiguration _configuration;
        private readonly ILogger<AuthController> _logger;
        private readonly string _connectionString;

        // Single constructor with null check
        public AuthController(
            IConfiguration configuration,
            ILogger<AuthController> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        /// <summary>
        /// SIMPLE LOGIN - PURE ADO.NET
        /// </summary>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            try
            {
                _logger.LogInformation("Login attempt for: {Email}", request.Email);

                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Email and password are required"
                    });
                }

                if (string.IsNullOrEmpty(_connectionString))
                {
                    return StatusCode(500, new ApiResponse
                    {
                        Success = false,
                        Message = "Database connection error"
                    });
                }

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                var sql = @"
                    SELECT 
                        Id, 
                        Email, 
                        FullName, 
                        PasswordHash, 
                        Salt, 
                        Role,
                        FactoryId, 
                        LastLogin, 
                        IsActive, 
                        CreatedAt, 
                        UpdatedAt,
                        Phone,
                        EmailNotifications,
                        AppNotifications,
                        PublicProfile,
                        RegistrationDate
                    FROM Users
                    WHERE LOWER(Email) = LOWER(@Email)";

                using var command = new SqlCommand(sql, connection);
                command.Parameters.AddWithValue("@Email", request.Email);

                using var reader = await command.ExecuteReaderAsync();

                if (!reader.HasRows)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    });
                }

                await reader.ReadAsync();

                // Read basic columns
                var userId = reader.GetInt64(0);
                var email = reader.GetString(1);
                var fullName = reader.GetString(2);
                var passwordHash = reader.GetString(3);
                var salt = reader.GetString(4);
                var role = reader.GetString(5);
                var factoryId = reader.IsDBNull(6) ? (long?)null : reader.GetInt64(6);
                var lastLogin = reader.IsDBNull(7) ? (DateTime?)null : reader.GetDateTime(7);
                var isActive = reader.GetBoolean(8);
                var createdAt = reader.GetDateTime(9);
                var updatedAt = reader.GetDateTime(10);

                // Read new columns
                var phone = reader.IsDBNull(11) ? null : reader.GetString(11);
                var emailNotifications = reader.IsDBNull(12) ? true : reader.GetBoolean(12);
                var appNotifications = reader.IsDBNull(13) ? true : reader.GetBoolean(13);
                var publicProfile = reader.IsDBNull(14) ? true : reader.GetBoolean(14);
                var registrationDate = reader.IsDBNull(15) ? createdAt : reader.GetDateTime(15);

                await reader.CloseAsync();

                // Verify password
                if (!VerifyPassword(request.Password, passwordHash, salt))
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Invalid email or password"
                    });
                }

                if (!isActive)
                {
                    return Unauthorized(new ApiResponse
                    {
                        Success = false,
                        Message = "Account is inactive"
                    });
                }

                // Update last login
                var updateSql = "UPDATE Users SET LastLogin = GETDATE() WHERE Id = @Id";
                using var updateCommand = new SqlCommand(updateSql, connection);
                updateCommand.Parameters.AddWithValue("@Id", userId);
                await updateCommand.ExecuteNonQueryAsync();

                // Generate token
                var token = GenerateToken(userId, email, fullName, role, factoryId);

                // Get factory info if exists
                FactoryDto factoryDto = null;
                if (factoryId.HasValue)
                {
                    var factorySql = @"
                        SELECT Id, FactoryName, FactoryNameEn, IndustryType, Location, 
                               IsVerified, Status, DescriptionAr, DescriptionEn, Rating, 
                               TotalReviews, Latitude, Longitude
                        FROM Factories 
                        WHERE Id = @FactoryId";

                    using var factoryCommand = new SqlCommand(factorySql, connection);
                    factoryCommand.Parameters.AddWithValue("@FactoryId", factoryId.Value);

                    using var factoryReader = await factoryCommand.ExecuteReaderAsync();
                    if (await factoryReader.ReadAsync())
                    {
                        factoryDto = new FactoryDto
                        {
                            Id = factoryReader.GetInt64(0),
                            FactoryName = factoryReader.GetString(1),
                            FactoryNameEn = factoryReader.GetString(2),
                            IndustryType = factoryReader.GetString(3),
                            Location = factoryReader.GetString(4),
                            IsVerified = factoryReader.GetBoolean(5), // This maps to IsVerified in DB
                            Status = factoryReader.GetString(6),
                            DescriptionAr = factoryReader.IsDBNull(7) ? null : factoryReader.GetString(7),
                            DescriptionEn = factoryReader.IsDBNull(8) ? null : factoryReader.GetString(8),
                            Rating = factoryReader.IsDBNull(9) ? null : factoryReader.GetDecimal(9),
                            TotalReviews = factoryReader.IsDBNull(10) ? null : factoryReader.GetInt32(10),
                            Latitude = factoryReader.IsDBNull(11) ? null : factoryReader.GetDecimal(11),
                            Longitude = factoryReader.IsDBNull(12) ? null : factoryReader.GetDecimal(12)
                        };
                    }
                    await factoryReader.CloseAsync();
                }

                return Ok(new ApiResponse<LoginResponse>
                {
                    Success = true,
                    Message = "Login successful",
                    Data = new LoginResponse
                    {
                        Success = true,
                        Message = "Login successful",
                        Token = token,
                        User = new UserDto
                        {
                            Id = userId,
                            FullName = fullName,
                            Email = email,
                            Role = role,
                            FactoryId = factoryId,
                            LastLogin = DateTime.UtcNow,
                            Phone = phone,
                            EmailNotifications = emailNotifications,
                            AppNotifications = appNotifications,
                            PublicProfile = publicProfile,
                            RegistrationDate = registrationDate
                        },
                        Factory = factoryDto
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login error for {Email}", request.Email);
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Login error",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        /// <summary>
        /// Test database connection and structure
        /// </summary>
        [HttpGet("test-db")]
        public async Task<IActionResult> TestDatabase()
        {
            try
            {
                if (string.IsNullOrEmpty(_connectionString))
                {
                    return Ok(new { error = "No connection string" });
                }

                using var connection = new SqlConnection(_connectionString);
                await connection.OpenAsync();

                // Test 1: Check table exists
                var tableCheckSql = @"
                    SELECT CASE 
                        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Users') 
                        THEN 'Table exists' 
                        ELSE 'Table does not exist' 
                    END";

                using var tableCheckCommand = new SqlCommand(tableCheckSql, connection);
                var tableStatus = await tableCheckCommand.ExecuteScalarAsync() as string;

                // Test 2: Get column names
                var columnsSql = @"
                    SELECT COLUMN_NAME, DATA_TYPE 
                    FROM INFORMATION_SCHEMA.COLUMNS 
                    WHERE TABLE_NAME = 'Users' 
                    ORDER BY ORDINAL_POSITION";

                var columns = new List<object>();
                using (var columnsCommand = new SqlCommand(columnsSql, connection))
                using (var reader = await columnsCommand.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        columns.Add(new
                        {
                            Name = reader.GetString(0),
                            Type = reader.GetString(1)
                        });
                    }
                }

                // Test 3: Try to get first user
                var testSql = "SELECT TOP 1 Id, Email, FullName FROM Users";
                object firstUser = null;
                using (var testCommand = new SqlCommand(testSql, connection))
                using (var reader = await testCommand.ExecuteReaderAsync())
                {
                    if (await reader.ReadAsync())
                    {
                        firstUser = new
                        {
                            Id = reader.GetInt64(0),
                            Email = reader.GetString(1),
                            FullName = reader.GetString(2)
                        };
                    }
                }

                return Ok(new
                {
                    success = true,
                    tableStatus,
                    columns,
                    firstUser,
                    hasPhone = columns.Any(c => ((dynamic)c).Name == "Phone"),
                    hasEmailNotifications = columns.Any(c => ((dynamic)c).Name == "EmailNotifications"),
                    hasRegistrationDate = columns.Any(c => ((dynamic)c).Name == "RegistrationDate")
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    error = ex.Message
                });
            }
        }

        #region Helper Methods

        private string GenerateToken(long userId, string email, string fullName, string role, long? factoryId)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration["Jwt:Key"] ?? "YourSuperSecretKeyForJWTTokensMinimum32Characters"));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId.ToString()),
                new Claim(ClaimTypes.Email, email),
                new Claim(ClaimTypes.Name, fullName),
                new Claim(ClaimTypes.Role, role),
                new Claim("factoryId", factoryId?.ToString() ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"] ?? "shadowfactory",
                audience: _configuration["Jwt:Audience"] ?? "shadowfactory-client",
                claims: claims,
                expires: DateTime.UtcNow.AddHours(8),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private bool VerifyPassword(string password, string passwordHash, string salt)
        {
            try
            {
                if (!string.IsNullOrEmpty(passwordHash) && passwordHash.Contains(':'))
                {
                    var parts = passwordHash.Split(':');
                    if (parts.Length != 2) return false;
                    return VerifyPasswordPBKDF2(password, parts[0], parts[1]);
                }
                else if (!string.IsNullOrEmpty(salt) && !string.IsNullOrEmpty(passwordHash))
                {
                    return VerifyPasswordPBKDF2(password, salt, passwordHash);
                }
                return false;
            }
            catch
            {
                return false;
            }
        }

        private bool VerifyPasswordPBKDF2(string password, string saltBase64, string hashBase64)
        {
            try
            {
                var salt = Convert.FromBase64String(saltBase64);
                var storedHash = Convert.FromBase64String(hashBase64);

                using (var deriveBytes = new Rfc2898DeriveBytes(
                    password,
                    salt,
                    69,
                    HashAlgorithmName.SHA256))
                {
                    var enteredHash = deriveBytes.GetBytes(24);
                    return CryptographicOperations.FixedTimeEquals(enteredHash, storedHash);
                }
            }
            catch
            {
                return false;
            }
        }

        #endregion
    }
}
