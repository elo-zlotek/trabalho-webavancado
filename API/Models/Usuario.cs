using System.ComponentModel.DataAnnotations;

namespace ControleChamados.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Login { get; set; } = string.Empty;

        [Required]
        public string SenhaHash { get; set; } = string.Empty;

        [Required]
        public string Nome { get; set; } = string.Empty;
    }
}