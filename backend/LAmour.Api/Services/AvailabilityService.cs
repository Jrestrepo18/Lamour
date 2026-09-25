using LAmour.Api.Data;
using LAmour.Api.DTOs;
using LAmour.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Services;

/// <summary>
/// Turns each masseuse's agenda into bookable slots. Her agenda is:
/// weekly working blocks (several per day allowed), whole days off, the step between
/// possible session starts, and a buffer kept free after every session for travel.
/// A masseuse with no weekly blocks configured works the business hours every day,
/// so the team keeps taking bookings until an admin sets each agenda.
/// Appointment times are stored as local business time (Colombia), like the site sends them.
/// </summary>
public class AvailabilityService(LAmourDbContext db, IConfiguration config)
{
    private int OpeningHour => int.Parse(config["Business:OpeningHour"] ?? "9");
    private int ClosingHour => int.Parse(config["Business:ClosingHour"] ?? "21");
    private int DefaultIntervalMinutes => int.Parse(config["Business:SlotIntervalMinutes"] ?? "30");

    /// <summary>Current wall-clock time in the business time zone — slots are compared against this, not UTC.</summary>
    public DateTime BusinessNow() => TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, BusinessTimeZone(config));

    public static TimeZoneInfo BusinessTimeZone(IConfiguration config)
    {
        foreach (var id in new[] { config["Business:TimeZoneId"], "SA Pacific Standard Time", "America/Bogota" })
        {
            if (string.IsNullOrWhiteSpace(id)) continue;
            if (TimeZoneInfo.TryFindSystemTimeZoneById(id, out var tz)) return tz;
        }
        return TimeZoneInfo.CreateCustomTimeZone("COT", TimeSpan.FromHours(-5), "Colombia", "Colombia");
    }

    public async Task<List<AvailabilitySlotDto>> GetDaySlotsAsync(int masseuseId, DateOnly date, int durationMinutes)
    {
        var masseuse = await LoadAgendaAsync(masseuseId, date);
        if (masseuse is null || !masseuse.IsActive) return [];

        var blocks = BlocksFor(masseuse, date);
        if (blocks.Count == 0) return [];

        var interval = masseuse.SlotIntervalMinutes >= 5 ? masseuse.SlotIntervalMinutes : DefaultIntervalMinutes;
        var busy = await BusyAsync(masseuseId, date.ToDateTime(TimeOnly.MinValue), date.ToDateTime(TimeOnly.MinValue).AddDays(1), null);
        var now = BusinessNow();

        var slots = new List<AvailabilitySlotDto>();
        foreach (var (startMinute, endMinute) in blocks)
        {
            var blockEnd = date.ToDateTime(TimeOnly.MinValue).AddMinutes(endMinute);
            for (var cursor = date.ToDateTime(TimeOnly.MinValue).AddMinutes(startMinute);
                 cursor.AddMinutes(durationMinutes) <= blockEnd;
                 cursor = cursor.AddMinutes(interval))
            {
                var end = cursor.AddMinutes(durationMinutes);
                var free = cursor > now && !Overlaps(busy, cursor, end, masseuse.BufferMinutes);
                slots.Add(new AvailabilitySlotDto(cursor, end, free));
            }
        }

        return slots.OrderBy(s => s.Start).ToList();
    }

    /// <summary>
    /// Server-side guard for a booking: inside one of her working blocks that day, not a day off,
    /// not in the past, and clear of her other sessions (including their travel buffer).
    /// </summary>
    public async Task<bool> IsSlotFreeAsync(int masseuseId, DateTime start, int durationMinutes, int? excludeAppointmentId = null)
    {
        var date = DateOnly.FromDateTime(start);
        var masseuse = await LoadAgendaAsync(masseuseId, date);
        if (masseuse is null) return false;

        var end = start.AddMinutes(durationMinutes);
        var dayStart = date.ToDateTime(TimeOnly.MinValue);
        var insideBlock = BlocksFor(masseuse, date).Any(b =>
            start >= dayStart.AddMinutes(b.StartMinute) && end <= dayStart.AddMinutes(b.EndMinute));
        if (!insideBlock || start <= BusinessNow()) return false;

        var busy = await BusyAsync(masseuseId, dayStart.AddDays(-1), dayStart.AddDays(2), excludeAppointmentId);
        return !Overlaps(busy, start, end, masseuse.BufferMinutes);
    }

    private Task<Masseuse?> LoadAgendaAsync(int masseuseId, DateOnly date) =>
        db.Masseuses
            .Include(m => m.WorkingHours)
            .Include(m => m.TimeOff.Where(t => t.Date == date))
            .FirstOrDefaultAsync(m => m.Id == masseuseId);

    private List<(int StartMinute, int EndMinute)> BlocksFor(Masseuse masseuse, DateOnly date)
    {
        if (masseuse.TimeOff.Any(t => t.Date == date)) return [];
        if (masseuse.WorkingHours.Count == 0) return [(OpeningHour * 60, ClosingHour * 60)];

        var day = (int)date.DayOfWeek;
        return masseuse.WorkingHours
            .Where(w => w.DayOfWeek == day && w.EndMinute > w.StartMinute)
            .OrderBy(w => w.StartMinute)
            .Select(w => (w.StartMinute, w.EndMinute))
            .ToList();
    }

    private async Task<List<(DateTime Start, DateTime End)>> BusyAsync(int masseuseId, DateTime from, DateTime to, int? excludeAppointmentId)
    {
        var rows = await db.Appointments
            .Where(a => a.MasseuseId == masseuseId || a.SecondMasseuseId == masseuseId)
            .Where(a => a.Status != AppointmentStatus.Cancelled)
            .Where(a => excludeAppointmentId == null || a.Id != excludeAppointmentId)
            .Where(a => a.StartsAt < to && a.StartsAt.AddMinutes(a.DurationMinutes) > from.AddHours(-3))
            .Select(a => new { a.StartsAt, a.DurationMinutes })
            .ToListAsync();

        return rows.Select(r => (r.StartsAt, r.StartsAt.AddMinutes(r.DurationMinutes))).ToList();
    }

    /// <summary>Two sessions clash if they overlap once each is followed by the travel buffer.</summary>
    private static bool Overlaps(List<(DateTime Start, DateTime End)> busy, DateTime start, DateTime end, int bufferMinutes) =>
        busy.Any(b => start < b.End.AddMinutes(bufferMinutes) && end.AddMinutes(bufferMinutes) > b.Start);
}
