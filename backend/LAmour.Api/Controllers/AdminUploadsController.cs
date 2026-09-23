using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/admin/uploads")]
[Authorize]
public class AdminUploadsController(IWebHostEnvironment env) : ControllerBase
{
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp", "image/gif"
    };

    private const long MaxFileSizeBytes = 8 * 1024 * 1024;

    [HttpPost]
    [RequestSizeLimit(MaxFileSizeBytes)]
    public async Task<ActionResult<UploadResultDto>> Upload(IFormFile? file)
    {
        if (file is null || file.Length == 0)
            return BadRequest("No se recibió ningún archivo.");

        if (file.Length > MaxFileSizeBytes)
            return BadRequest("La imagen supera el tamaño máximo permitido (8 MB).");

        if (!AllowedContentTypes.Contains(file.ContentType))
            return BadRequest("Formato no permitido. Usa JPG, PNG, WEBP o GIF.");

        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        var uploadsDir = Path.Combine(webRoot, "uploads");
        Directory.CreateDirectory(uploadsDir);

        var extension = Path.GetExtension(file.FileName) is { Length: > 0 } ext
            ? ext
            : file.ContentType switch
            {
                "image/png" => ".png",
                "image/webp" => ".webp",
                "image/gif" => ".gif",
                _ => ".jpg",
            };
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsDir, fileName);

        await using (var stream = System.IO.File.Create(filePath))
        {
            await file.CopyToAsync(stream);
        }

        var url = $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
        return new UploadResultDto(url);
    }
}

public record UploadResultDto(string Url);
