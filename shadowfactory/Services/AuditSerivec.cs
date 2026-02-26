using Microsoft.AspNetCore.Http;
using shadowfactory.Data;
using shadowfactory.Models;
using shadowfactory.Services.Interfaces;
using System.Text.Json;

namespace shadowfactory.Services
{
    public class AuditService : IAuditService
    {
        private readonly ECoVDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JsonSerializerOptions _jsonOptions;

        public AuditService(ECoVDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;

            _jsonOptions = new JsonSerializerOptions
            {
                ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles,
                WriteIndented = false,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
        }

        public async Task LogAsync(
            long? userId,
            long? factoryId,
            string action,
            string entityType,
            long? entityId,
            object? oldValues,
            object? newValues)
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext;

                var auditLog = new AuditLog
                {
                    UserId = userId,
                    FactoryId = factoryId,
                    Action = action,
                    EntityType = entityType,
                    EntityId = entityId,
                    Timestamp = DateTime.UtcNow,
                    IpAddress = httpContext?.Connection?.RemoteIpAddress?.ToString(),
                    UserAgent = httpContext?.Request.Headers["User-Agent"].ToString(),
                    Url = httpContext?.Request.Path
                };

                auditLog.OldValues = SerializeObject(oldValues);
                auditLog.NewValues = SerializeObject(newValues);

                await _context.AuditLogs.AddAsync(auditLog);
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Audit logging failed: {ex.Message}");
            }
        }

        private string? SerializeObject(object? value)
        {
            if (value == null) return null;

            try
            {
                return JsonSerializer.Serialize(value, _jsonOptions);
            }
            catch (Exception ex)
            {
                return $"Error serializing: {ex.Message}";
            }
        }
    }
}