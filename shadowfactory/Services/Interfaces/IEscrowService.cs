using System.Threading.Tasks;
using shadowfactory.Models.Entities;

namespace shadowfactory.Services.Interfaces
{
    public interface IEscrowService
    {
        Task<Escrow> CreateHoldAsync(long orderId, decimal amount, string currency = "usd");
        Task CaptureAsync(long escrowId);
        Task ReleaseAsync(long escrowId);
        Task RefundAsync(long escrowId);
    }
}