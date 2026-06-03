export default interface ChamadoListaDto {
    Id: number;
    Titulo: string;
    Status: string;
    DataCriacao: string;
    PrazoConclusao: string;

    Servico?: {
        Id: number;
        Nome: string;
    };

    Usuario?: {
        Id: number;
        Nome: string;
    };

    Responsavel?: {
        Id: number;
        Nome: string;
    };
}