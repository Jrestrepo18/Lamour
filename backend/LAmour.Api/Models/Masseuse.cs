namespace LAmour.Api.Models;

public class Masseuse
{
    public int Id { get; set; }
    public required string StageName { get; set; }
    public int? Age { get; set; }
    public string? Bio { get; set; }
    public string? PhotoUrl { get; set; }

    /// <summary>Semicolon-separated extra photo URLs shown in the profile detail (cover photo, <see cref="PhotoUrl"/>, is separate).</summary>
    public string? PhotoGalleryRaw { get; set; }

    /// <summary>E.164 phone number used to build the WhatsApp deep link, e.g. 573001234567.</summary>
    public required string WhatsAppNumber { get; set; }

    public int DisplayOrder { get; set; }

    /// <summary>Controls whether she is shown on the public site right now.</summary>
    public bool IsActive { get; set; } = true;

    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    public IEnumerable<string> PhotoGallery =>
        (PhotoGalleryRaw ?? string.Empty)
            .Split(';', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}
