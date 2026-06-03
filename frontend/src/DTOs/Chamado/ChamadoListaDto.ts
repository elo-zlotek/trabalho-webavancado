export default interface ChamadoListaDto {
    Id: number;
    Titulo: string;
    Status: string;
    DataCriacao: string;
    PrazoConclusao: string;

    NomeServico?: string;
    NomeSolicitante?: string;
    NomeResponsavel?: string | null;
}