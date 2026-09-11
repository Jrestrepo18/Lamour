namespace LAmour.Api.DTOs;

public record LoginRequestDto(string Username, string Password);

public record LoginResponseDto(string Token, DateTime ExpiresAt, string FullName, string Username);
