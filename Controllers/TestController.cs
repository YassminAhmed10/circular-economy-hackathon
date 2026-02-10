using Microsoft.AspNetCore.Mvc;

namespace ECoV.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TestController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { 
                message = "API Test Endpoint Working!",
                timestamp = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss")
            });
        }
    }
}
