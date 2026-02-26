using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using shadowfactory.Data;
using shadowfactory.Services;
using shadowfactory.Services.Interfaces;
using ECoV.API.Services;
using ECoV.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// ===== CORS =====
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ===== استخدام In-Memory Database =====
builder.Services.AddDbContext<ECoVDbContext>(options =>
    options.UseInMemoryDatabase("ECoVFactoryDB"));

// Add other services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditService, AuditService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IFileService, FileService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ===== CORS =====
app.UseCors();

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
        FactoryRegistration = "/api/Register/factory",
        GetStatus = "/api/Register/status/{factoryId}",
        Swagger = "/swagger"
    }
});

app.Run();