using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace ControleChamados.Models
{
    public class Setor
    {
        [Key] 
        public int Id { get; set; }

        public string Nome { get; set; } = string.Empty;
        
        public string? Descricao { get; set; }

        [JsonIgnore]
        public ICollection<Servico> Servicos { get; set; } = new List<Servico>();
    }
}