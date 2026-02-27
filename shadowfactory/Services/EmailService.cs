using ECoV.API.Services.Interfaces;

namespace ECoV.API.Services
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
    }
}
