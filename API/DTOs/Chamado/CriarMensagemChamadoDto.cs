using System.ComponentModel.DataAnnotations;

namespace ControleChamados.DTOs
{
    public class CriarMensagemChamadoDto
    {
        [Required(ErrorMessage = "A mensagem é obrigatória.")]
        [StringLength(
            2000,
            ErrorMessage =
                "A mensagem deve ter no máximo 2000 caracteres."
        )]
        public string Mensagem { get; set; } = string.Empty;
    }
}