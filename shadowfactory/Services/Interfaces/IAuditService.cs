namespace shadowfactory.Services.Interfaces
{
    public interface IAuditService
    {
        Task LogAsync(
            long? userId,
            long? factoryId,
            string action,
            string entityType,
            long? entityId,
            object? oldValues,
            object? newValues);
    }
}