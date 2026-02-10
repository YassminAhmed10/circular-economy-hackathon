using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using shadowfactory.Data;
using shadowfactory.Services;
using shadowfactory.Services.Interfaces;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "ShadowFactory API",
        Version = "v1",
        Description = "Factory Registration and Management System"
    });
});

// Add DbContext
builder.Services.AddDbContext<ECoVDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS - VERY PERMISSIVE FOR TESTING
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

// Add other services
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IAuditService, AuditService>();

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "ShadowFactory API v1");
        c.RoutePrefix = "swagger";
    });
}

// VERY IMPORTANT: CORS must be before other middleware
app.UseCors("AllowAll");

// Disable HTTPS redirection for testing
// app.UseHttpsRedirection();

app.UseRouting();
app.UseAuthorization();

app.MapControllers();

// SIMPLE TEST ENDPOINTS
app.MapGet("/", () => "ShadowFactory API is running!").AllowAnonymous();

app.MapGet("/health", () => new
{
    status = "Healthy",
    timestamp = DateTime.UtcNow,
    service = "ShadowFactory API"
}).AllowAnonymous();

app.MapGet("/test", () => new
{
    message = "Test endpoint working!",
    time = DateTime.UtcNow
}).AllowAnonymous();

app.MapPost("/test-post", async (HttpRequest request) =>
{
    // Read the body
    using var reader = new StreamReader(request.Body);
    var body = await reader.ReadToEndAsync();

    Console.WriteLine($"📨 Received POST: {body}");

    return new
    {
        success = true,
        message = "POST received!",
        receivedData = body,
        timestamp = DateTime.UtcNow
    };
}).AllowAnonymous();

// Test endpoint with CORS headers
app.MapPost("/api/test-cors", async (HttpRequest request) =>
{
    var body = await new StreamReader(request.Body).ReadToEndAsync();

    Console.WriteLine($"🌐 CORS Test: {body}");

    return Results.Json(new
    {
        success = true,
        message = "CORS test successful!",
        data = body,
        headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString())
    });
}).AllowAnonymous();

app.Run();