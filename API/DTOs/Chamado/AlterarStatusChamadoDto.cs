using System.ComponentModel.DataAnnotations;

namespace ControleChamados.DTOs
{
    public class AlterarStatusChamadoDto
    {
        [Required(ErrorMessage = "O campo status é obrigatório")]
        public string Status { get; set; } = string.Empty;
    }
}