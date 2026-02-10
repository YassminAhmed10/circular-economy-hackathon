using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EcoVFactory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WasteTypesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public WasteTypesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/wastetypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<WasteType>>> GetWasteTypes()
        {
            return await _context.WasteTypesRef.ToListAsync();
        }

        // GET: api/wastetypes/plastic
        [HttpGet("{code}")]
        public async Task<ActionResult<WasteType>> GetWasteType(string code)
        {
            var wasteType = await _context.WasteTypesRef.FindAsync(code);

            if (wasteType == null)
            {
                return NotFound(new { message = $"Waste type with code '{code}' not found" });
            }

            return wasteType;
        }

        // GET: api/wastetypes/count
        [HttpGet("count")]
        public async Task<ActionResult<int>> GetWasteTypesCount()
        {
            return await _context.WasteTypesRef.CountAsync();
        }
    }
}
