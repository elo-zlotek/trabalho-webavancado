using System.ComponentModel.DataAnnotations;

namespace ControleChamados.Models
{
    public class Setor
    {
        [Key] 
        public int Id { get; set; }

        [Required(ErrorMessage = "O nome é obrigatório")]
        public string Nome { get; set; } = string.Empty;

        public string? Descricao { get; set; }
    }
}