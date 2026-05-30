export interface SetorResumoDto {
    Id: number;
    Nome: string;
}

export default interface UsuarioDto {
    Id: number;
    Nome: string;
    Login: string;
    Setor?: SetorResumoDto;
}