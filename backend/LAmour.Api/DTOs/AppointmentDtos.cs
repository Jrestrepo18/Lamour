using LAmour.Api.Models;

namespace LAmour.Api.DTOs;

public record AppointmentCreateDto(
    int ServiceId,
    int MasseuseId,
    int? SecondMasseuseId,
    DateTime StartsAt,
    bool SensoryDressRequested,
    int ExtraMinutes,
    string ClientName,
    string ClientPhone,
    string Address,
    string? AddressDetails,
    string Neighborhood,
    string City,
    string? Notes,
    PaymentMethod PaymentMethod
);

public record AppointmentDto(
    int Id,
    int ServiceId,
    string ServiceName,
    int MasseuseId,
    string MasseuseName,
    int? SecondMasseuseId,
    string? SecondMasseuseName,
    string ClientName,
    string ClientPhone,
    string Address,
    string? AddressDetails,
    string Neighborhood,
    string City,
    string? Notes,
    bool SensoryDressRequested,
    int ExtraMinutes,
    PaymentMethod PaymentMethod,
    DateTime StartsAt,
    DateTime EndsAt,
    int DurationMinutes,
    decimal TotalPrice,
    AppointmentStatus Status,
    DateTime CreatedAt,
    DateTime? ConfirmedAt
);

public record AppointmentStatusUpdateDto(AppointmentStatus Status);

public record AppointmentConfirmationResultDto(
    AppointmentDto Appointment,
    string WhatsAppLink,
    string? SecondWhatsAppLink
);

public record AvailabilitySlotDto(DateTime Start, DateTime End, bool Available);
