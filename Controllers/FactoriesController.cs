using ECoV.API.Data;
using ECoV.API.Models;
using ECoV.API.Models.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECoV.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FactoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FactoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/factories
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FactoryDto>>> GetFactories()
        {
            var factories = await _context.Factories
                .Select(f => new FactoryDto
                {
                    Id = f.Id,
                    FactoryName = f.FactoryName,
                    FactoryNameEn = f.FactoryNameEn,
                    Location = f.Location,
                    Email = f.Email,
                    Phone = f.Phone,
                    Verified = f.Verified,
                    Status = f.Status
                })
                .ToListAsync();

            return Ok(factories);
        }

        // GET: api/factories/5
        [HttpGet("{id}")]
        public async Task<ActionResult<FactoryDetailDto>> GetFactory(long id)
        {
            var factory = await _context.Factories.FindAsync(id);

            if (factory == null)
            {
                return NotFound(new { message = "Factory not found" });
            }

            var factoryDto = new FactoryDetailDto
            {
                Id = factory.Id,
                FactoryName = factory.FactoryName,
                FactoryNameEn = factory.FactoryNameEn,
                IndustryType = factory.IndustryType,
                Location = factory.Location,
                Address = factory.Address,
                Phone = factory.Phone,
                Fax = factory.Fax,
                Email = factory.Email,
                Website = factory.Website,
                OwnerName = factory.OwnerName,
                OwnerPhone = factory.OwnerPhone,
                OwnerEmail = factory.OwnerEmail,
                TaxNumber = factory.TaxNumber,
                RegistrationNumber = factory.RegistrationNumber,
                EstablishmentYear = factory.EstablishmentYear,
                NumberOfEmployees = factory.NumberOfEmployees,
                FactorySize = factory.FactorySize,
                ProductionCapacity = factory.ProductionCapacity,
                LogoUrl = factory.LogoUrl,
                Verified = factory.Verified,
                Status = factory.Status,
                CreatedAt = factory.CreatedAt
            };

            // Get waste types for this factory
            var wasteTypes = await _context.FactoryWasteTypes
                .Where(fwt => fwt.FactoryId == id)
                .Select(fwt => new FactoryWasteTypeDto
                {
                    WasteCode = fwt.WasteCode,
                    WasteAmount = fwt.WasteAmount,
                    WasteUnit = fwt.WasteUnit,
                    Frequency = fwt.Frequency,
                    Description = fwt.Description
                })
                .ToListAsync();

            factoryDto.WasteTypes = wasteTypes;

            return Ok(factoryDto);
        }

        // GET: api/factories/search?location=Riyadh
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<FactoryDto>>> SearchFactories(
            [FromQuery] string? location,
            [FromQuery] string? industryType,
            [FromQuery] string? wasteType)
        {
            var query = _context.Factories.AsQueryable();

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(f => f.Location.Contains(location));
            }

            if (!string.IsNullOrEmpty(industryType))
            {
                query = query.Where(f => f.IndustryType.Contains(industryType));
            }

            if (!string.IsNullOrEmpty(wasteType))
            {
                query = query.Where(f => f.FactoryWasteTypes.Any(fwt => fwt.WasteCode == wasteType));
            }

            var factories = await query
                .Select(f => new FactoryDto
                {
                    Id = f.Id,
                    FactoryName = f.FactoryName,
                    FactoryNameEn = f.FactoryNameEn,
                    Location = f.Location,
                    Email = f.Email,
                    Phone = f.Phone,
                    Verified = f.Verified,
                    Status = f.Status
                })
                .ToListAsync();

            return Ok(factories);
        }

        // GET: api/factories/5/wastetypes
        [HttpGet("{id}/wastetypes")]
        public async Task<ActionResult<IEnumerable<FactoryWasteTypeDetailDto>>> GetFactoryWasteTypes(long id)
        {
            var factoryExists = await _context.Factories.AnyAsync(f => f.Id == id);
            if (!factoryExists)
            {
                return NotFound(new { message = "Factory not found" });
            }

            var wasteTypes = await _context.FactoryWasteTypes
                .Where(fwt => fwt.FactoryId == id)
                .Join(_context.WasteTypesRef,
                    fwt => fwt.WasteCode,
                    wt => wt.WasteCode,
                    (fwt, wt) => new FactoryWasteTypeDetailDto
                    {
                        Id = fwt.Id,
                        WasteCode = fwt.WasteCode,
                        WasteNameAr = wt.WasteNameAr,
                        WasteNameEn = wt.WasteNameEn,
                        WasteAmount = fwt.WasteAmount,
                        WasteUnit = fwt.WasteUnit,
                        Frequency = fwt.Frequency,
                        Description = fwt.Description
                    })
                .ToListAsync();

            return Ok(wasteTypes);
        }

        // POST: api/factories
        [HttpPost]
        public async Task<ActionResult<FactoryDto>> CreateFactory(FactoryCreateDto factoryCreateDto)
        {
            // Check if email already exists
            if (await _context.Factories.AnyAsync(f => f.Email == factoryCreateDto.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            var factory = new Factory
            {
                FactoryName = factoryCreateDto.FactoryName,
                FactoryNameEn = factoryCreateDto.FactoryNameEn,
                IndustryType = factoryCreateDto.IndustryType,
                Location = factoryCreateDto.Location,
                Address = factoryCreateDto.Address,
                Phone = factoryCreateDto.Phone,
                Fax = factoryCreateDto.Fax,
                Email = factoryCreateDto.Email,
                Website = factoryCreateDto.Website,
                OwnerName = factoryCreateDto.OwnerName,
                OwnerPhone = factoryCreateDto.OwnerPhone,
                OwnerEmail = factoryCreateDto.OwnerEmail,
                TaxNumber = factoryCreateDto.TaxNumber,
                RegistrationNumber = factoryCreateDto.RegistrationNumber,
                EstablishmentYear = factoryCreateDto.EstablishmentYear,
                NumberOfEmployees = factoryCreateDto.NumberOfEmployees,
                FactorySize = factoryCreateDto.FactorySize,
                ProductionCapacity = factoryCreateDto.ProductionCapacity,
                LogoUrl = factoryCreateDto.LogoUrl,
                Verified = false, // New factories are not verified by default
                Status = "Pending",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Factories.Add(factory);
            await _context.SaveChangesAsync();

            // Add waste types if provided
            if (factoryCreateDto.WasteTypes != null && factoryCreateDto.WasteTypes.Any())
            {
                foreach (var wasteTypeDto in factoryCreateDto.WasteTypes)
                {
                    var factoryWasteType = new FactoryWasteType
                    {
                        FactoryId = factory.Id,
                        WasteCode = wasteTypeDto.WasteCode,
                        WasteAmount = wasteTypeDto.WasteAmount,
                        WasteUnit = wasteTypeDto.WasteUnit,
                        Frequency = wasteTypeDto.Frequency,
                        Description = wasteTypeDto.Description,
                        WasteNameAr = wasteTypeDto.WasteNameAr,
                        WasteNameEn = wasteTypeDto.WasteNameEn,
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    };

                    _context.FactoryWasteTypes.Add(factoryWasteType);
                }

                await _context.SaveChangesAsync();
            }

            var resultDto = new FactoryDto
            {
                Id = factory.Id,
                FactoryName = factory.FactoryName,
                FactoryNameEn = factory.FactoryNameEn,
                Location = factory.Location,
                Email = factory.Email,
                Phone = factory.Phone,
                Verified = factory.Verified,
                Status = factory.Status
            };

            return CreatedAtAction(nameof(GetFactory), new { id = factory.Id }, resultDto);
        }

        // PUT: api/factories/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFactory(long id, FactoryUpdateDto factoryUpdateDto)
        {
            var factory = await _context.Factories.FindAsync(id);
            if (factory == null)
            {
                return NotFound(new { message = "Factory not found" });
            }

            // Update factory properties
            factory.FactoryName = factoryUpdateDto.FactoryName ?? factory.FactoryName;
            factory.FactoryNameEn = factoryUpdateDto.FactoryNameEn ?? factory.FactoryNameEn;
            factory.IndustryType = factoryUpdateDto.IndustryType ?? factory.IndustryType;
            factory.Location = factoryUpdateDto.Location ?? factory.Location;
            factory.Address = factoryUpdateDto.Address ?? factory.Address;
            factory.Phone = factoryUpdateDto.Phone ?? factory.Phone;
            factory.Fax = factoryUpdateDto.Fax ?? factory.Fax;
            factory.Website = factoryUpdateDto.Website ?? factory.Website;
            factory.OwnerName = factoryUpdateDto.OwnerName ?? factory.OwnerName;
            factory.OwnerPhone = factoryUpdateDto.OwnerPhone ?? factory.OwnerPhone;
            factory.OwnerEmail = factoryUpdateDto.OwnerEmail ?? factory.OwnerEmail;
            factory.EstablishmentYear = factoryUpdateDto.EstablishmentYear ?? factory.EstablishmentYear;
            factory.NumberOfEmployees = factoryUpdateDto.NumberOfEmployees ?? factory.NumberOfEmployees;
            factory.FactorySize = factoryUpdateDto.FactorySize ?? factory.FactorySize;
            factory.ProductionCapacity = factoryUpdateDto.ProductionCapacity ?? factory.ProductionCapacity;
            factory.LogoUrl = factoryUpdateDto.LogoUrl ?? factory.LogoUrl;
            factory.Status = factoryUpdateDto.Status ?? factory.Status;
            factory.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
