namespace ControleChamados.Models;
public class MensagemChamado
{
    public int Id { get; set; }

    public string Mensagem { get; set; } = string.Empty;

    public DateTime DataEnvio { get; set; } = DateTime.Now;

    public int ChamadoId { get; set; }

    public Chamado? Chamado { get; set; }

    public int UsuarioId { get; set; }

    public Usuario? Usuario { get; set; }
}