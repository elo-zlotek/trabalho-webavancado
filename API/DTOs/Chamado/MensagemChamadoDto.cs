namespace ControleChamados.DTOs
{
    public class MensagemChamadoDto
    {
        public int Id { get; set; }

        public string Mensagem { get; set; } = string.Empty;

        public DateTime DataEnvio { get; set; }

        public string Usuario { get; set; } = string.Empty;
    }
}