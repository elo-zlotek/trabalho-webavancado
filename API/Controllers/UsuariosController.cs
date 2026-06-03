using ControleChamados.Data;
using ControleChamados.DTOs;
using ControleChamados.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleChamados.Services;
using static BCrypt.Net.BCrypt;

namespace ControleChamados.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UsuarioLogadoService _usuarioLogadoService;

        public UsuariosController(AppDbContext context, UsuarioLogadoService usuarioLogadoService)
        {
            _context = context;
            _usuarioLogadoService = usuarioLogadoService;
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

            var setor = await _context.Setores
                .FirstOrDefaultAsync(s => s.Id == dto.SetorId);

            if (setor == null)
            {
                return BadRequest(new
                {
                    message = "Setor não encontrado."
                });
            }

            string senhaHash = HashPassword(dto.Senha);

            var usuario = new Usuario
            {
                Nome = dto.Nome,
                Login = dto.Login,
                SenhaHash = senhaHash,
                SetorId = dto.SetorId
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
                    Login = usuario.Login,
                    Setor = new SetorResumoDto
                    {
                        Id = setor.Id,
                        Nome = setor.Nome
                    }
                }
            );
        }

        [HttpGet("{id:int}", Name = "GetUsuarioById")]
        public async Task<IActionResult> GetByIdAsync(int id)
        {
            var usuario = await _context.Usuarios
                .Include(u => u.Setor)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(new UsuarioDto
            {
                Id = usuario.Id,
                Nome = usuario.Nome,
                Login = usuario.Login,

                Setor = usuario.Setor == null
                    ? null
                    : new SetorResumoDto
                    {
                        Id = usuario.Setor.Id,
                        Nome = usuario.Setor.Nome
                    }
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetUsuarios()
        {
            var usuarioLogado = await _usuarioLogadoService.ObterUsuarioAsync(User.Identity?.Name);

            if (usuarioLogado == null)
            {
                return Unauthorized();
            }

            if (!_usuarioLogadoService.IsAdministrador(usuarioLogado))
            {
                return Forbid();
            }

            var usuarios = await _context.Usuarios
                .Include(u => u.Setor)
                .Select(u => new UsuarioDto
                {
                    Id = u.Id,
                    Nome = u.Nome,
                    Login = u.Login,

                    Setor = u.Setor == null
                        ? null
                        : new SetorResumoDto
                        {
                            Id = u.Setor.Id,
                            Nome = u.Setor.Nome
                        }
                })
                .ToListAsync();

            return Ok(usuarios);
        }

        [HttpPut("{id:int}")]
        public async Task<IActionResult> UpdateAsync(int id, UsuarioCreateDto dto)
        {
            var usuarioLogado = await _usuarioLogadoService.ObterUsuarioAsync(User.Identity?.Name);

            if (usuarioLogado == null)
            {
                return Unauthorized();
            }

            if (!_usuarioLogadoService.IsAdministrador(usuarioLogado))
            {
                return Forbid();
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null)
            {
                return NotFound();
            }

            var setor = await _context.Setores
                .FirstOrDefaultAsync(s => s.Id == dto.SetorId);

            if (setor == null)
            {
                return BadRequest(new
                {
                    message = "Setor não encontrado."
                });
            }

            usuario.Nome = dto.Nome;
            usuario.SetorId = dto.SetorId;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> DeleteAsync(int id)
        {
            var usuarioLogado = await _usuarioLogadoService.ObterUsuarioAsync(User.Identity?.Name);

            if (usuarioLogado == null)
            {
                return Unauthorized();
            }

            if (!_usuarioLogadoService.IsAdministrador(usuarioLogado))
            {
                return Forbid();
            }

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Id == id);

            if (usuario == null)
            {
                return NotFound();
            }

            if (usuario.Id == usuarioLogado.Id)
            {
                return BadRequest(new
                {
                    message =
                        "Você não pode excluir seu próprio usuário."
                });
            }

            _context.Usuarios.Remove(usuario);

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }


}