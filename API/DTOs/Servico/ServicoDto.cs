namespace ControleChamados.DTOs
{
    public class ServicoDto
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        public int PrazoHoras { get; set; }

        public SetorResumoDto? Setor { get; set; }
    }

    public class SetorResumoDto
    {
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;
    }
}