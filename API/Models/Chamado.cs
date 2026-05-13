using System.ComponentModel.DataAnnotations;

namespace ControleChamados.Models
{
    public class Chamado
    {
        [Key]
        public int Id { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        public int ServicoId { get; set; }

        public Servico? Servico { get; set; }

        public DateTime DataCriacao { get; set; } = DateTime.Now;

        public DateTime PrazoConclusao { get; set; }

        public DateTime? DataConclusao { get; set; }

        public string Status { get; set; } = "Aberto";

        public int UsuarioId { get; set; }

        public Usuario? Usuario { get; set; }
    }
    
}