using System.ComponentModel.DataAnnotations;

namespace ControleChamados.DTOs
{
    public class CriarServicoDto
    {
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [StringLength(100, ErrorMessage ="O nome deve ter no máximo 100 caracteres.")]
        public string Nome { get; set; } = string.Empty;

        [StringLength(500, ErrorMessage ="A descrição deve ter no máximo 500 caracteres.")]
        public string? Descricao { get; set; }

        [Range(1, 720, ErrorMessage = "O prazo deve estar entre 1 e 720 horas.")]
        public int PrazoHoras { get; set; }

        [Range(1, int.MaxValue, ErrorMessage = "Informe um setor válido.")]
        public int SetorId { get; set; }
    }
}