using System.Threading.Tasks;

namespace shadowfactory.Services.Interfaces
{
    public interface IPaymentService
    {
        Task<string> CreatePaymentIntentAsync(decimal amount, string currency = "usd");
    }
}