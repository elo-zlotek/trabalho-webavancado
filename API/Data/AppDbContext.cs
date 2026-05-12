using Microsoft.EntityFrameworkCore;
using ControleChamados.Models;

namespace ControleChamados.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }
    public DbSet<Setor> Setores { get; set; }

    public DbSet<Servico> Servicos { get; set; }
    public DbSet<Chamado> Chamados { get; set; }
    public DbSet<Usuario> Usuarios {get; set;}
}

