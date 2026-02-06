using shadowfactory.Models.DTOs;

namespace ECoV.API.Services.Interfaces
{
    public interface IFileService
    {
        Task<FileUploadResponse> UploadFileAsync(IFormFile file, string folderPath);
        Task<FileUploadResponse> UploadBase64ImageAsync(string base64String, string folderPath, string fileName);
    }
}
