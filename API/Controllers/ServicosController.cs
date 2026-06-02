using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleChamados.Data;
using ControleChamados.Models;
using ControleChamados.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ControleChamados.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ServicosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ServicosController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServicoDto>>>GetServicos()
        {
            var servicos = await _context.Servicos
                .Include(s => s.Setor)
                .Select(s => new ServicoDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    Descricao = s.Descricao,
                    PrazoHoras = s.PrazoHoras,

                    Setor = s.Setor == null
                        ? null
                        : new SetorResumoDto
                        {
                            Id = s.Setor.Id,
                            Nome = s.Setor.Nome
                        }
                })
                .ToListAsync();

            return Ok(servicos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ServicoDto>>GetServico(int id)
        {
            var servico = await _context.Servicos
                .Include(s => s.Setor)
                .Where(s => s.Id == id)
                .Select(s => new ServicoDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    Descricao = s.Descricao,
                    PrazoHoras = s.PrazoHoras,

                    Setor = s.Setor == null
                        ? null
                        : new SetorResumoDto
                        {
                            Id = s.Setor.Id,
                            Nome = s.Setor.Nome
                        }
                })
                .FirstOrDefaultAsync();

            if (servico == null)
            {
                return NotFound("Serviço não encontrado.");
            }

            return Ok(servico);
        }

        [HttpPost]
        public async Task<ActionResult<ServicoDto>>PostServico(CriarServicoDto dto)
        {
            var setor = await _context.Setores
                .FirstOrDefaultAsync(s => s.Id == dto.SetorId);

            if (setor == null)
            {
                return BadRequest(new
                {
                    message = "Setor não encontrado."
                });
            }

            var servico = new Servico
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao,
                PrazoHoras = dto.PrazoHoras,
                SetorId = dto.SetorId
            };

            _context.Servicos.Add(servico);
            await _context.SaveChangesAsync();

            var response = new ServicoDto
            {
                Id = servico.Id,
                Nome = servico.Nome,
                Descricao = servico.Descricao,
                PrazoHoras = servico.PrazoHoras,

                Setor = new SetorResumoDto
                {
                    Id = setor.Id,
                    Nome = setor.Nome
                }
            };

            return CreatedAtAction(
                nameof(GetServico),
                new { id = servico.Id },
                response
            );
        }

        [HttpPut("{id}")]
        public async Task<IActionResult>PutServico(int id, CriarServicoDto dto)
        {
            var servico = await _context.Servicos
                .FirstOrDefaultAsync(s => s.Id == id);

            if (servico == null)
            {
                return NotFound("Serviço não encontrado.");
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

            servico.Nome = dto.Nome;
            servico.Descricao = dto.Descricao;
            servico.PrazoHoras = dto.PrazoHoras;
            servico.SetorId = dto.SetorId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")] 
        public async Task<IActionResult> DeleteServico(int id)
        {
            bool possuiChamados = await _context.Chamados
                .AnyAsync(c => c.ServicoId == id);

            if (possuiChamados)
            {
                return BadRequest(new
                {
                    message =
                        "Não é possível excluir um serviço vinculado a chamados."
                });
            }

            var servico = await _context.Servicos.FindAsync(id);
            if (servico == null) return NotFound();
            _context.Servicos.Remove(servico);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpGet("setor/{setorId}")]
        public async Task<ActionResult<IEnumerable<ServicoDto>>> GetServicosPorSetor(int setorId)
        {
            var servicos = await _context.Servicos
                .Include(s => s.Setor)
                .Where(s => s.SetorId == setorId)
                .Select(s => new ServicoDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    Descricao = s.Descricao,
                    PrazoHoras = s.PrazoHoras,

                    Setor = s.Setor == null
                        ? null
                        : new SetorResumoDto
                        {
                            Id = s.Setor.Id,
                            Nome = s.Setor.Nome
                        }
                })
                .ToListAsync();

            return Ok(servicos);
        }
    }
}