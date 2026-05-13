using System.ComponentModel.DataAnnotations;

namespace ControleChamados.DTOs
{
    public class UsuarioCreateDto
    {
        [Required(ErrorMessage = "Nome é obrigatório.")]
        public string Nome { get; set; } = string.Empty;

        [Required(ErrorMessage = "Login é obrigatório.")]
        public string Login { get; set; } = string.Empty;

        [Required(ErrorMessage = "Senha é obrigatório.")]
        public string Senha { get; set; } = string.Empty;

        [Required(ErrorMessage = "Confirmar a senha é obrigatório.")]
        public string ConfirmarSenha { get; set; } = string.Empty;

        [Range(1, int.MaxValue, ErrorMessage = "Informe um setor válido.")]
        public int SetorId { get; set; }
    }
}