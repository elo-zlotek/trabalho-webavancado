using ControleChamados.Data;
using ControleChamados.DTOs;
using ControleChamados.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace ControleChamados.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChamadosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ChamadosController(AppDbContext context)
        {
            _context = context;
        }


        [HttpPost]
        public async Task<ActionResult<Chamado>> PostChamado(CriarChamadoDto dto)
        {
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var servico = await _context.Servicos
                .FirstOrDefaultAsync(s => s.Id == dto.ServicoId);

            if (servico == null)
            {
                return NotFound("Serviço não encontrado.");
            }

            var dataCriacao = DateTime.Now;

            var chamado = new Chamado
            {
                Titulo = dto.Titulo,
                Descricao = dto.Descricao,
                ServicoId = dto.ServicoId,
                UsuarioId = usuario.Id,
                DataCriacao = dataCriacao,
                PrazoConclusao = dataCriacao
                    .AddHours(servico.PrazoHoras),

                Status = "Aberto"
            };

            _context.Chamados.Add(chamado);

            await _context.SaveChangesAsync();

            return CreatedAtAction(
                nameof(GetChamado),
                new { id = chamado.Id },
                chamado
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChamadoDto>> GetChamado(int id)
        {
            var chamado = await _context.Chamados
                .Include(c => c.Servico)
                .Include(c => c.Usuario)
                .Where(c => c.Id == id)
                .Select(c => new ChamadoDto
                {
                    Id = c.Id,
                    Titulo = c.Titulo,
                    Descricao = c.Descricao,
                    Status = c.Status,
                    DataCriacao = c.DataCriacao,
                    PrazoConclusao = c.PrazoConclusao,
                    DataConclusao = c.DataConclusao,

                    Servico = c.Servico == null ? null : new ServicoResumoDto
                    {
                        Id = c.Servico.Id,
                        Nome = c.Servico.Nome
                    },

                    Usuario = c.Usuario == null ? null : new UsuarioResumoDto
                    {
                        Id = c.Usuario.Id,
                        Nome = c.Usuario.Nome
                    }
                })
                .FirstOrDefaultAsync();

            if (chamado == null)
                return NotFound();

            return Ok(chamado);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChamadoDto>>> GetChamados()
        {
            var chamados = await _context.Chamados
                .Include(c => c.Servico)
                .Include(c => c.Usuario)
                .Select(c => new ChamadoDto
                {
                    Id = c.Id,
                    Titulo = c.Titulo,
                    Descricao = c.Descricao,
                    Status = c.Status,
                    DataCriacao = c.DataCriacao,
                    PrazoConclusao = c.PrazoConclusao,
                    DataConclusao = c.DataConclusao,

                    Servico = c.Servico == null ? null : new ServicoResumoDto
                    {
                        Id = c.Servico.Id,
                        Nome = c.Servico.Nome
                    },

                    Usuario = c.Usuario == null ? null : new UsuarioResumoDto
                    {
                        Id = c.Usuario.Id,
                        Nome = c.Usuario.Nome
                    }
                })
                .ToListAsync();

            return Ok(chamados);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutChamado(int id, CriarChamadoDto dto)
        {
            var chamado = await _context.Chamados
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound("Chamado não encontrado.");
            }

            var servico = await _context.Servicos
                .FirstOrDefaultAsync(s => s.Id == dto.ServicoId);

            if (servico == null)
            {
                return NotFound("Serviço não encontrado.");
            }

            chamado.Titulo = dto.Titulo;
            chamado.Descricao = dto.Descricao;
            chamado.ServicoId = dto.ServicoId;

            // recalcula prazo
            chamado.PrazoConclusao = chamado.DataCriacao
                .AddHours(servico.PrazoHoras);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChamado(int id)
        {
            var chamado = await _context.Chamados
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound("Chamado não encontrado.");
            }

            _context.Chamados.Remove(chamado);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpPatch("{id}/status")]
        public async Task<IActionResult> AlterarStatus(
            int id,
            AlterarStatusChamadoDto dto)
        {
            var chamado = await _context.Chamados
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound("Chamado não encontrado.");
            }

            var statusValidos = new[]
            {
                "Aberto",
                "Em Atendimento",
                "Aguardando Usuário",
                "Concluído",
                "Cancelado"
            };

            if (!statusValidos.Contains(dto.Status))
            {
                return BadRequest(new
                {
                    message = "Status inválido."
                });
            }

            chamado.Status = dto.Status;

            if (dto.Status == "Concluído")
            {
                chamado.DataConclusao = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return Ok(chamado);
        }
    }
    
}