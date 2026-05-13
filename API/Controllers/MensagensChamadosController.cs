using ControleChamados.Data;
using ControleChamados.DTOs;
using ControleChamados.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ControleChamados.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/chamados/{chamadoId}/mensagens")]
    public class MensagensChamadosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MensagensChamadosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateAsync(int chamadoId, CriarMensagemChamadoDto dto)
        {
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamado = await _context.Chamados
                .FirstOrDefaultAsync(c => c.Id == chamadoId);

            if (chamado == null)
            {
                return NotFound(new
                {
                    message = "Chamado não encontrado."
                });
            }

            if (chamado.UsuarioId != usuario.Id && chamado.Servico?.SetorId != usuario.SetorId)
            {
                return Forbid();
            }

            if (chamado.Status == "Concluído")
            {
                return BadRequest(new
                {
                    message =
                        "Não é possível enviar mensagens em um chamado concluído."
                });
            }

            if (chamado.Status == "Cancelado")
            {
                return BadRequest(new
                {
                    message =
                        "Não é possível enviar mensagens em um chamado cancelado."
                });
            }

            var mensagem = new MensagemChamado
            {
                Mensagem = dto.Mensagem,
                ChamadoId = chamadoId,
                UsuarioId = usuario.Id,
                DataEnvio = DateTime.Now
            };

            _context.MensagensChamados.Add(mensagem);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Mensagem enviada com sucesso."
            });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MensagemChamadoDto>>>GetMensagens(int chamadoId)
        {
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null){
                return Unauthorized();
            }

            var chamado = await _context.Chamados
                .Include(c => c.Servico)
                .FirstOrDefaultAsync(c => c.Id == chamadoId);

            if (chamado == null)
            {
                return NotFound(new
                {
                    message = "Chamado não encontrado."
                });
            }

            if (chamado.UsuarioId != usuario.Id && chamado.Servico?.SetorId != usuario.SetorId)
            {
                return Forbid();
            }


            var mensagens = await _context.MensagensChamados
                .Include(m => m.Usuario)
                .Where(m => m.ChamadoId == chamadoId)
                .OrderBy(m => m.DataEnvio)
                .Select(m => new MensagemChamadoDto
                {
                    Id = m.Id,
                    Mensagem = m.Mensagem,
                    DataEnvio = m.DataEnvio,
                    Usuario = m.Usuario!.Nome
                })
                .ToListAsync();

            return Ok(mensagens);
        }
    }
}