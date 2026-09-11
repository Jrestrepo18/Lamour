using LAmour.Api.Data;
using LAmour.Api.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/service-categories")]
public class ServiceCategoriesController(LAmourDbContext db) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<List<ServiceCategoryDto>>> GetAll()
    {
        var categories = await db.ServiceCategories
            .Include(c => c.Services.Where(s => s.IsActive))
            .Where(c => c.IsActive)
            .OrderBy(c => c.DisplayOrder)
            .ToListAsync();

        return categories.Select(c => c.ToDto()).ToList();
    }
}
