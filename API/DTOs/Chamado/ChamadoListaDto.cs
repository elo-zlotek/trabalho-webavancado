namespace ControleChamados.DTOs
{

    public class ChamadoListaDto
    {
        public int Id { get; set; }

        public string Titulo { get; set; }

        public string Status { get; set; }

        public DateTime DataCriacao { get; set; }

        public DateTime PrazoConclusao { get; set; }

        public string? NomeServico { get; set; }

        public string? NomeSolicitante { get; set; }

        public string? NomeResponsavel { get; set; }
    }
}