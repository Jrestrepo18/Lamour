namespace LAmour.Api.Models;

public class Service
{
    public int Id { get; set; }
    public int ServiceCategoryId { get; set; }
    public ServiceCategory? ServiceCategory { get; set; }

    public required string Name { get; set; }
    public required string Slug { get; set; }
    public required string ShortDescription { get; set; }
    public string? LongDescription { get; set; }

    public int DurationMinutes { get; set; }
    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    /// <summary>Semicolon-separated bullet highlights shown on the service card (e.g. "Incluye estimulación final;Aceites tibios").</summary>
    public string? HighlightsRaw { get; set; }

    public bool RequiresTwoTherapists { get; set; }
    public bool HasSensoryDressOption { get; set; }
    public bool AllowsExtraTime { get; set; }
    public bool IsCoupleExperience { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public IEnumerable<string> Highlights =>
        (HighlightsRaw ?? string.Empty)
            .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}
