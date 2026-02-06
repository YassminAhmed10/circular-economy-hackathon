using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using shadowfactory.Data;
using shadowfactory.Services;
using shadowfactory.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<ECoVDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add other services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditService, AuditService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/", () => new
{
    Message = "ShadowFactory API is running",
    Status = "Active",
    Timestamp = DateTime.UtcNow,
    Version = "1.0.0",
    Endpoints = new
    {
        FactoryRegistration = "/api/factories/register",
        GetAllFactories = "/api/factories",
        Swagger = "/swagger"
    }
});

app.Run();