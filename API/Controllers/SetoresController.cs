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
    public class SetoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SetoresController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<SetorDto>>> GetSetores()
        {
            var setores = await _context.Setores
                .Select(s => new SetorDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    Descricao = s.Descricao
                })
                .ToListAsync();

            return Ok(setores);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<SetorDto>> GetSetor(int id)
        {
            var setor = await _context.Setores
                .Where(s => s.Id == id)
                .Select(s => new SetorDto
                {
                    Id = s.Id,
                    Nome = s.Nome,
                    Descricao = s.Descricao
                })
                .FirstOrDefaultAsync();

            if (setor == null)
            {
                return NotFound("Setor não encontrado.");
            }

            return Ok(setor);
        }

  
        [HttpPost]
        public async Task<ActionResult<SetorDto>> PostSetor(SetorCreateDto dto)
        {
            var setor = new Setor
            {
                Nome = dto.Nome,
                Descricao = dto.Descricao
            };

            _context.Setores.Add(setor);

            await _context.SaveChangesAsync();

            var response = new SetorDto
            {
                Id = setor.Id,
                Nome = setor.Nome,
                Descricao = setor.Descricao
            };

            return CreatedAtAction(
                nameof(GetSetor),
                new { id = setor.Id },
                response
            );
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutSetor(int id, SetorCreateDto dto)
        {
            var setor = await _context.Setores
                .FirstOrDefaultAsync(s => s.Id == id);

            if (setor == null)
            {
                return NotFound("Setor não encontrado.");
            }

            setor.Nome = dto.Nome;
            setor.Descricao = dto.Descricao;

            await _context.SaveChangesAsync();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSetor(int id)
        {
            var setor = await _context.Setores.FindAsync(id);
            if (setor == null) return NotFound();

            _context.Setores.Remove(setor);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}