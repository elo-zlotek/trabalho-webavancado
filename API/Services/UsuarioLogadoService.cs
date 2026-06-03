using ControleChamados.Data;
using ControleChamados.Models;
using Microsoft.EntityFrameworkCore;

namespace ControleChamados.Services;

public class UsuarioLogadoService
{
    private readonly AppDbContext _context;

    public UsuarioLogadoService(
        AppDbContext context
    )
    {
        _context = context;
    }

    public async Task<Usuario?> ObterUsuarioAsync(string? login)
    {
        if (string.IsNullOrWhiteSpace(login))
        {
            return null;
        }

        return await _context.Usuarios
            .Include(u => u.Setor)
            .FirstOrDefaultAsync(u => u.Login == login);
    }

    public bool IsAdministrador(Usuario usuario)
    {
        return usuario.Setor?.Nome == "Admin";
    }
}