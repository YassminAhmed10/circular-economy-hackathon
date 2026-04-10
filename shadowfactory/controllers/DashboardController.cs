using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using shadowfactory.Data;
using shadowfactory.Models.DTOs;

namespace shadowfactory.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class DashboardController : ControllerBase
    {
        private readonly ECoVDbContext _context;
        private readonly ILogger<DashboardController> _logger;

        public DashboardController(ECoVDbContext context, ILogger<DashboardController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IActionResult> GetDashboard()
        {
            try
            {
                var totalFactories = await _context.Factories.CountAsync();
                var totalUsers = await _context.Users.CountAsync();

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Data = new { totalFactories, totalUsers }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting dashboard");
                return StatusCode(500, new ApiResponse { Success = false, Message = "Error getting dashboard" });
            }
        }
    }
}