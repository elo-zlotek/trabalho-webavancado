using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ControleChamados.Data;
using ControleChamados.Models;

namespace ControleChamados.Controllers
{
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
        public async Task<ActionResult<IEnumerable<Setor>>> GetSetores()
        {
            return await _context.Setores.ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Setor>> GetSetor(int id)
        {
            var setor = await _context.Setores.FindAsync(id);
            if (setor == null) return NotFound("Setor não encontrado.");
            return setor;
        }

  
        [HttpPost]
        public async Task<ActionResult<Setor>> PostSetor(Setor setor)
        {
            _context.Setores.Add(setor);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSetor), new { id = setor.Id }, setor);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutSetor(int id, Setor setor)
        {
            if (id != setor.Id) return BadRequest();

            _context.Entry(setor).State = EntityState.Modified;

            try {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException) {
                if (!_context.Setores.Any(e => e.Id == id)) return NotFound();
                throw;
            }

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