using LAmour.Api.Data;
using LAmour.Api.DTOs;
using LAmour.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Services;

public class AvailabilityService(LAmourDbContext db, IConfiguration config)
{
    private int OpeningHour => int.Parse(config["Business:OpeningHour"] ?? "9");
    private int ClosingHour => int.Parse(config["Business:ClosingHour"] ?? "21");
    private int SlotIntervalMinutes => int.Parse(config["Business:SlotIntervalMinutes"] ?? "30");

    /// <summary>Builds the day's slot grid for one masseuse and flags which ones fit the requested duration without overlap.</summary>
    public async Task<List<AvailabilitySlotDto>> GetDaySlotsAsync(int masseuseId, DateOnly date, int durationMinutes)
    {
        var dayStart = date.ToDateTime(new TimeOnly(OpeningHour, 0));
        var dayEnd = date.ToDateTime(new TimeOnly(ClosingHour, 0));

        var busy = await db.Appointments
            .Where(a => a.MasseuseId == masseuseId || a.SecondMasseuseId == masseuseId)
            .Where(a => a.Status != AppointmentStatus.Cancelled)
            .Where(a => a.StartsAt < dayEnd && a.StartsAt.AddMinutes(a.DurationMinutes) > dayStart)
            .Select(a => new { a.StartsAt, a.DurationMinutes })
            .ToListAsync();

        var slots = new List<AvailabilitySlotDto>();
        var cursor = dayStart;
        var now = DateTime.UtcNow;

        while (cursor.AddMinutes(durationMinutes) <= dayEnd)
        {
            var slotEnd = cursor.AddMinutes(durationMinutes);
            var overlaps = busy.Any(b => cursor < b.StartsAt.AddMinutes(b.DurationMinutes) && slotEnd > b.StartsAt);
            var isPast = cursor <= now;

            slots.Add(new AvailabilitySlotDto(cursor, slotEnd, !overlaps && !isPast));
            cursor = cursor.AddMinutes(SlotIntervalMinutes);
        }

        return slots;
    }

    public async Task<bool> IsSlotFreeAsync(int masseuseId, DateTime start, int durationMinutes, int? excludeAppointmentId = null)
    {
        var end = start.AddMinutes(durationMinutes);

        var query = db.Appointments
            .Where(a => a.MasseuseId == masseuseId || a.SecondMasseuseId == masseuseId)
            .Where(a => a.Status != AppointmentStatus.Cancelled)
            .Where(a => a.StartsAt < end && a.StartsAt.AddMinutes(a.DurationMinutes) > start);

        if (excludeAppointmentId is not null)
        {
            query = query.Where(a => a.Id != excludeAppointmentId);
        }

        return !await query.AnyAsync();
    }
}
