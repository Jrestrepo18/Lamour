namespace LAmour.Api.Models;

public class Appointment
{
    public int Id { get; set; }

    public int ServiceId { get; set; }
    public Service? Service { get; set; }

    public int MasseuseId { get; set; }
    public Masseuse? Masseuse { get; set; }

    /// <summary>Second therapist for four-hands / couple experiences with two masseuses. Null otherwise.</summary>
    public int? SecondMasseuseId { get; set; }
    public Masseuse? SecondMasseuse { get; set; }

    public required string ClientName { get; set; }
    public required string ClientPhone { get; set; }
    public required string Address { get; set; }
    public string? AddressDetails { get; set; }
    public required string Neighborhood { get; set; }
    public required string City { get; set; } = "Medellín";
    public string? Notes { get; set; }

    public bool SensoryDressRequested { get; set; }
    public int ExtraMinutes { get; set; }

    public PaymentMethod PaymentMethod { get; set; }

    public DateTime StartsAt { get; set; }
    public int DurationMinutes { get; set; }
    public DateTime EndsAt => StartsAt.AddMinutes(DurationMinutes);

    public decimal TotalPrice { get; set; }

    public AppointmentStatus Status { get; set; } = AppointmentStatus.Pending;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; set; }
}
