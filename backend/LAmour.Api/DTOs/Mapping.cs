using LAmour.Api.Models;

namespace LAmour.Api.DTOs;

public static class Mapping
{
    public static ServiceDto ToDto(this Service s) => new(
        s.Id, s.ServiceCategoryId, s.Name, s.Slug, s.ShortDescription, s.LongDescription,
        s.DurationMinutes, s.Price, s.ImageUrl, s.Highlights.ToList(),
        s.RequiresTwoTherapists, s.HasSensoryDressOption, s.AllowsExtraTime, s.IsCoupleExperience,
        s.DisplayOrder, s.IsActive
    );

    public static ServiceCategoryDto ToDto(this ServiceCategory c) => new(
        c.Id, c.Name, c.Slug, c.Description, c.Highlight, c.DisplayOrder, c.IsActive,
        c.Services.OrderBy(s => s.DisplayOrder).Select(s => s.ToDto()).ToList()
    );

    public static MasseuseDto ToPublicDto(this Masseuse m) => new(
        m.Id, m.StageName, m.Bio, m.PhotoUrl, m.DisplayOrder, m.IsActive
    );

    public static MasseuseAdminDto ToAdminDto(this Masseuse m) => new(
        m.Id, m.StageName, m.Bio, m.PhotoUrl, m.WhatsAppNumber, m.DisplayOrder, m.IsActive
    );

    public static AppointmentDto ToDto(this Appointment a) => new(
        a.Id, a.ServiceId, a.Service?.Name ?? string.Empty,
        a.MasseuseId, a.Masseuse?.StageName ?? string.Empty,
        a.SecondMasseuseId, a.SecondMasseuse?.StageName,
        a.ClientName, a.ClientPhone, a.Address, a.AddressDetails, a.Neighborhood, a.City, a.Notes,
        a.SensoryDressRequested, a.ExtraMinutes, a.PaymentMethod,
        a.StartsAt, a.EndsAt, a.DurationMinutes, a.TotalPrice, a.Status, a.CreatedAt, a.ConfirmedAt
    );
}
