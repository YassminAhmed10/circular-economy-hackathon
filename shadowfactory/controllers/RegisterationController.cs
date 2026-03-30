using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using shadowfactory.Models.DTOs;
using System.Data;
using System.Security.Cryptography;
using System.Text;

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

                // ✅ Validation يدوي بدلاً من الاعتماد على Data Annotations فقط
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
                            var cmd = connection.CreateCommand();
                            cmd.Transaction = transaction;

                            // ── Check email ──
                            cmd.CommandText = "SELECT COUNT(*) FROM Factories WHERE Email = @Email";
                            cmd.Parameters.AddWithValue("@Email", request.Email.Trim().ToLower());
                            var emailExists = (int)await cmd.ExecuteScalarAsync() > 0;
                            if (emailExists)
                                return Conflict(new ApiResponse { Success = false, Message = "Email already registered" });

                            // ── Check tax number ──
                            cmd.CommandText = "SELECT COUNT(*) FROM Factories WHERE TaxNumber = @TaxNumber";
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@TaxNumber", request.TaxNumber.Trim());
                            var taxExists = (int)await cmd.ExecuteScalarAsync() > 0;
                            if (taxExists)
                                return Conflict(new ApiResponse { Success = false, Message = "Tax number already registered" });

                            // ── Check registration number ──
                            cmd.CommandText = "SELECT COUNT(*) FROM Factories WHERE RegistrationNumber = @RegistrationNumber";
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@RegistrationNumber", request.RegistrationNumber.Trim());
                            var regExists = (int)await cmd.ExecuteScalarAsync() > 0;
                            if (regExists)
                                return Conflict(new ApiResponse { Success = false, Message = "Registration number already registered" });

                            var (salt, hash) = HashPassword(request.Password);

                            // ✅ تسجيل معلومات الصورة
                            _logger.LogInformation("LogoBase64 received: {HasLogo}, Length: {Length}",
                                !string.IsNullOrEmpty(request.LogoBase64),
                                request.LogoBase64?.Length ?? 0);

                            // ✅ التأكد من سنة التأسيس
                            int currentYear = DateTime.UtcNow.Year;
                            int? safeEstablishmentYear = request.EstablishmentYear.HasValue
                                ? Math.Min(request.EstablishmentYear.Value, currentYear)
                                : (int?)null;

                            // ── Insert Factory ──
                            var insertFactorySql = @"
                                INSERT INTO Factories (
                                    FactoryName, FactoryNameEn, IndustryType, Location, Address,
                                    Phone, Fax, Email, Website, OwnerName, OwnerPhone, OwnerEmail,
                                    TaxNumber, RegistrationNumber, EstablishmentYear, NumberOfEmployees,
                                    FactorySize, ProductionCapacity, LogoUrl, DescriptionAr, DescriptionEn,
                                    IsVerified, Status, CreatedAt, UpdatedAt
                                ) VALUES (
                                    @FactoryName, @FactoryNameEn, @IndustryType, @Location, @Address,
                                    @Phone, @Fax, @Email, @Website, @OwnerName, @OwnerPhone, @OwnerEmail,
                                    @TaxNumber, @RegistrationNumber, @EstablishmentYear, @NumberOfEmployees,
                                    @FactorySize, @ProductionCapacity, @LogoUrl, @DescriptionAr, @DescriptionEn,
                                    0, 'Pending', GETUTCDATE(), GETUTCDATE()
                                );
                                SELECT SCOPE_IDENTITY();";

                            cmd.CommandText = insertFactorySql;
                            cmd.Parameters.Clear();
                            cmd.Parameters.AddWithValue("@FactoryName", request.FactoryName.Trim());
                            cmd.Parameters.AddWithValue("@FactoryNameEn", (object?)(request.FactoryNameEn?.Trim()) ?? request.FactoryName.Trim());
                            cmd.Parameters.AddWithValue("@IndustryType", request.IndustryType.Trim());
                            cmd.Parameters.AddWithValue("@Location", request.Location.Trim());
                            cmd.Parameters.AddWithValue("@Address", request.Address.Trim());
                            cmd.Parameters.AddWithValue("@Phone", request.Phone.Trim());

                            // ✅ Fax و Website: null-safe
                            cmd.Parameters.AddWithValue("@Fax", string.IsNullOrWhiteSpace(request.Fax) ? DBNull.Value : (object)request.Fax.Trim());
                            cmd.Parameters.AddWithValue("@Email", request.Email.Trim().ToLower());
                            cmd.Parameters.AddWithValue("@Website", string.IsNullOrWhiteSpace(request.Website) ? DBNull.Value : (object)request.Website.Trim());
                            cmd.Parameters.AddWithValue("@OwnerName", request.OwnerName.Trim());

                            // ✅ OwnerPhone: لو فاضي، استخدم Phone المصنع
                            var ownerPhone = string.IsNullOrWhiteSpace(request.OwnerPhone)
                                ? request.Phone.Trim()
                                : request.OwnerPhone.Trim();
                            cmd.Parameters.AddWithValue("@OwnerPhone", ownerPhone);

                            cmd.Parameters.AddWithValue("@OwnerEmail", string.IsNullOrWhiteSpace(request.OwnerEmail) ? DBNull.Value : (object)request.OwnerEmail.Trim().ToLower());
                            cmd.Parameters.AddWithValue("@TaxNumber", request.TaxNumber.Trim());
                            cmd.Parameters.AddWithValue("@RegistrationNumber", request.RegistrationNumber.Trim());
                            cmd.Parameters.AddWithValue("@EstablishmentYear", safeEstablishmentYear.HasValue ? (object)safeEstablishmentYear.Value : DBNull.Value);
                            cmd.Parameters.AddWithValue("@NumberOfEmployees", request.NumberOfEmployees.HasValue ? (object)request.NumberOfEmployees.Value : DBNull.Value);
                            cmd.Parameters.AddWithValue("@FactorySize", request.FactorySize > 0 ? request.FactorySize : 1000);
                            cmd.Parameters.AddWithValue("@ProductionCapacity", request.ProductionCapacity);

                            // ✅ LogoUrl: حفظ الـ Base64 مباشرة في الـ DB
                            cmd.Parameters.AddWithValue("@LogoUrl",
                                string.IsNullOrWhiteSpace(request.LogoBase64)
                                    ? DBNull.Value
                                    : (object)request.LogoBase64);

                            // ✅ DescriptionAr / DescriptionEn
                            cmd.Parameters.AddWithValue("@DescriptionAr",
                                string.IsNullOrWhiteSpace(request.DescriptionAr)
                                    ? DBNull.Value
                                    : (object)request.DescriptionAr.Trim());
                            cmd.Parameters.AddWithValue("@DescriptionEn",
                                string.IsNullOrWhiteSpace(request.DescriptionEn)
                                    ? DBNull.Value
                                    : (object)request.DescriptionEn.Trim());

                            var factoryId = Convert.ToInt64(await cmd.ExecuteScalarAsync());
                            _logger.LogInformation("Factory inserted with ID: {FactoryId}", factoryId);

                            // ── Insert User ──
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
                            _logger.LogInformation("User inserted with ID: {UserId}", userId);

                            // ── ✅ التحقق إن الصورة اتحفظت فعلاً ──
                            var checkCmd = connection.CreateCommand();
                            checkCmd.Transaction = transaction;
                            checkCmd.CommandText = "SELECT LEN(ISNULL(LogoUrl, '')) FROM Factories WHERE Id = @Id";
                            checkCmd.Parameters.AddWithValue("@Id", factoryId);
                            var logoLength = Convert.ToInt32(await checkCmd.ExecuteScalarAsync());
                            _logger.LogInformation("Logo saved in DB - Length: {LogoLength} chars", logoLength);

                            // ── Insert Waste Data ──
                            if (request.RegistrationPurpose?.Count > 0)
                            {
                                var wasteTypeIds = await GetWasteTypeIds(connection, transaction);

                                // بيع مخلفات
                                if (request.RegistrationPurpose.Contains("sell") && request.WasteTypesToSell?.Count > 0)
                                {
                                    foreach (var wasteName in request.WasteTypesToSell)
                                    {
                                        if (wasteTypeIds.TryGetValue(wasteName.ToLower(), out int wasteTypeId))
                                        {
                                            cmd.CommandText = @"
                                                INSERT INTO FactoryWastes (
                                                    FactoryId, WasteTypeId, Quantity, Unit, Frequency, Description, CreatedAt, UpdatedAt
                                                ) VALUES (
                                                    @FactoryId, @WasteTypeId, @Quantity, @Unit, @Frequency, @Description, GETUTCDATE(), GETUTCDATE()
                                                )";
                                            cmd.Parameters.Clear();
                                            cmd.Parameters.AddWithValue("@FactoryId", factoryId);
                                            cmd.Parameters.AddWithValue("@WasteTypeId", wasteTypeId);
                                            cmd.Parameters.AddWithValue("@Quantity", request.WasteAmountToSell ?? 0);
                                            cmd.Parameters.AddWithValue("@Unit", request.WasteUnitToSell ?? "ton");
                                            cmd.Parameters.AddWithValue("@Frequency", request.SellFrequency ?? "monthly");
                                            cmd.Parameters.AddWithValue("@Description",
                                                string.IsNullOrWhiteSpace(request.WasteDescription)
                                                    ? DBNull.Value
                                                    : (object)request.WasteDescription);
                                            await cmd.ExecuteNonQueryAsync();
                                        }
                                        else
                                        {
                                            _logger.LogWarning("Waste type not found: {WasteName}", wasteName);
                                        }
                                    }
                                }

                                // شراء مخلفات
                                if (request.RegistrationPurpose.Contains("buy") && request.WasteTypesToBuy?.Count > 0)
                                {
                                    foreach (var wasteName in request.WasteTypesToBuy)
                                    {
                                        if (wasteTypeIds.TryGetValue(wasteName.ToLower(), out int wasteTypeId))
                                        {
                                            cmd.CommandText = @"
                                                INSERT INTO FactoryPurchases (
                                                    FactoryId, WasteTypeId, Quantity, Unit, Frequency, Purpose, CreatedAt, UpdatedAt
                                                ) VALUES (
                                                    @FactoryId, @WasteTypeId, @Quantity, @Unit, @Frequency, @Purpose, GETUTCDATE(), GETUTCDATE()
                                                )";
                                            cmd.Parameters.Clear();
                                            cmd.Parameters.AddWithValue("@FactoryId", factoryId);
                                            cmd.Parameters.AddWithValue("@WasteTypeId", wasteTypeId);
                                            cmd.Parameters.AddWithValue("@Quantity", request.WasteAmountToBuy ?? 0);
                                            cmd.Parameters.AddWithValue("@Unit", request.WasteUnitToBuy ?? "ton");
                                            cmd.Parameters.AddWithValue("@Frequency", request.BuyFrequency ?? "monthly");
                                            cmd.Parameters.AddWithValue("@Purpose",
                                                string.IsNullOrWhiteSpace(request.BuyingPurpose)
                                                    ? DBNull.Value
                                                    : (object)request.BuyingPurpose);
                                            await cmd.ExecuteNonQueryAsync();
                                        }
                                        else
                                        {
                                            _logger.LogWarning("Waste type not found: {WasteName}", wasteName);
                                        }
                                    }
                                }
                            }

                            transaction.Commit();
                            _logger.LogInformation("Registration successful. FactoryId: {FactoryId}, UserId: {UserId}", factoryId, userId);

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
                            _logger.LogError(ex, "Transaction failed, rolled back.");
                            throw;
                        }
                    }
                }
            }
            catch (SqlException sqlEx)
            {
                _logger.LogError(sqlEx, "SQL Error registering factory");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "Database error occurred",
                    Errors = new List<string> { sqlEx.Message }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering factory");
                return StatusCode(500, new ApiResponse
                {
                    Success = false,
                    Message = "An error occurred",
                    Errors = new List<string> { ex.Message }
                });
            }
        }

        private async Task<Dictionary<string, int>> GetWasteTypeIds(SqlConnection connection, SqlTransaction transaction)
        {
            var dict = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            var cmd = connection.CreateCommand();
            cmd.Transaction = transaction;
            cmd.CommandText = "SELECT Id, NameEn, NameAr FROM WasteTypes";
            using (var reader = await cmd.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    int id = reader.GetInt32(0);
                    string nameEn = reader.GetString(1).ToLower();
                    string nameAr = reader.GetString(2).ToLower();
                    if (!dict.ContainsKey(nameEn)) dict[nameEn] = id;
                    if (!dict.ContainsKey(nameAr)) dict[nameAr] = id;
                }
            }
            return dict;
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
                password, saltBytes, 69, HashAlgorithmName.SHA256))
            {
                byte[] hashBytes = deriveBytes.GetBytes(24);
                return (salt, Convert.ToBase64String(hashBytes));
            }
        }

        private ValidationResult ValidateFactoryRequest(FactoryRegistrationRequest request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.FactoryName))
                errors.Add("Factory name is required");
            if (string.IsNullOrWhiteSpace(request.IndustryType))
                errors.Add("Industry type is required");
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
            if (string.IsNullOrWhiteSpace(request.TaxNumber))
                errors.Add("Tax number is required");
            if (string.IsNullOrWhiteSpace(request.RegistrationNumber))
                errors.Add("Registration number is required");
            if (string.IsNullOrWhiteSpace(request.Password))
                errors.Add("Password is required");
            else if (request.Password.Length < 6)
                errors.Add("Password must be at least 6 characters");

            // ✅ التحقق من سنة التأسيس
            if (request.EstablishmentYear.HasValue)
            {
                if (request.EstablishmentYear.Value < 1900 || request.EstablishmentYear.Value > DateTime.UtcNow.Year)
                    errors.Add($"Establishment year must be between 1900 and {DateTime.UtcNow.Year}");
            }

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
                return addr.Address == email?.Trim().ToLower();
            }
            catch { return false; }
        }

        private class ValidationResult
        {
            public bool IsValid { get; set; }
            public List<string> Errors { get; set; } = new();
        }

        #endregion
    }
}