namespace LAmour.Api.DTOs;

public record ServiceCategoryDto(
    int Id,
    string Name,
    string Slug,
    string? Description,
    string? Highlight,
    int DisplayOrder,
    bool IsActive,
    List<ServiceDto> Services
);

public record ServiceDto(
    int Id,
    int ServiceCategoryId,
    string Name,
    string Slug,
    string ShortDescription,
    string? LongDescription,
    int DurationMinutes,
    decimal Price,
    string? ImageUrl,
    List<string> ImageGallery,
    List<string> Highlights,
    bool RequiresTwoTherapists,
    bool HasSensoryDressOption,
    bool AllowsExtraTime,
    bool IsCoupleExperience,
    int DisplayOrder,
    bool IsActive
);

public record ServiceUpsertDto(
    int ServiceCategoryId,
    string Name,
    string Slug,
    string ShortDescription,
    string? LongDescription,
    int DurationMinutes,
    decimal Price,
    string? ImageUrl,
    List<string>? ImageGallery,
    List<string>? Highlights,
    bool RequiresTwoTherapists,
    bool HasSensoryDressOption,
    bool AllowsExtraTime,
    bool IsCoupleExperience,
    int DisplayOrder,
    bool IsActive
);

public record ServiceCategoryUpsertDto(
    string Name,
    string Slug,
    string? Description,
    string? Highlight,
    int DisplayOrder,
    bool IsActive
);

public record MasseuseDto(
    int Id,
    string StageName,
    int? Age,
    string? Bio,
    string? PhotoUrl,
    List<string> PhotoGallery,
    int DisplayOrder,
    bool IsActive
);

public record MasseuseAdminDto(
    int Id,
    string StageName,
    int? Age,
    string? Bio,
    string? PhotoUrl,
    List<string> PhotoGallery,
    string WhatsAppNumber,
    int DisplayOrder,
    bool IsActive
);

public record MasseuseUpsertDto(
    string StageName,
    int? Age,
    string? Bio,
    string? PhotoUrl,
    List<string>? PhotoGallery,
    string WhatsAppNumber,
    int DisplayOrder,
    bool IsActive
);
