export interface SetorResumoDto {
    Id: number;
    Nome: string;
}

export default interface ServicoDto {
    Id: number;
    Nome: string;
    Descricao?: string;
    PrazoHoras: number;
    Setor?: SetorResumoDto;
}