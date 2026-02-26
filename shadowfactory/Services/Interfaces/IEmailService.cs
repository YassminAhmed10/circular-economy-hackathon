using System.Threading.Tasks;

namespace ECoV.API.Services.Interfaces
{
    public interface IEmailService
    {
        Task<bool> SendVerificationEmailAsync(string email, string factoryName, string token);
        Task<bool> SendApprovalEmailAsync(string email, string factoryName);
        Task<bool> SendRejectionEmailAsync(string email, string factoryName, string reason);
    }
}
