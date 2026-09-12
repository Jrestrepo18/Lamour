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
}
