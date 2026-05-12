using ControleChamados.Data;
using ControleChamados.DTOs;
using ControleChamados.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static BCrypt.Net.BCrypt;

namespace ControleChamados.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> CreateAsync(
            UsuarioCreateDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (dto.Senha != dto.ConfirmarSenha)
            {
                return BadRequest(new
                {
                    message = "As senhas não conferem."
                });
            }

            bool existe = await _context.Usuarios
                .AnyAsync(u => u.Login == dto.Login);

            if (existe)
            {
                return BadRequest(new
                {
                    message = "Este login já está em uso."
                });
            }

            string senhaHash = HashPassword(dto.Senha);

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Login = dto.Login,
                SenhaHash = senhaHash
            };

            _context.Usuarios.Add(usuario);

            await _context.SaveChangesAsync();

            return CreatedAtRoute(
                "GetUsuarioById",
                new { id = usuario.Id },
                new UsuarioDto
                {
                    Id = usuario.Id,
                    Nome = usuario.Nome,
                    Login = usuario.Login
                }
            );
        }

        [HttpGet("{id:int}", Name = "GetUsuarioById")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var usuario = await _context.Usuarios
                .FindAsync(id);

            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(new UsuarioDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Login = usuario.Login
            });
        }
    }
}