namespace LAmour.Api.Models;

/// <summary>
/// One block of working time on a weekday, e.g. Monday 09:00–13:00. A day can have several
/// blocks (morning and evening with a break in between). Minutes are counted from midnight
/// in the business time zone.
/// </summary>
public class MasseuseWorkingHours
{
    public int Id { get; set; }
    public int MasseuseId { get; set; }
    public Masseuse? Masseuse { get; set; }

    /// <summary>0 = Sunday … 6 = Saturday (same numbering as <see cref="System.DayOfWeek"/>).</summary>
    public int DayOfWeek { get; set; }
    public int StartMinute { get; set; }
    public int EndMinute { get; set; }
}

/// <summary>A whole day a masseuse doesn't take bookings (vacation, personal day).</summary>
public class MasseuseTimeOff
{
    public int Id { get; set; }
    public int MasseuseId { get; set; }
    public Masseuse? Masseuse { get; set; }

    public DateOnly Date { get; set; }
    public string? Note { get; set; }
}
