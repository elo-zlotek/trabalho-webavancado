export interface ServicoResumoDto {
    Id: number;
    Nome: string;
}

export interface UsuarioResumoDto {
    Id: number;
    Nome: string;
}

export default interface ChamadoDto {
    Id: number;
    Titulo: string;
    Descricao?: string;
    Status: string;
    DataCriacao: string;
    PrazoConclusao: string;
    DataConclusao?: string;
    Servico?: ServicoResumoDto;
    Usuario?: UsuarioResumoDto;
    Responsavel?: UsuarioResumoDto;
}