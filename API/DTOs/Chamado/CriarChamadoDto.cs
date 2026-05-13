using System.ComponentModel.DataAnnotations;

namespace ControleChamados.DTOs
{
    public class CriarChamadoDto
    {
        [Required(ErrorMessage = "O título é obrigatório.")]
        [StringLength(150, ErrorMessage = "O título deve ter no máximo 150 caracteres.")]
        public string Titulo { get; set; } = string.Empty;

        [StringLength(1000, ErrorMessage = "A descrição deve ter no máximo 1000 caracteres.")]
        public string? Descricao { get; set; }

        [Range(1, 9999, ErrorMessage = "Informe um serviço válido.")]
        public int ServicoId { get; set; }
    }
}