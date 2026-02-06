using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Models.DTOs;
using shadowfactory.Services.Interfaces;
using System.Text.RegularExpressions;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegisterController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly IAuditService _auditService;
        private readonly ILogger<RegisterController> _logger;

        public RegisterController(
            ECoVDbContext context,
            IAuditService auditService,
            ILogger<RegisterController> logger)
        {
            _context = context;
            _auditService = auditService;
            _logger = logger;
        }

        /// <summary>
        /// Register a new factory
        /// </summary>
        /// <param name="request">Factory registration details</param>
        /// <returns>Registration response with factory ID</returns>
        [HttpPost("factory")]
        [ProducesResponseType(typeof(ApiResponse<FactoryRegistrationResponse>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
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

                // Check for duplicates
                var duplicateCheck = await CheckForDuplicates(request);
                if (!duplicateCheck.IsValid)
                {
                    return Conflict(new ApiResponse
                    {
                        Success = false,
                        Message = "Duplicate entry found",
                        Errors = duplicateCheck.Errors
                    });
                }

                // Create factory entity
                var factory = new Factory
                {
                    FactoryName = request.FactoryName.Trim(),
                    FactoryNameEn = request.FactoryNameEn?.Trim() ?? request.FactoryName.Trim(),
                    Location = request.Location.Trim(),
                    Address = request.Address.Trim(),
                    Phone = FormatPhoneNumber(request.Phone),
                    Fax = string.IsNullOrEmpty(request.Fax) ? null : FormatPhoneNumber(request.Fax),
                    Email = request.Email.Trim().ToLower(),
                    Website = string.IsNullOrEmpty(request.Website) ? "" : request.Website.Trim(),
                    OwnerName = request.OwnerName.Trim(),
                    OwnerPhone = FormatPhoneNumber(request.OwnerPhone),
                    OwnerEmail = string.IsNullOrEmpty(request.OwnerEmail) ? null : request.OwnerEmail.Trim().ToLower(),
                    TaxNumber = request.TaxNumber.Trim(),
                    RegistrationNumber = request.RegistrationNumber.Trim(),
                    IndustryType = request.IndustryType.Trim(),
                    EstablishmentYear = request.EstablishmentYear,
                    NumberOfEmployees = request.NumberOfEmployees,
                    FactorySize = request.FactorySize,
                    ProductionCapacity = request.ProductionCapacity,
                    Verified = false,
                    Status = "Pending",
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                // Handle logo if provided
                if (!string.IsNullOrEmpty(request.LogoBase64))
                {
                    factory.LogoUrl = await SaveLogoAsync(request.LogoBase64, request.FactoryName);
                }

                // Save factory to database
                await _context.Factories.AddAsync(factory);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Factory registered successfully. ID: {FactoryId}", factory.Id);

                // TODO: Implement verification token later
                // var verificationToken = GenerateVerificationToken(factory.Id);
                // await SaveVerificationTokenAsync(factory.Id, verificationToken);
                // await SendVerificationEmailAsync(factory.Email, factory.FactoryName, verificationToken);

                // Log audit trail
                await _auditService.LogAsync(
                    userId: null,
                    factoryId: factory.Id,
                    action: "Factory Registration",
                    entityType: "Factory",
                    entityId: factory.Id,
                    oldValues: null,
                    newValues: factory
                );

                // Return success response
                var response = new ApiResponse<FactoryRegistrationResponse>
                {
                    Success = true,
                    Message = "Factory registered successfully.",
                    Data = new FactoryRegistrationResponse
                    {
                        FactoryId = factory.Id,
                        Message = "Registration completed successfully.",
                        Status = "Pending Verification",
                        Success = true,
                        RegisteredAt = factory.CreatedAt,
                        VerificationToken = ""  // Empty for now
                    }
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error registering factory: {FactoryName}", request.FactoryName);

                // Get inner exception details for debugging
                var errorMessage = ex.Message;
                if (ex.InnerException != null)
                {
                    errorMessage += $" | Inner: {ex.InnerException.Message}";
                }

                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
                {
                    Success = false,
                    Message = "An error occurred while registering the factory",
                    Errors = new List<string> { errorMessage }
                });
            }
        }

        /// <summary>
        /// Get factory registration status
        /// </summary>
        /// <param name="factoryId">Factory ID</param>
        /// <returns>Factory status information</returns>
        [HttpGet("status/{factoryId}")]
        [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetRegistrationStatus(long factoryId)
        {
            try
            {
                var factory = await _context.Factories
                    .Where(f => f.Id == factoryId)
                    .Select(f => new
                    {
                        f.Id,
                        f.FactoryName,
                        f.Email,
                        f.Status,
                        f.Verified,
                        f.CreatedAt,
                        f.UpdatedAt
                    })
                    .FirstOrDefaultAsync();

                if (factory == null)
                {
                    return NotFound(new ApiResponse
                    {
                        Success = false,
                        Message = "Factory not found"
                    });
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Factory status retrieved",
                    Data = factory
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting registration status for factory ID: {FactoryId}", factoryId);
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
                {
                    Success = false,
                    Message = "An error occurred"
                });
            }
        }

        /// <summary>
        /// Verify factory registration
        /// </summary>
        /// <param name="token">Verification token</param>
        /// <returns>Verification result</returns>
        [HttpPost("verify/{token}")]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> VerifyRegistration(string token)
        {
            try
            {
                // TODO: Implement token verification logic
                // var factoryId = ExtractFactoryIdFromToken(token);
                // var factory = await _context.Factories.FindAsync(factoryId);
                // if (factory == null)
                // {
                //     return BadRequest(new ApiResponse { Success = false, Message = "Invalid token" });
                // }
                // factory.Verified = true;
                // factory.Status = "Active";
                // factory.UpdatedAt = DateTime.UtcNow;
                // await _context.SaveChangesAsync();
                // await _auditService.LogAsync(...);

                return Ok(new ApiResponse
                {
                    Success = true,
                    Message = "Verification endpoint - implement token validation logic"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error verifying registration with token: {Token}", token);
                return StatusCode(StatusCodes.Status500InternalServerError, new ApiResponse
                {
                    Success = false,
                    Message = "Verification failed"
                });
            }
        }

        #region Helper Methods

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

            return new ValidationResult
            {
                IsValid = errors.Count == 0,
                Errors = errors
            };
        }

        private async Task<ValidationResult> CheckForDuplicates(FactoryRegistrationRequest request)
        {
            var errors = new List<string>();

            // Check email
            var emailExists = await _context.Factories
                .AnyAsync(f => f.Email.ToLower() == request.Email.Trim().ToLower());
            if (emailExists)
                errors.Add("Email already registered");

            // Check tax number
            var taxExists = await _context.Factories
                .AnyAsync(f => f.TaxNumber == request.TaxNumber.Trim());
            if (taxExists)
                errors.Add("Tax number already registered");

            // Check registration number
            var regExists = await _context.Factories
                .AnyAsync(f => f.RegistrationNumber == request.RegistrationNumber.Trim());
            if (regExists)
                errors.Add("Registration number already registered");

            return new ValidationResult
            {
                IsValid = errors.Count == 0,
                Errors = errors
            };
        }

        private string FormatPhoneNumber(string phone)
        {
            // Remove all non-digit characters
            var digits = Regex.Replace(phone, @"[^\d]", "");

            // Format Saudi numbers
            if (digits.StartsWith("966") && digits.Length == 12)
            {
                return $"+{digits}";
            }
            else if (digits.StartsWith("05") && digits.Length == 10)
            {
                return $"+966{digits.Substring(1)}";
            }
            else if (digits.Length == 9 && digits.StartsWith("5"))
            {
                return $"+966{digits}";
            }

            return phone; // Return as-is if not a recognizable format
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

        private async Task<string?> SaveLogoAsync(string base64String, string factoryName)
        {
            try
            {
                // TODO: Implement logo saving logic
                return $"logos/{factoryName.ToLower().Replace(" ", "-")}-{Guid.NewGuid()}.png";
            }
            catch
            {
                return null;
            }
        }

        private string GenerateVerificationToken(long factoryId)
        {
            // Generate a simple verification token
            var token = $"{factoryId}-{Guid.NewGuid():N}-{DateTime.UtcNow.Ticks}";
            return Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes(token));
        }

        private class ValidationResult
        {
            public bool IsValid { get; set; }
            public List<string> Errors { get; set; } = new List<string>();
        }

        #endregion
    }
}