using LAmour.Api.Data;
using LAmour.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/masseuses")]
public class MasseusesController(LAmourDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<MasseuseDto>>> GetActive()
    {
        var masseuses = await db.Masseuses
            .Where(m => m.IsActive)
            .OrderBy(m => m.DisplayOrder)
            .ToListAsync();

        return masseuses.Select(m => m.ToPublicDto()).ToList();
    }
}
