using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ECoV.API.Data;

namespace ECoV.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public HealthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                // Test database connection
                var factoryCount = await _context.Factories.CountAsync();
                var wasteTypeCount = await _context.WasteTypesRef.CountAsync();
                
                return Ok(new
                {
                    status = "Healthy",
                    timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss"),
                    database = new
                    {
                        connected = true,
                        factories = factoryCount,
                        wasteTypes = wasteTypeCount
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    status = "Unhealthy",
                    error = ex.Message,
                    timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
                });
            }
        }
    }
}
