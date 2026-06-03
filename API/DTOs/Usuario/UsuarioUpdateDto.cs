using System.ComponentModel.DataAnnotations;

namespace ControleChamados.DTOs
{
    public class UsuarioUpdateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Informe um setor válido.")]
        public int SetorId { get; set; }
    }
}