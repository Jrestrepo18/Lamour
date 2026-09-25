using LAmour.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/admin/uploads")]
[Authorize]
public class AdminUploadsController(IWebHostEnvironment env, IConfiguration config) : ControllerBase
{
    private static readonly HashSet<string> AllowedContentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        "image/jpeg", "image/png", "image/webp", "image/gif"
    };

    private const long MaxFileSizeBytes = 10 * 1024 * 1024;
    private const int MaxFilesPerBatch = 20;

    [HttpPost]
    [RequestSizeLimit(MaxFileSizeBytes + 1024 * 1024)]
    public async Task<ActionResult<UploadResultDto>> Upload(IFormFile? file)
    {
        if (file is null || file.Length == 0)
            return BadRequest("No se recibió ningún archivo.");

        var error = Validate(file);
        if (error is not null) return BadRequest(error);

        return new UploadResultDto(await SaveAsync(file));
    }

    /// <summary>Several photos picked at once from the phone or computer; each is validated on its own.</summary>
    [HttpPost("batch")]
    [RequestSizeLimit(MaxFilesPerBatch * MaxFileSizeBytes)]
    [RequestFormLimits(MultipartBodyLengthLimit = MaxFilesPerBatch * MaxFileSizeBytes)]
    public async Task<ActionResult<BatchUploadResultDto>> UploadBatch(List<IFormFile> files)
    {
        if (files.Count == 0) return BadRequest("No se recibió ningún archivo.");
        if (files.Count > MaxFilesPerBatch) return BadRequest($"Sube máximo {MaxFilesPerBatch} fotos a la vez.");

        var urls = new List<string>();
        var errors = new List<string>();
        foreach (var file in files)
        {
            var error = file.Length == 0 ? "Archivo vacío." : Validate(file);
            if (error is null) urls.Add(await SaveAsync(file));
            else errors.Add($"{file.FileName}: {error}");
        }

        return new BatchUploadResultDto(urls, errors);
    }

    private static string? Validate(IFormFile file)
    {
        if (file.Length > MaxFileSizeBytes) return "La imagen supera el tamaño máximo permitido (10 MB).";
        if (!AllowedContentTypes.Contains(file.ContentType)) return "Formato no permitido. Usa JPG, PNG, WEBP o GIF.";
        return null;
    }

    private async Task<string> SaveAsync(IFormFile file)
    {
        var uploadsDir = UploadStorage.Resolve(config, env);
        Directory.CreateDirectory(uploadsDir);

        // The extension comes from the validated content type, never from the client's file name.
        var extension = file.ContentType.ToLowerInvariant() switch
        {
            "image/png" => ".png",
            "image/webp" => ".webp",
            "image/gif" => ".gif",
            _ => ".jpg",
        };
        var fileName = $"{Guid.NewGuid():N}{extension}";

        await using (var stream = System.IO.File.Create(Path.Combine(uploadsDir, fileName)))
        {
            await file.CopyToAsync(stream);
        }

        return $"{Request.Scheme}://{Request.Host}/uploads/{fileName}";
    }
}

public record UploadResultDto(string Url);

public record BatchUploadResultDto(List<string> Urls, List<string> Errors);
