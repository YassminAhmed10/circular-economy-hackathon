using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using shadowfactory.Models.DTOs;
using System.Data;
using System.Security.Cryptography;
using System.Text;
using System.Text.RegularExpressions;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<RegisterController> _logger;
        private readonly string _connectionString;

        public RegisterController(
            IConfiguration configuration,
            ILogger<RegisterController> logger)
        {
            _configuration = configuration;
            _logger = logger;
            _connectionString = configuration.GetConnectionString("DefaultConnection") ?? "";
        }

        [HttpPost("factory")]
        public async Task<IActionResult> RegisterFactory([FromBody] FactoryRegistrationRequest request)
        {
            try
            {
                _logger.LogInformation("Starting factory registration for: {FactoryName}", request.FactoryName);

                // Validate request
                var validationResult = ValidateFactoryRequest(request);
                if (!validationResult.IsValid)
                {
                    return BadRequest(new ApiResponse
                    {
                        Success = false,
                        Message = "Validation failed",
                        Errors = validationResult.Errors
                    });
                }

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var transaction = connection.BeginTransaction())
                    {
                        try
                        {
                            // Check for duplicates
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;

                            // Check email
                            cmd.CommandText = "SELECT COUNT(*) FROM Factories WHERE Email = @Email";
                            cmd.Parameters.AddWithValue("@Email", request.Email.Trim().ToLower());
                            var emailExists = (int)await cmd.ExecuteScalarAsync() > 0;
                            if (emailExists)
                            {
                                return Conflict(new ApiResponse { Success = false, Message = "Email already registered" });
                            }

                            // Check tax number
                            cmd.CommandText = "SELECT COUNT(*) FROM Factories WHERE TaxNumber = @TaxNumber";
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@TaxNumber", request.TaxNumber.Trim());
                            var taxExists = (int)await cmd.ExecuteScalarAsync() > 0;
                            if (taxExists)
                            {
                                return Conflict(new ApiResponse { Success = false, Message = "Tax number already registered" });
                            }

                            // Check registration number
                            cmd.CommandText = "SELECT COUNT(*) FROM Factories WHERE RegistrationNumber = @RegistrationNumber";
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@RegistrationNumber", request.RegistrationNumber.Trim());
                            var regExists = (int)await cmd.ExecuteScalarAsync() > 0;
                            if (regExists)
                            {
                                return Conflict(new ApiResponse { Success = false, Message = "Registration number already registered" });
                            }

                            // Generate salt and hash for password
                            var (salt, hash) = HashPassword(request.Password);

                            // Insert factory - using ONLY columns that definitely exist
                            var insertFactorySql = @"
                                INSERT INTO Factories (
                                    FactoryName, FactoryNameEn, IndustryType, Location, Address,
                                    Phone, Fax, Email, Website, OwnerName, OwnerPhone, OwnerEmail,
                                    TaxNumber, RegistrationNumber, EstablishmentYear, NumberOfEmployees,
                                    FactorySize, ProductionCapacity, LogoUrl, IsVerified, Status,
                                    CreatedAt, UpdatedAt
                                ) VALUES (
                                    @FactoryName, @FactoryNameEn, @IndustryType, @Location, @Address,
                                    @Phone, @Fax, @Email, @Website, @OwnerName, @OwnerPhone, @OwnerEmail,
                                    @TaxNumber, @RegistrationNumber, @EstablishmentYear, @NumberOfEmployees,
                                    @FactorySize, @ProductionCapacity, @LogoUrl, 0, 'Pending',
                                    GETUTCDATE(), GETUTCDATE()
                                );
                                SELECT SCOPE_IDENTITY();";

                            cmd.CommandText = insertFactorySql;
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@FactoryName", request.FactoryName.Trim());
                            cmd.Parameters.AddWithValue("@FactoryNameEn", request.FactoryNameEn?.Trim() ?? request.FactoryName.Trim());
                            cmd.Parameters.AddWithValue("@IndustryType", request.IndustryType.Trim());
                            cmd.Parameters.AddWithValue("@Location", request.Location.Trim());
                            cmd.Parameters.AddWithValue("@Address", request.Address.Trim());
                            cmd.Parameters.AddWithValue("@Phone", request.Phone.Trim());
                            cmd.Parameters.AddWithValue("@Fax", string.IsNullOrEmpty(request.Fax) ? DBNull.Value : request.Fax.Trim());
                            cmd.Parameters.AddWithValue("@Email", request.Email.Trim().ToLower());
                            cmd.Parameters.AddWithValue("@Website", string.IsNullOrEmpty(request.Website) ? DBNull.Value : request.Website.Trim());
                            cmd.Parameters.AddWithValue("@OwnerName", request.OwnerName.Trim());
                            cmd.Parameters.AddWithValue("@OwnerPhone", request.OwnerPhone.Trim());
                            cmd.Parameters.AddWithValue("@OwnerEmail", string.IsNullOrEmpty(request.OwnerEmail) ? DBNull.Value : request.OwnerEmail.Trim().ToLower());
                            cmd.Parameters.AddWithValue("@TaxNumber", request.TaxNumber.Trim());
                            cmd.Parameters.AddWithValue("@RegistrationNumber", request.RegistrationNumber.Trim());
                            cmd.Parameters.AddWithValue("@EstablishmentYear", request.EstablishmentYear ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@NumberOfEmployees", request.NumberOfEmployees ?? (object)DBNull.Value);
                            cmd.Parameters.AddWithValue("@FactorySize", request.FactorySize);
                            cmd.Parameters.AddWithValue("@ProductionCapacity", request.ProductionCapacity);
                            cmd.Parameters.AddWithValue("@LogoUrl", DBNull.Value); // Skip logo for now

                            var factoryId = Convert.ToInt64(await cmd.ExecuteScalarAsync());

                            // Insert user
                            var insertUserSql = @"
                                INSERT INTO Users (
                                    Email, FullName, Salt, PasswordHash, Role, FactoryId,
                                    IsActive, CreatedAt, UpdatedAt, Phone
                                ) VALUES (
                                    @Email, @FullName, @Salt, @PasswordHash, 'FactoryOwner', @FactoryId,
                                    1, GETUTCDATE(), GETUTCDATE(), @Phone
                                );
                                SELECT SCOPE_IDENTITY();";

                            cmd.CommandText = insertUserSql;
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@Email", request.Email.Trim().ToLower());
                            cmd.Parameters.AddWithValue("@FullName", request.OwnerName.Trim());
                            cmd.Parameters.AddWithValue("@Salt", salt);
                            cmd.Parameters.AddWithValue("@PasswordHash", hash);
                            cmd.Parameters.AddWithValue("@FactoryId", factoryId);
                            cmd.Parameters.AddWithValue("@Phone", request.Phone.Trim());

                            var userId = Convert.ToInt64(await cmd.ExecuteScalarAsync());

                            transaction.Commit();

                            _logger.LogInformation("Factory registered successfully. ID: {FactoryId}, User ID: {UserId}", factoryId, userId);

                            return Ok(new ApiResponse<FactoryRegistrationResponse>
                            {
                                Success = true,
                                Message = "Factory registered successfully.",
                                Data = new FactoryRegistrationResponse
                                {
                                    FactoryId = factoryId,
                                    UserId = userId,
                                    Message = "Registration completed successfully.",
                                    Status = "Pending",
                                    Success = true,
                                    RegisteredAt = DateTime.UtcNow
                                }
                            });
                        }
                        catch (Exception ex)
                        {
                            transaction.Rollback();
                            throw;
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError(sqlEx, "SQL Error registering factory: {FactoryName}", request.FactoryName);

                // Get the actual error message
                var errorMsg = sqlEx.Message;
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Database error occurred",
                    Errors = new List<string> { errorMsg }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering factory: {FactoryName}", request.FactoryName);
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        [HttpGet("debug-db")]
        public async Task<IActionResult> DebugDatabase()
        {
            try
            {
                var result = new Dictionary<string, object>();

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Get Factories columns
                    var cmd = connection.CreateCommand();
                    cmd.CommandText = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Factories' ORDER BY ORDINAL_POSITION";
                    var factoryColumns = new List<string>();
                    using (var reader = await cmd.ExecuteReaderAsync())
                    {
                        while (await reader.ReadAsync())
                        {
                            factoryColumns.Add(reader.GetString(0));
                        }
                    }
                    result["Factories Columns"] = factoryColumns;

                    // Check if Email exists
                    result["Has Email"] = factoryColumns.Contains("Email");
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        #region Helper Methods

        private (string salt, string hash) HashPassword(string password)
        {
            byte[] saltBytes = new byte[16];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(saltBytes);
            }
            string salt = Convert.ToBase64String(saltBytes);

            using (var deriveBytes = new Rfc2898DeriveBytes(
                password,
                saltBytes,
                69,
                HashAlgorithmName.SHA256))
            {
                byte[] hashBytes = deriveBytes.GetBytes(24);
                string hash = Convert.ToBase64String(hashBytes);
                return (salt, hash);
            }
        }

        private ValidationResult ValidateFactoryRequest(FactoryRegistrationRequest request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.FactoryName))
                errors.Add("Factory name is required");
            if (string.IsNullOrWhiteSpace(request.Location))
                errors.Add("Location is required");
            if (string.IsNullOrWhiteSpace(request.Address))
                errors.Add("Address is required");
            if (string.IsNullOrWhiteSpace(request.Phone))
                errors.Add("Phone is required");
            if (string.IsNullOrWhiteSpace(request.Email))
                errors.Add("Email is required");
            if (!IsValidEmail(request.Email))
                errors.Add("Invalid email format");
            if (string.IsNullOrWhiteSpace(request.OwnerName))
                errors.Add("Owner name is required");
            if (string.IsNullOrWhiteSpace(request.OwnerPhone))
                errors.Add("Owner phone is required");
            if (string.IsNullOrWhiteSpace(request.TaxNumber))
                errors.Add("Tax number is required");
            if (string.IsNullOrWhiteSpace(request.RegistrationNumber))
                errors.Add("Registration number is required");
            if (string.IsNullOrWhiteSpace(request.IndustryType))
                errors.Add("Industry type is required");
            if (request.FactorySize <= 0)
                errors.Add("Factory size must be greater than 0");
            if (request.ProductionCapacity <= 0)
                errors.Add("Production capacity must be greater than 0");
            if (string.IsNullOrWhiteSpace(request.Password))
                errors.Add("Password is required");
            else if (request.Password.Length < 6)
                errors.Add("Password must be at least 6 characters");

            return new ValidationResult
            {
                IsValid = errors.Count == 0,
                Errors = errors
            };
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private class ValidationResult
        {
            public bool IsValid { get; set; }
            public List<string> Errors { get; set; } = new List<string>();
        }

        #endregion
    }
}