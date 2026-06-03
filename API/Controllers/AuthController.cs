using ControleChamados.Data;
using ControleChamados.DTOs;
using ControleChamados.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;

namespace ControleChamados.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;

        public AuthController(
            AppDbContext context,
            TokenService tokenService)
        {
            _context = context; 
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == dto.Login);

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    message = "Usuário ou senha inválidos."
                });
            }

            bool senhaValida = Verify(
                dto.Senha,
                usuario.SenhaHash
            );

            if (!senhaValida)
            {
                return Unauthorized(new
                {
                    message = "Usuário ou senha inválidos."
                });
            }

            var token = _tokenService.GenerateToken(usuario.Login);

            return Ok(new
            {
                token,
                nome = usuario.Nome,
                usuario = usuario.Login,
                usuarioId = usuario.Id,
                usuarioSetorId = usuario.SetorId
            });
        }
    }
}