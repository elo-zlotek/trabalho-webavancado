using System.ComponentModel.DataAnnotations;

namespace ControleChamados.Models
{
    public class Servico
    {
        [Key]
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome do serviço é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        public string? Descricao { get; set; }
        
        public int PrazoHoras { get; set; } // Tempo estimado para resolver

        public int SetorId { get; set; }

        public Setor? Setor { get; set; }
    }
}