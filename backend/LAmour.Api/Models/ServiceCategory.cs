namespace LAmour.Api.Models;

public class ServiceCategory
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string Slug { get; set; }
    public string? Description { get; set; }

    /// <summary>Free-form note shown under the category header, e.g. the mandatory disclosure for erotic massages.</summary>
    public string? Highlight { get; set; }

    public int DisplayOrder { get; set; }
    public bool IsActive { get; set; } = true;

    public ICollection<Service> Services { get; set; } = new List<Service>();
}
