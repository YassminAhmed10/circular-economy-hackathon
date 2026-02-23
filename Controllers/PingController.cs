using Microsoft.AspNetCore.Mvc;

namespace ECoV.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                message = "Pong!",
                timestamp = DateTime.UtcNow,
                status = "API is working"
            });
        }
        
        [HttpGet("database")]
        public IActionResult CheckDatabase([FromServices] ApplicationDbContext context)
        {
            try
            {
                var factoryCount = context.Factories.Count();
                return Ok(new {
                    database = "Connected",
                    factories = factoryCount,
                    message = "Database connection successful"
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new {
                    database = "Error",
                    message = ex.Message
                });
            }
        }
    }
}
