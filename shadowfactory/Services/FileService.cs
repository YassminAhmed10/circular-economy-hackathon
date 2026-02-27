using shadowfactory.Models.DTOs;
using ECoV.API.Services.Interfaces;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;

namespace ECoV.API.Services
{
    public class FileService : IFileService
    {
        private readonly IWebHostEnvironment _environment;
        private readonly ILogger<FileService> _logger;

        public FileService(IWebHostEnvironment environment, ILogger<FileService> logger)
        {
            _environment = environment;
            _logger = logger;
        }

        public async Task<FileUploadResponse> UploadFileAsync(IFormFile file, string folderPath)
        {
            try
            {
                if (file == null || file.Length == 0)
                {
                    return new FileUploadResponse
                    {
                        Success = false,
                        Message = "No file uploaded"
                    };
                }

                var uploadsFolder = Path.Combine(_environment.WebRootPath, folderPath);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                var filePath = Path.Combine(uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return new FileUploadResponse
                {
                    Success = true,
                    Message = "File uploaded successfully",
                    FileUrl = $"/{folderPath}/{uniqueFileName}",
                    FileName = uniqueFileName,
                    FileSize = file.Length,
                    ContentType = file.ContentType
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file");
                return new FileUploadResponse
                {
                    Success = false,
                    Message = $"Error uploading file: {ex.Message}"
                };
            }
        }

        public async Task<FileUploadResponse> UploadBase64ImageAsync(string base64String, string folderPath, string fileName)
        {
            try
            {
                if (string.IsNullOrEmpty(base64String))
                {
                    return new FileUploadResponse
                    {
                        Success = false,
                        Message = "No image data provided"
                    };
                }

                // Remove data URL prefix if present
                if (base64String.Contains(","))
                {
                    base64String = base64String.Split(',')[1];
                }

                var bytes = Convert.FromBase64String(base64String);

                var uploadsFolder = Path.Combine(_environment.WebRootPath, folderPath);
                if (!Directory.Exists(uploadsFolder))
                {
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, fileName);

                await File.WriteAllBytesAsync(filePath, bytes);

                return new FileUploadResponse
                {
                    Success = true,
                    Message = "Image uploaded successfully",
                    FileUrl = $"/{folderPath}/{fileName}",
                    FileName = fileName,
                    FileSize = bytes.Length,
                    ContentType = "image/png"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading base64 image");
                return new FileUploadResponse
                {
                    Success = false,
                    Message = $"Error uploading image: {ex.Message}"
                };
            }
        }
    }
}
