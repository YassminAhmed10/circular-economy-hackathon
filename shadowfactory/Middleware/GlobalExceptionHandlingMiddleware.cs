using System.Net;
using System.Text.Json;
using shadowfactory.Models.DTOs;

namespace shadowfactory.Middleware
{
    /// <summary>
    /// Global exception handling middleware - catches ALL unhandled exceptions
    /// and returns standardized error responses
    /// </summary>
    public class GlobalExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;

        public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            var response = new ApiResponse<object>();

            // Log the full exception
            var logger = context.RequestServices.GetRequiredService<ILogger<GlobalExceptionHandlingMiddleware>>();
            logger.LogError(exception, "Unhandled exception: {Message}", exception.Message);

            switch (exception)
            {
                case ArgumentException argEx:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    response.Success = false;
                    response.Message = "Invalid argument provided";
                    response.Errors.Add(argEx.Message);
                    break;

                case UnauthorizedAccessException unAuthEx:
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    response.Success = false;
                    response.Message = "Unauthorized access";
                    response.Errors.Add(unAuthEx.Message);
                    break;

                case KeyNotFoundException notFoundEx:
                    context.Response.StatusCode = StatusCodes.Status404NotFound;
                    response.Success = false;
                    response.Message = "Resource not found";
                    response.Errors.Add(notFoundEx.Message);
                    break;

                case InvalidOperationException invalidOpEx:
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;
                    response.Success = false;
                    response.Message = "Invalid operation";
                    response.Errors.Add(invalidOpEx.Message);
                    break;

                default:
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;
                    response.Success = false;
                    response.Message = "An internal server error occurred";
                    response.Errors.Add("Please contact support if the problem persists");
                    
                    // In development, include exception details
                    if (context.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment())
                    {
                        response.Errors.Add($"Exception: {exception.GetType().Name}");
                        response.Errors.Add($"Message: {exception.Message}");
                    }
                    break;
            }

            response.Timestamp = DateTime.UtcNow;
            return context.Response.WriteAsJsonAsync(response);
        }
    }

    /// <summary>
    /// Extension method to add global exception handling middleware to pipeline
    /// </summary>
    public static class GlobalExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandling(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<GlobalExceptionHandlingMiddleware>();
        }
    }
}
