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

    // Add security definition for JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer"
    });

    // Make Swagger UI work without authentication
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add DbContext
builder.Services.AddDbContext<ECoVDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT Authentication
// Use a default secret key if not configured
var jwtKey = builder.Configuration["Jwt:Key"] ?? "YourSuperSecretKeyForTesting1234567890!@#$%";
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Set to true in production
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = false, // Set to true in production
        ValidateAudience = false, // Set to true in production
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

    // Handle authentication failures
    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine($"Authentication failed: {context.Exception.Message}");
            return Task.CompletedTask;
        },
        OnChallenge = context =>
        {
            Console.WriteLine($"Authentication challenge: {context.Error}");
            return Task.CompletedTask;
        }
    };
});

// Add authorization
builder.Services.AddAuthorization(options =>
{
    // Add default policy that doesn't require authentication
    options.DefaultPolicy = new Microsoft.AspNetCore.Authorization.AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();
});

// Add CORS - VERY PERMISSIVE FOR TESTING
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .WithExposedHeaders("*"); // Allow all headers
        });

    // More restrictive policy for production
    options.AddPolicy("AllowSpecificOrigins",
        builder =>
        {
            builder.WithOrigins("https://localhost:3000", "http://localhost:3000")
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials();
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
        c.OAuthClientId("swagger-ui");
        c.OAuthAppName("Swagger UI");
        c.OAuthUsePkce();
    });
}

// VERY IMPORTANT: CORS must be before other middleware
app.UseCors("AllowAll");

// Disable HTTPS redirection for testing
// app.UseHttpsRedirection();

app.UseRouting();

// Authentication MUST come before Authorization
app.UseAuthentication(); // ← This was missing!
app.UseAuthorization();

app.MapControllers();

// SIMPLE TEST ENDPOINTS
app.MapGet("/", () => "ShadowFactory API is running!").AllowAnonymous();

app.MapGet("/health", () => new
{
    status = "Healthy",
    timestamp = DateTime.UtcNow,
    service = "ShadowFactory API",
    environment = app.Environment.EnvironmentName,
    version = "1.0.0"
}).AllowAnonymous();

app.MapGet("/test", () => new
{
    message = "Test endpoint working!",
    time = DateTime.UtcNow,
    authentication = "JWT configured"
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
        headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
        authHeader = request.Headers["Authorization"]
    });
}).AllowAnonymous();

// Database connection test endpoint
app.MapGet("/api/db-test", async (ECoVDbContext dbContext) =>
{
    try
    {
        var factoryCount = await dbContext.Factories.CountAsync();
        return Results.Ok(new
        {
            success = true,
            message = "Database connection successful!",
            factoryCount = factoryCount,
            connected = true
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Database connection failed: {ex.Message}");
    }
}).AllowAnonymous();

// Echo endpoint to test request/response
app.MapPost("/api/echo", async (HttpRequest request) =>
{
    try
    {
        var body = await new StreamReader(request.Body).ReadToEndAsync();
        var headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());

        Console.WriteLine($"📤 Echo Request Headers: {string.Join(", ", headers.Keys)}");

        return Results.Ok(new
        {
            success = true,
            message = "Request received successfully",
            body = body,
            headers = headers,
            timestamp = DateTime.UtcNow
        });
    }
    catch (Exception ex)
    {
        return Results.Problem($"Error processing request: {ex.Message}");
    }
}).AllowAnonymous();

// Global exception handler
app.UseExceptionHandler("/error");

app.Map("/error", (HttpContext context) =>
{
    var exception = context.Features.Get<Microsoft.AspNetCore.Diagnostics.IExceptionHandlerFeature>()?.Error;
    return Results.Problem(
        title: "An error occurred",
        detail: exception?.Message,
        statusCode: StatusCodes.Status500InternalServerError
    );
}).AllowAnonymous();

Console.WriteLine("🚀 ShadowFactory API starting...");
Console.WriteLine($"📊 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🔗 Base URL: {app.Urls}");
Console.WriteLine($"🔐 Authentication: JWT configured");
Console.WriteLine($"🌐 CORS: AllowAll policy enabled");

app.Run();