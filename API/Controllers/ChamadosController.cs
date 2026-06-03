using ControleChamados.Data;
using ControleChamados.DTOs;
using ControleChamados.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using ControleChamados.Services;

namespace ControleChamados.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ChamadosController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UsuarioLogadoService _usuarioLogadoService;

        public ChamadosController(AppDbContext context, UsuarioLogadoService usuarioLogadoService)
        {
            _context = context;
            _usuarioLogadoService = usuarioLogadoService;
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

            var chamadoDto = await _context.Chamados
                .Include(c => c.Servico)
                .Include(c => c.Usuario)
                .Include(c => c.Responsavel)
                .Where(c => c.Id == chamado.Id)
                .Select(c => new ChamadoDto
                {
                    Id = c.Id,
                    Titulo = c.Titulo,
                    Descricao = c.Descricao,
                    Status = c.Status,
                    DataCriacao = c.DataCriacao,
                    PrazoConclusao = c.PrazoConclusao,
                    DataConclusao = c.DataConclusao,

                    Servico = c.Servico == null
                        ? null
                        : new ServicoResumoDto
                        {
                            Id = c.Servico.Id,
                            Nome = c.Servico.Nome
                        },

                    Usuario = c.Usuario == null
                        ? null
                        : new UsuarioResumoDto
                        {
                            Id = c.Usuario.Id,
                            Nome = c.Usuario.Nome
                        },

                    Responsavel = c.Responsavel == null
                        ? null
                        : new UsuarioResumoDto
                        {
                            Id = c.Responsavel.Id,
                            Nome = c.Responsavel.Nome
                        }
                })
                .FirstOrDefaultAsync();

            return CreatedAtAction(
                nameof(GetChamado),
                new { id = chamado.Id },
                chamadoDto
            );
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ChamadoDto>> GetChamado(int id)
        {
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamado = await _context.Chamados
                .Include(c => c.Servico)
                .Include(c => c.Usuario)
                .Include(c => c.Responsavel)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound();
            }

            if (chamado.UsuarioId != usuario.Id && chamado.Servico?.SetorId != usuario.SetorId)
            {
                return Forbid();
            }

            return Ok(new ChamadoDto
            {
                Id = chamado.Id,
                Titulo = chamado.Titulo,
                Descricao = chamado.Descricao,
                Status = chamado.Status,
                DataCriacao = chamado.DataCriacao,
                PrazoConclusao = chamado.PrazoConclusao,
                DataConclusao = chamado.DataConclusao,

                Servico = chamado.Servico == null
                    ? null
                    : new ServicoResumoDto
                    {
                        Id = chamado.Servico.Id,
                        Nome = chamado.Servico.Nome
                        SetorId = chamado.Servico.SetorId
                    },

                Usuario = chamado.Usuario == null
                    ? null
                    : new UsuarioResumoDto
                    {
                        Id = chamado.Usuario.Id,
                        Nome = chamado.Usuario.Nome
                    },

                Responsavel = chamado.Responsavel == null
                    ? null
                    : new UsuarioResumoDto
                    {
                        Id = chamado.Responsavel.Id,
                        Nome = chamado.Responsavel.Nome
                    }
            });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ChamadoDto>>> GetChamados()
        {
            var chamados = await _context.Chamados
                .Include(c => c.Servico)
                .Include(c => c.Usuario)
                .Include(c => c.Responsavel)
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
                    },

                    Responsavel = c.Responsavel == null ? null : new UsuarioResumoDto
                    {
                        Id = c.Responsavel.Id,
                        Nome = c.Responsavel.Nome
                    }
                })
                .ToListAsync();

            return Ok(chamados);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutChamado(int id, CriarChamadoDto dto)
        {
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamado = await _context.Chamados
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound("Chamado não encontrado.");
            }

            if (chamado.UsuarioId != usuario.Id)
            {
                return Forbid();
            }

            if (chamado.ResponsavelId != null)
            {
                return BadRequest(new
                {
                    message = "Não é possível editar um chamado que já foi assumido."
                });
            }

            if (chamado.Status == "Concluído")
            {
                return BadRequest(new
                {
                    message =
                        "Não é possível editar um chamado concluído."
                });
            }
            
            if (chamado.Status == "Cancelado")
            {
                return BadRequest(new
                {
                    message =
                        "Não é possível editar um chamado cancelado."
                });
            }

            var servico = await _context.Servicos
                .FirstOrDefaultAsync(s => s.Id == dto.ServicoId);

            if (servico == null)
            {
                return NotFound(new
                {
                    message = "Serviço não encontrado."
                });
            }

            chamado.Titulo = dto.Titulo;
            chamado.Descricao = dto.Descricao;
            chamado.ServicoId = dto.ServicoId;

            chamado.PrazoConclusao = chamado.DataCriacao
                .AddHours(servico.PrazoHoras);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteChamado(int id)
        {
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamado = await _context.Chamados
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound("Chamado não encontrado.");
            }

            if (chamado.UsuarioId != usuario.Id)
            {
                return Forbid();
            }

            if (chamado.ResponsavelId != null)
            {
                return BadRequest(new
                {
                    message = "Não é possível excluir um chamado que já foi assumido."
                });
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
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamado = await _context.Chamados
                .Include(c => c.Servico)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound("Chamado não encontrado.");
            }

            if (chamado.Servico == null)
            {
                return BadRequest(new
                {
                    message = "Serviço do chamado não encontrado."
                });
            }

            if (usuario.SetorId != chamado.Servico.SetorId)
            {
                return Forbid();
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

            bool transicaoValida = chamado.Status switch
            {
                "Aberto" =>
                    dto.Status == "Em Atendimento" ||
                    dto.Status == "Cancelado",

                "Em Atendimento" =>
                    dto.Status == "Aguardando Usuário" ||
                    dto.Status == "Concluído" ||
                    dto.Status == "Cancelado",

                "Aguardando Usuário" =>
                    dto.Status == "Em Atendimento",

                "Concluído" => false,

                "Cancelado" => false,

                _ => false
            };

            if (!transicaoValida)
            {
                return BadRequest(new
                {
                    message =
                        $"Não é possível alterar de '{chamado.Status}' para '{dto.Status}'."
                });
            }

            chamado.Status = dto.Status;

            if (dto.Status == "Concluído")
            {
                chamado.DataConclusao = DateTime.Now;
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Status atualizado com sucesso."
            });
        }

        [HttpPatch("{id}/assumir")]
        public async Task<IActionResult> AssumirChamado(int id)
        {
            string? login = User.Identity?.Name;

            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Login == login);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamado = await _context.Chamados
                .Include(c => c.Servico)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (chamado == null)
            {
                return NotFound(new
                {
                    message = "Chamado não encontrado."
                });
            }

            if (chamado.Servico == null)
            {
                return BadRequest(new
                {
                    message = "Serviço do chamado não encontrado."
                });
            }

            if (usuario.SetorId != chamado.Servico.SetorId)
            {
                return StatusCode(403, new
                {
                    message = "Você não tem permissão para assumir este chamado."
                });
            }

            if (chamado.ResponsavelId != null)
            {
                return BadRequest(new
                {
                    message = "Este chamado já possui um responsável."
                });
            }

            if (chamado.Status != "Aberto")
            {
                return BadRequest(new
                {
                    message =
                        "Somente chamados abertos podem ser assumidos."
                });
            }

            chamado.ResponsavelId = usuario.Id;

            chamado.Status = "Em Atendimento";

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Chamado assumido com sucesso."
            });
        }

        [HttpGet("meus")]
        public async Task<ActionResult<IEnumerable<ChamadoListaDto>>>GetMeusChamados()
        {
            var usuario = await _usuarioLogadoService.ObterUsuarioAsync(User.Identity?.Name);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamados = await _context.Chamados
                .Include(c => c.Servico)
                .Include(c => c.Usuario)
                .Include(c => c.Responsavel)
                .Where(c => c.UsuarioId == usuario.Id)
                .OrderByDescending(c => c.DataCriacao)
                .Select(c => new ChamadoListaDto
                {
                    Id = c.Id,
                    Titulo = c.Titulo,
                    Status = c.Status,
                    DataCriacao = c.DataCriacao,
                    PrazoConclusao = c.PrazoConclusao,

                    NomeServico = c.Servico != null
                        ? c.Servico.Nome
                        : null,

                    NomeSolicitante = c.Usuario != null
                        ? c.Usuario.Nome
                        : null,

                    NomeResponsavel = c.Responsavel != null
                        ? c.Responsavel.Nome
                        : null
                })
                .ToListAsync();

            return Ok(chamados);
        }

        [HttpGet("atendimentos")]
        public async Task<ActionResult<IEnumerable<ChamadoListaDto>>>GetAtendimentos()
        {
            var usuario = await _usuarioLogadoService.ObterUsuarioAsync(User.Identity?.Name);

            if (usuario == null)
            {
                return Unauthorized();
            }

            var chamados = await _context.Chamados
                .Include(c => c.Servico)
                .Include(c => c.Usuario)
                .Include(c => c.Responsavel)
                .Where(c =>
                    c.Servico != null &&
                    c.Servico.SetorId == usuario.SetorId
                )
                .OrderByDescending(c => c.DataCriacao)
                .Select(c => new ChamadoListaDto
                {
                    Id = c.Id,
                    Titulo = c.Titulo,
                    Status = c.Status,
                    DataCriacao = c.DataCriacao,
                    PrazoConclusao = c.PrazoConclusao,

                    NomeServico = c.Servico != null
                        ? c.Servico.Nome
                        : null,

                    NomeSolicitante = c.Usuario != null
                        ? c.Usuario.Nome
                        : null,

                    NomeResponsavel = c.Responsavel != null
                        ? c.Responsavel.Nome
                        : null
                })
                .ToListAsync();

            return Ok(chamados);
        }
    }
    
}