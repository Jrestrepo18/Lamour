using LAmour.Api.Data;
using LAmour.Api.DTOs;
using LAmour.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/admin/masseuses")]
[Authorize]
public class AdminMasseusesController(LAmourDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MasseuseAdminDto>>> GetAll()
    {
        var masseuses = await db.Masseuses.OrderBy(m => m.DisplayOrder).ToListAsync();
        return masseuses.Select(m => m.ToAdminDto()).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<MasseuseAdminDto>> Create(MasseuseUpsertDto dto)
    {
        var masseuse = new Masseuse
        {
            StageName = dto.StageName,
            Age = dto.Age,
            Bio = dto.Bio,
            PhotoUrl = dto.PhotoUrl,
            PhotoGalleryRaw = dto.PhotoGallery is null ? null : string.Join(';', dto.PhotoGallery),
            WhatsAppNumber = dto.WhatsAppNumber,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        db.Masseuses.Add(masseuse);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), masseuse.ToAdminDto());
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<MasseuseAdminDto>> Update(int id, MasseuseUpsertDto dto)
    {
        var masseuse = await db.Masseuses.FindAsync(id);
        if (masseuse is null) return NotFound();

        masseuse.StageName = dto.StageName;
        masseuse.Age = dto.Age;
        masseuse.Bio = dto.Bio;
        masseuse.PhotoUrl = dto.PhotoUrl;
        masseuse.PhotoGalleryRaw = dto.PhotoGallery is null ? null : string.Join(';', dto.PhotoGallery);
        masseuse.WhatsAppNumber = dto.WhatsAppNumber;
        masseuse.DisplayOrder = dto.DisplayOrder;
        masseuse.IsActive = dto.IsActive;

        await db.SaveChangesAsync();
        return masseuse.ToAdminDto();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var masseuse = await db.Masseuses.FindAsync(id);
        if (masseuse is null) return NotFound();

        var hasAppointments = await db.Appointments.AnyAsync(a => a.MasseuseId == id || a.SecondMasseuseId == id);
        if (hasAppointments)
        {
            masseuse.IsActive = false;
            await db.SaveChangesAsync();
            return NoContent();
        }

        db.Masseuses.Remove(masseuse);
        await db.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("{id:int}/schedule")]
    public async Task<ActionResult<MasseuseScheduleDto>> GetSchedule(int id)
    {
        var masseuse = await db.Masseuses
            .Include(m => m.WorkingHours)
            .Include(m => m.TimeOff)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (masseuse is null) return NotFound();
        return ToScheduleDto(masseuse);
    }

    /// <summary>Replaces her whole agenda. An empty week means "works the business hours every day".</summary>
    [HttpPut("{id:int}/schedule")]
    public async Task<ActionResult<MasseuseScheduleDto>> PutSchedule(int id, MasseuseScheduleDto dto)
    {
        var masseuse = await db.Masseuses
            .Include(m => m.WorkingHours)
            .Include(m => m.TimeOff)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (masseuse is null) return NotFound();

        if (dto.SlotIntervalMinutes is < 5 or > 240)
            return BadRequest("El intervalo entre sesiones debe estar entre 5 y 240 minutos.");
        if (dto.BufferMinutes is < 0 or > 240)
            return BadRequest("El tiempo entre citas debe estar entre 0 y 240 minutos.");

        var blocks = new List<MasseuseWorkingHours>();
        foreach (var b in dto.WorkingHours)
        {
            if (b.DayOfWeek is < 0 or > 6) return BadRequest("Día de la semana no válido.");
            if (!TryParseMinute(b.Start, out var start) || !TryParseMinute(b.End, out var end))
                return BadRequest("Las horas deben tener el formato HH:mm.");
            if (end <= start) return BadRequest("Cada bloque debe terminar después de empezar.");
            blocks.Add(new MasseuseWorkingHours { MasseuseId = id, DayOfWeek = b.DayOfWeek, StartMinute = start, EndMinute = end });
        }

        var overlapping = blocks.GroupBy(b => b.DayOfWeek).Any(day =>
        {
            var ordered = day.OrderBy(b => b.StartMinute).ToList();
            return ordered.Zip(ordered.Skip(1)).Any(pair => pair.Second.StartMinute < pair.First.EndMinute);
        });
        if (overlapping) return BadRequest("Hay bloques que se cruzan en el mismo día.");

        masseuse.SlotIntervalMinutes = dto.SlotIntervalMinutes;
        masseuse.BufferMinutes = dto.BufferMinutes;

        db.MasseuseWorkingHours.RemoveRange(masseuse.WorkingHours);
        db.MasseuseTimeOff.RemoveRange(masseuse.TimeOff);
        db.MasseuseWorkingHours.AddRange(blocks);
        db.MasseuseTimeOff.AddRange(dto.TimeOff
            .DistinctBy(t => t.Date)
            .Select(t => new MasseuseTimeOff { MasseuseId = id, Date = t.Date, Note = string.IsNullOrWhiteSpace(t.Note) ? null : t.Note.Trim() }));

        await db.SaveChangesAsync();

        await db.Entry(masseuse).Collection(m => m.WorkingHours).LoadAsync();
        await db.Entry(masseuse).Collection(m => m.TimeOff).LoadAsync();
        return ToScheduleDto(masseuse);
    }

    private static MasseuseScheduleDto ToScheduleDto(Masseuse m) => new(
        m.SlotIntervalMinutes,
        m.BufferMinutes,
        m.WorkingHours.OrderBy(w => w.DayOfWeek).ThenBy(w => w.StartMinute)
            .Select(w => new WorkingBlockDto(w.DayOfWeek, FormatMinute(w.StartMinute), FormatMinute(w.EndMinute))).ToList(),
        m.TimeOff.OrderBy(t => t.Date).Select(t => new TimeOffDto(t.Date, t.Note)).ToList()
    );

    private static string FormatMinute(int minute) => $"{minute / 60:00}:{minute % 60:00}";

    private static bool TryParseMinute(string value, out int minute)
    {
        minute = 0;
        if (value == "24:00") { minute = 1440; return true; }
        if (!TimeOnly.TryParseExact(value, "HH:mm", out var time)) return false;
        minute = time.Hour * 60 + time.Minute;
        return true;
    }
}
