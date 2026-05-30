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
    public DbSet<MensagemChamado> MensagensChamados { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder){
        modelBuilder.Entity<Setor>(entity =>
        {
            entity.Property(s => s.Nome)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(s => s.Descricao)
                .HasMaxLength(500);
        });

        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.Property(u => u.Login)
                .HasMaxLength(50)
                .IsRequired();

            entity.Property(u => u.SenhaHash)
                .HasMaxLength(255)
                .IsRequired();

            entity.Property(u => u.Nome)
                .HasMaxLength(100)
                .IsRequired();
        });

        modelBuilder.Entity<Usuario>()
            .HasOne(u => u.Setor)
            .WithMany()
            .HasForeignKey(u => u.SetorId);

        modelBuilder.Entity<Usuario>()
            .HasIndex(u => u.Login)
            .IsUnique();

        modelBuilder.Entity<Chamado>(entity =>
        {
            entity.Property(c => c.Titulo)
                .HasMaxLength(200)
                .IsRequired();

            entity.Property(c => c.Descricao)
                .HasMaxLength(1000);

            entity.Property(c => c.Status)
                .HasMaxLength(20)
                .IsRequired();
        });

        modelBuilder.Entity<Chamado>()
            .HasOne(c => c.Servico)
            .WithMany()
            .HasForeignKey(c => c.ServicoId);

        modelBuilder.Entity<Chamado>()
            .HasOne(c => c.Usuario)
            .WithMany()
            .HasForeignKey(c => c.UsuarioId);

        modelBuilder.Entity<Chamado>()
            .HasOne(c => c.Responsavel)
            .WithMany()
            .HasForeignKey(c => c.ResponsavelId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Chamado>()
            .HasMany(c => c.Mensagens)
            .WithOne(m => m.Chamado)
            .HasForeignKey(m => m.ChamadoId);

        modelBuilder.Entity<Servico>(entity =>
        {
            entity.Property(s => s.Nome)
                .HasMaxLength(100)
                .IsRequired();

            entity.Property(s => s.Descricao)
                .HasMaxLength(500);

            entity.Property(s => s.PrazoHoras)
                .IsRequired();
        });

        modelBuilder.Entity<Servico>()
            .HasOne(s => s.Setor)
            .WithMany(st => st.Servicos)
            .HasForeignKey(s => s.SetorId);

        modelBuilder.Entity<MensagemChamado>(entity =>
        {
            entity.Property(m => m.Mensagem)
                .HasMaxLength(1000)
                .IsRequired();

            entity.Property(m => m.DataEnvio)
                .IsRequired();
        });

        modelBuilder.Entity<MensagemChamado>()
            .HasOne(m => m.Chamado)
            .WithMany(c => c.Mensagens)
            .HasForeignKey(m => m.ChamadoId);

        modelBuilder.Entity<MensagemChamado>()
            .HasOne(m => m.Usuario)
            .WithMany()
            .HasForeignKey(m => m.UsuarioId);
    }   
}

