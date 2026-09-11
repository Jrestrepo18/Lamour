using LAmour.Api.DTOs;
using LAmour.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/availability")]
public class AvailabilityController(AvailabilityService availabilityService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<AvailabilitySlotDto>>> Get(
        [FromQuery] int masseuseId,
        [FromQuery] DateOnly date,
        [FromQuery] int durationMinutes)
    {
        if (masseuseId <= 0 || durationMinutes <= 0)
        {
            return BadRequest("masseuseId y durationMinutes son requeridos.");
        }

        return await availabilityService.GetDaySlotsAsync(masseuseId, date, durationMinutes);
    }
}
