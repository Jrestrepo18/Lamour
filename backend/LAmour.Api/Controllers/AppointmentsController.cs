using LAmour.Api.Data;
using LAmour.Api.DTOs;
using LAmour.Api.Models;
using LAmour.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/appointments")]
public class AppointmentsController(
    LAmourDbContext db,
    AvailabilityService availabilityService,
    WhatsAppLinkService whatsAppLinkService) : ControllerBase
{
    [HttpPost]
    [AllowAnonymous]
    public async Task<ActionResult<AppointmentDto>> Create(AppointmentCreateDto dto)
    {
        var service = await db.Services.FindAsync(dto.ServiceId);
        if (service is null || !service.IsActive) return BadRequest("Servicio no válido.");

        var masseuse = await db.Masseuses.FindAsync(dto.MasseuseId);
        if (masseuse is null || !masseuse.IsActive) return BadRequest("Masajista no válida.");

        Masseuse? secondMasseuse = null;
        if (service.RequiresTwoTherapists)
        {
            if (dto.SecondMasseuseId is null) return BadRequest("Este servicio requiere una segunda masajista.");
            secondMasseuse = await db.Masseuses.FindAsync(dto.SecondMasseuseId);
            if (secondMasseuse is null || !secondMasseuse.IsActive || secondMasseuse.Id == masseuse.Id)
                return BadRequest("Segunda masajista no válida.");
        }

        var duration = service.DurationMinutes + Math.Max(0, dto.ExtraMinutes);

        if (!await availabilityService.IsSlotFreeAsync(masseuse.Id, dto.StartsAt, duration))
            return Conflict("Ese horario ya no está disponible para esta masajista.");

        if (secondMasseuse is not null && !await availabilityService.IsSlotFreeAsync(secondMasseuse.Id, dto.StartsAt, duration))
            return Conflict("Ese horario ya no está disponible para la segunda masajista.");

        var appointment = new Appointment
        {
            ServiceId = service.Id,
            MasseuseId = masseuse.Id,
            SecondMasseuseId = secondMasseuse?.Id,
            ClientName = dto.ClientName,
            ClientPhone = dto.ClientPhone,
            Address = dto.Address,
            AddressDetails = dto.AddressDetails,
            Neighborhood = dto.Neighborhood,
            City = string.IsNullOrWhiteSpace(dto.City) ? "Medellín" : dto.City,
            Notes = dto.Notes,
            SensoryDressRequested = dto.SensoryDressRequested && service.HasSensoryDressOption,
            ExtraMinutes = service.AllowsExtraTime ? Math.Max(0, dto.ExtraMinutes) : 0,
            PaymentMethod = dto.PaymentMethod,
            StartsAt = dto.StartsAt,
            DurationMinutes = duration,
            TotalPrice = service.Price,
            Status = AppointmentStatus.Pending
        };

        db.Appointments.Add(appointment);
        await db.SaveChangesAsync();

        await db.Entry(appointment).Reference(a => a.Service).LoadAsync();
        await db.Entry(appointment).Reference(a => a.Masseuse).LoadAsync();
        if (appointment.SecondMasseuseId is not null)
            await db.Entry(appointment).Reference(a => a.SecondMasseuse).LoadAsync();

        return CreatedAtAction(nameof(GetById), new { id = appointment.Id }, appointment.ToDto());
    }

    [HttpGet("{id:int}")]
    [Authorize]
    public async Task<ActionResult<AppointmentDto>> GetById(int id)
    {
        var appointment = await db.Appointments
            .Include(a => a.Service)
            .Include(a => a.Masseuse)
            .Include(a => a.SecondMasseuse)
            .FirstOrDefaultAsync(a => a.Id == id);

        return appointment is null ? NotFound() : appointment.ToDto();
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<AppointmentDto>>> GetAll()
    {
        var appointments = await db.Appointments
            .Include(a => a.Service)
            .Include(a => a.Masseuse)
            .Include(a => a.SecondMasseuse)
            .OrderBy(a => a.StartsAt)
            .ToListAsync();

        return appointments.Select(a => a.ToDto()).ToList();
    }

    [HttpPut("{id:int}/status")]
    [Authorize]
    public async Task<ActionResult<AppointmentConfirmationResultDto>> UpdateStatus(int id, AppointmentStatusUpdateDto dto)
    {
        var appointment = await db.Appointments
            .Include(a => a.Service)
            .Include(a => a.Masseuse)
            .Include(a => a.SecondMasseuse)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment is null) return NotFound();

        appointment.Status = dto.Status;
        if (dto.Status == AppointmentStatus.Confirmed) appointment.ConfirmedAt = DateTime.UtcNow;

        await db.SaveChangesAsync();

        string whatsAppLink = string.Empty;
        string? secondWhatsAppLink = null;

        if (dto.Status == AppointmentStatus.Confirmed)
        {
            whatsAppLink = whatsAppLinkService.BuildAssignmentLink(
                appointment, appointment.Masseuse!.WhatsAppNumber, appointment.Masseuse.StageName, appointment.Service!.Name);

            if (appointment.SecondMasseuse is not null)
            {
                secondWhatsAppLink = whatsAppLinkService.BuildAssignmentLink(
                    appointment, appointment.SecondMasseuse.WhatsAppNumber, appointment.SecondMasseuse.StageName, appointment.Service!.Name);
            }
        }

        return new AppointmentConfirmationResultDto(appointment.ToDto(), whatsAppLink, secondWhatsAppLink);
    }
}
