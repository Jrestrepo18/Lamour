using LAmour.Api.Data;
using LAmour.Api.DTOs;
using LAmour.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/admin/services")]
[Authorize]
public class AdminServicesController(LAmourDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ServiceDto>>> GetAll()
    {
        var services = await db.Services.OrderBy(s => s.ServiceCategoryId).ThenBy(s => s.DisplayOrder).ToListAsync();
        return services.Select(s => s.ToDto()).ToList();
    }

    [HttpPost]
    public async Task<ActionResult<ServiceDto>> Create(ServiceUpsertDto dto)
    {
        var categoryExists = await db.ServiceCategories.AnyAsync(c => c.Id == dto.ServiceCategoryId);
        if (!categoryExists) return BadRequest("Categoría no válida.");

        var service = new Service
        {
            ServiceCategoryId = dto.ServiceCategoryId,
            Name = dto.Name,
            Slug = dto.Slug,
            ShortDescription = dto.ShortDescription,
            LongDescription = dto.LongDescription,
            DurationMinutes = dto.DurationMinutes,
            Price = dto.Price,
            ImageUrl = dto.ImageUrl,
            ImageGalleryRaw = dto.ImageGallery is null ? null : string.Join(';', dto.ImageGallery),
            HighlightsRaw = dto.Highlights is null ? null : string.Join(';', dto.Highlights),
            RequiresTwoTherapists = dto.RequiresTwoTherapists,
            HasSensoryDressOption = dto.HasSensoryDressOption,
            AllowsExtraTime = dto.AllowsExtraTime,
            IsCoupleExperience = dto.IsCoupleExperience,
            DisplayOrder = dto.DisplayOrder,
            IsActive = dto.IsActive
        };

        db.Services.Add(service);
        await db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetAll), service.ToDto());
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<ServiceDto>> Update(int id, ServiceUpsertDto dto)
    {
        var service = await db.Services.FindAsync(id);
        if (service is null) return NotFound();

        var categoryExists = await db.ServiceCategories.AnyAsync(c => c.Id == dto.ServiceCategoryId);
        if (!categoryExists) return BadRequest("Categoría no válida.");

        service.ServiceCategoryId = dto.ServiceCategoryId;
        service.Name = dto.Name;
        service.Slug = dto.Slug;
        service.ShortDescription = dto.ShortDescription;
        service.LongDescription = dto.LongDescription;
        service.DurationMinutes = dto.DurationMinutes;
        service.Price = dto.Price;
        service.ImageUrl = dto.ImageUrl;
        service.ImageGalleryRaw = dto.ImageGallery is null ? null : string.Join(';', dto.ImageGallery);
        service.HighlightsRaw = dto.Highlights is null ? null : string.Join(';', dto.Highlights);
        service.RequiresTwoTherapists = dto.RequiresTwoTherapists;
        service.HasSensoryDressOption = dto.HasSensoryDressOption;
        service.AllowsExtraTime = dto.AllowsExtraTime;
        service.IsCoupleExperience = dto.IsCoupleExperience;
        service.DisplayOrder = dto.DisplayOrder;
        service.IsActive = dto.IsActive;

        await db.SaveChangesAsync();
        return service.ToDto();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var service = await db.Services.FindAsync(id);
        if (service is null) return NotFound();

        var hasAppointments = await db.Appointments.AnyAsync(a => a.ServiceId == id);
        if (hasAppointments)
        {
            service.IsActive = false;
            await db.SaveChangesAsync();
            return NoContent();
        }

        db.Services.Remove(service);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
