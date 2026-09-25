namespace LAmour.Api.Services;

/// <summary>Where admin-uploaded photos live: Storage:UploadsPath if set (a persistent disk when hosted), else wwwroot/uploads.</summary>
public static class UploadStorage
{
    public static string Resolve(IConfiguration config, IWebHostEnvironment env)
    {
        var configured = config["Storage:UploadsPath"];
        if (!string.IsNullOrWhiteSpace(configured)) return configured;
        var webRoot = env.WebRootPath ?? Path.Combine(env.ContentRootPath, "wwwroot");
        return Path.Combine(webRoot, "uploads");
    }
}
