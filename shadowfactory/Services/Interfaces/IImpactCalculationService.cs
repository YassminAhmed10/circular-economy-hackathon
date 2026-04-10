using System;
using System.Threading.Tasks;

namespace shadowfactory.Services.Interfaces
{
    public interface IImpactCalculationService
    {
        Task CalculateForOrderAsync(long orderId);
        Task CalculateForFactoryAsync(long factoryId, DateTime from, DateTime to);
    }
}