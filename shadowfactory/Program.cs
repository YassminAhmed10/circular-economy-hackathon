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
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };

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
        },
        OnMessageReceived = context =>
        {
            // Log all authorization headers for debugging
            var authHeader = context.Request.Headers["Authorization"].ToString();
            Console.WriteLine($"Auth Header: {authHeader}");
            return Task.CompletedTask;
        }
    };
});

// Add authorization
builder.Services.AddAuthorization();

// IMPORTANT: Configure CORS specifically for your frontend
builder.Services.AddCors(options =>
{
    // Allow all origins for development - VERY IMPORTANT for Vite
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.SetIsOriginAllowed(origin => true) // Allow any origin
                   .AllowAnyMethod()
                   .AllowAnyHeader()
                   .AllowCredentials(); // Allow credentials (cookies, authorization headers)
        });

    // Specific policy for production
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins(
                "https://localhost:5173",  // Vite default
                "http://localhost:5173",
                "https://localhost:3000",   // React default
                "http://localhost:3000",
                "https://127.0.0.1:5173",
                "http://127.0.0.1:5173"
            )
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
    });
}

// IMPORTANT: Order of middleware matters!
// 1. CORS must come before other middleware
app.UseCors("AllowAll"); // Use AllowAll for development

// 2. Optional HTTPS redirection (comment out if causing issues)
// app.UseHttpsRedirection();

// 3. Routing
app.UseRouting();

// 4. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// 5. Map controllers
app.MapControllers();

// Test endpoints (all anonymous for easy testing)
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

// Test POST endpoint
app.MapPost("/test-post", async (HttpRequest request) =>
{
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

// CORS test endpoint
app.MapPost("/api/test-cors", async (HttpRequest request) =>
{
    var body = await new StreamReader(request.Body).ReadToEndAsync();
    Console.WriteLine($"🌐 CORS Test: {body}");

    // Log all headers for debugging
    foreach (var header in request.Headers)
    {
        Console.WriteLine($"Header: {header.Key} = {header.Value}");
    }

    return Results.Json(new
    {
        success = true,
        message = "CORS test successful!",
        data = body,
        headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString()),
        authHeader = request.Headers["Authorization"].ToString()
    });
}).AllowAnonymous();

// Database connection test
app.MapGet("/api/db-test", async (ECoVDbContext dbContext) =>
{
    try
    {
        var canConnect = await dbContext.Database.CanConnectAsync();
        var factoryCount = await dbContext.Factories.CountAsync();
        return Results.Ok(new
        {
            success = true,
            message = "Database connection successful!",
            canConnect = canConnect,
            factoryCount = factoryCount,
            tablesExist = factoryCount >= 0
        });
    }
    catch (Exception ex)
    {
        return Results.Json(new
        {
            success = false,
            message = $"Database connection failed: {ex.Message}",
            error = ex.InnerException?.Message
        }, statusCode: 500);
    }
}).AllowAnonymous();

// Echo endpoint for debugging
app.MapPost("/api/echo", async (HttpRequest request) =>
{
    try
    {
        var body = await new StreamReader(request.Body).ReadToEndAsync();
        var headers = request.Headers.ToDictionary(h => h.Key, h => h.Value.ToString());

        Console.WriteLine($"📤 Echo Request from {request.HttpContext.Connection.RemoteIpAddress}");
        Console.WriteLine($"Headers: {string.Join(", ", headers.Keys)}");

        return Results.Ok(new
        {
            success = true,
            message = "Request received successfully",
            body = body,
            headers = headers,
            method = request.Method,
            path = request.Path,
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

// Log all requests for debugging (optional)
app.Use(async (context, next) =>
{
    Console.WriteLine($"➡️ Request: {context.Request.Method} {context.Request.Path}");
    Console.WriteLine($"   Origin: {context.Request.Headers["Origin"]}");
    Console.WriteLine($"   Referer: {context.Request.Headers["Referer"]}");

    await next();

    Console.WriteLine($"⬅️ Response: {context.Response.StatusCode}");
});

Console.WriteLine("🚀 ShadowFactory API starting...");
Console.WriteLine($"📊 Environment: {app.Environment.EnvironmentName}");
Console.WriteLine($"🔐 Authentication: JWT configured");
Console.WriteLine($"🌐 CORS: AllowAll policy enabled");
Console.WriteLine($"📍 Listening on: {string.Join(", ", app.Urls)}");

app.Run();