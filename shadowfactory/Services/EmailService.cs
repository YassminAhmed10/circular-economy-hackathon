using shadowfactory.Services.Interfaces;

namespace shadowfactory.Services
{
    public class EmailService : IEmailService
    {
        public Task<bool> SendVerificationEmailAsync(string email, string factoryName, string token)
        {
            Console.WriteLine($"Verification email to {email}, token: {token}");
            return Task.FromResult(true);
        }

        public Task<bool> SendApprovalEmailAsync(string email, string factoryName)
        {
            Console.WriteLine($"Approval email to {email}");
            return Task.FromResult(true);
        }

        public Task<bool> SendRejectionEmailAsync(string email, string factoryName, string reason)
        {
            Console.WriteLine($"Rejection email to {email}, reason: {reason}");
            return Task.FromResult(true);
        }

        public Task<bool> SendAdminVerificationRequestEmailAsync(string adminEmail, string factoryName, string details)
        {
            Console.WriteLine($"Admin verification request email to {adminEmail} for factory {factoryName}. Details: {details}");
            return Task.FromResult(true);
        }

        public Task<bool> SendVerificationRequestReceivedEmailAsync(string email, string factoryName)
        {
            Console.WriteLine($"Verification request received email to {email} for factory {factoryName}");
            return Task.FromResult(true);
        }
    }
}
