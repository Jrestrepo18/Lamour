using LAmour.Api.Data;
using LAmour.Api.DTOs;
using LAmour.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LAmour.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(LAmourDbContext db, JwtTokenService jwtTokenService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginRequestDto request)
    {
        var user = await db.AdminUsers.FirstOrDefaultAsync(u => u.Username == request.Username);
        if (user is null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
        {
            return Unauthorized(new { message = "Usuario o contraseña incorrectos." });
        }

        var (token, expiresAt) = jwtTokenService.GenerateToken(user);
        return new LoginResponseDto(token, expiresAt, user.FullName, user.Username);
    }
}
