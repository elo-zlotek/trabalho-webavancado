namespace ControleChamados.DTOs
{
    public class ChamadoDto
    {
        public int Id { get; set; }

        public string Titulo { get; set; } = string.Empty;

        public string? Descricao { get; set; }

        public string Status { get; set; } = string.Empty;

        public DateTime DataCriacao { get; set; }

        public DateTime PrazoConclusao { get; set; }

        public DateTime? DataConclusao { get; set; }

        public ServicoResumoDto? Servico { get; set; }

        public UsuarioResumoDto? Usuario { get; set; }
    }

    public class ServicoResumoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
    }

    public class UsuarioResumoDto
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
    }
}