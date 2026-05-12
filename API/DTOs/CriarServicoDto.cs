namespace ControleChamados.DTOs
{
    public class CriarServicoDto
    {
        public string Nome { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        public int PrazoHoras { get; set; }

        public int SetorId { get; set; }
    }
}