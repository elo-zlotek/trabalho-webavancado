import React, { useEffect, useState, ChangeEvent } from "react";
import api from "../../../api/api";
import UsuarioDto from "../../../DTOs/Usuario/UsuarioDto";
import UsuarioCreateDto from "../../../DTOs/Usuario/UsuarioCreateDto";
import SetorDto from "../../../DTOs/Setor/SetorDto";
import "./UsuarioPage.css";

export default function UsuarioPage() {
    const [usuarios, setUsuarios] = useState<UsuarioDto[]>([]);
    const [setores, setSetores] = useState<SetorDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const [modoEdicao, setModoEdicao] = useState<boolean>(false);
    const [usuarioEditandoId, setUsuarioEditandoId] = useState<number | null>(null);

    const [formData, setFormData] = useState<UsuarioCreateDto>({
        Nome: "",
        Login: "",
        Senha: "",
        ConfirmarSenha: "",
        SetorId: 0,
    });

    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    async function carregarDadosIniciais(): Promise<void> {
        try {
            setLoading(true);
            setErro("");

            const [resUsuarios, resSetores] = await Promise.all([
                api.get<UsuarioDto[]>("/api/Usuarios"),
                api.get<SetorDto[]>("/api/Setores")
            ]);

            setUsuarios(resUsuarios.data);
            setSetores(resSetores.data);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar dados de usuários e setores.");
        } finally {
            setLoading(false);
        }
    }

    async function carregarUsuarios(): Promise<void> {
        try {
            const response = await api.get<UsuarioDto[]>("/api/Usuarios");
            setUsuarios(response.data);
        } catch (error) {
            console.error(error);
            setErro("Erro ao atualizar a lista de usuários.");
        }
    }

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ): void {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "SetorId" ? Number(value) : value,
        }));
    }

    async function handleSubmit(
        event: React.SyntheticEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        try {
            setErro("");

            const payload: UsuarioCreateDto = {
                Nome: formData.Nome.trim(),
                Login: formData.Login.trim(),
                Senha: formData.Senha,
                ConfirmarSenha: formData.ConfirmarSenha,
                SetorId: formData.SetorId,
            };

            if (!payload.Nome || !payload.Login) {
                setErro("Nome e Usuário (Login) são obrigatórios.");
                return;
            }

            if (payload.SetorId <= 0) {
                setErro("Selecione um setor válido para o usuário.");
                return;
            }

            if (!modoEdicao) {
                if (!payload.Senha) {
                    setErro("A senha é obrigatória para novos cadastros.");
                    return;
                }
                if (payload.Senha !== payload.ConfirmarSenha) {
                    setErro("A senha e a confirmação de senha não coincidem.");
                    return;
                }
            }

            if (modoEdicao && usuarioEditandoId !== null) {
                await api.put(`/api/Usuarios/${usuarioEditandoId}`, payload);
                alert("Usuário atualizado com sucesso.");
            } else {
                await api.post("/api/Usuarios", payload);
                alert("Usuário cadastrado com sucesso.");
            }

            limparFormulario();
            await carregarUsuarios();
        } catch (error: any) {
            console.error(error);
            const mensagem = error?.response?.data?.message || "Erro ao salvar o usuário.";
            setErro(mensagem);
        }
    }

    function editarUsuario(usuario: UsuarioDto): void {
        setModoEdicao(true);
        setUsuarioEditandoId(usuario.Id);

        setFormData({
            Nome: usuario.Nome,
            Login: usuario.Login,
            Senha: "",
            ConfirmarSenha: "",
            SetorId: usuario.Setor ? usuario.Setor.Id : 0,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluirUsuario(id: number): Promise<void> {
        const confirmar = window.confirm("Tem certeza que deseja excluir este usuário?");
        if (!confirmar) return;

        try {
            await api.delete(`/api/Usuarios/${id}`);
            alert("Usuário excluído com sucesso.");
            await carregarUsuarios();
        } catch (error: any) {
            console.error(error);
            const mensagem = error?.response?.data?.message || "Erro ao excluir usuário.";
            alert(mensagem);
        }
    }

    function limparFormulario(): void {
        setModoEdicao(false);
        setUsuarioEditandoId(null);
        setFormData({
            Nome: "",
            Login: "",
            Senha: "",
            ConfirmarSenha: "",
            SetorId: setores.length > 0 ? setores[0].Id : 0,
        });
        setErro("");
    }

    return (
        <main className="usuario-page">
            <header className="page-header">
                <h1>Gerenciamento de Usuários</h1>
                <p>Cadastre e gerencie as contas de acesso dos colaboradores.</p>
            </header>

            <section className="form-section" aria-labelledby="titulo-formulario">
                <article className="form-container">
                    <header>
                        <h2 id="titulo-formulario">
                            {modoEdicao ? "Editar Usuário" : "Cadastrar Usuário"}
                        </h2>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="Nome">Nome Completo *</label>
                            <input
                                id="Nome"
                                name="Nome"
                                type="text"
                                value={formData.Nome}
                                onChange={handleInputChange}
                                required
                                maxLength={150}
                                placeholder="Digite o nome completo"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Login">Usuário (Login) *</label>
                            <input
                                id="Login"
                                name="Login"
                                type="text"
                                value={formData.Login}
                                onChange={handleInputChange}
                                required
                                maxLength={50}
                                placeholder="Ex: nome.sobrenome"
                                disabled={modoEdicao}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="SetorId">Setor de Alocação *</label>
                            <select
                                id="SetorId"
                                name="SetorId"
                                value={formData.SetorId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value={0}>Selecione um setor...</option>
                                {setores.map((setor) => (
                                    <option key={setor.Id} value={setor.Id}>
                                        {setor.Nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!modoEdicao && (
                            <>
                                <div className="form-group">
                                    <label htmlFor="Senha">Senha *</label>
                                    <input
                                        id="Senha"
                                        name="Senha"
                                        type="password"
                                        value={formData.Senha}
                                        onChange={handleInputChange}
                                        required={!modoEdicao}
                                        placeholder="Digite a senha de acesso"
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="ConfirmarSenha">Confirmar Senha *</label>
                                    <input
                                        id="ConfirmarSenha"
                                        name="ConfirmarSenha"
                                        type="password"
                                        value={formData.ConfirmarSenha}
                                        onChange={handleInputChange}
                                        required={!modoEdicao}
                                        placeholder="Digite a senha novamente"
                                    />
                                </div>
                            </>
                        )}

                        {erro && (
                            <p className="mensagem-erro" role="alert">
                                {erro}
                            </p>
                        )}

                        <div className="button-group">
                            <button type="submit">
                                {modoEdicao ? "Atualizar Usuário" : "Cadastrar Usuário"}
                            </button>
                            <button type="button" onClick={limparFormulario}>
                                Cancelar / Limpar
                            </button>
                        </div>
                    </form>
                </article>
            </section>

            <section className="lista-section" aria-labelledby="titulo-lista">
                <header>
                    <h2 id="titulo-lista">Usuários Cadastrados</h2>
                </header>

                {loading ? (
                    <p>Carregando usuários...</p>
                ) : usuarios.length === 0 ? (
                    <p>Nenhum usuário cadastrado.</p>
                ) : (
                    <article className="table-container">
                        <table>
                            <caption className="sr-only">Lista de usuários do sistema</caption>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Login (Usuário)</th>
                                    <th>Setor</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {usuarios.map((user) => (
                                    <tr key={user.Id}>
                                        <td>{user.Id}</td>
                                        <td><strong>{user.Nome}</strong></td>
                                        <td>{user.Login}</td>
                                        <td>{user.Setor ? user.Setor.Nome : "Sem setor"}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => editarUsuario(user)}
                                                aria-label={`Editar usuário ${user.Nome}`}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => excluirUsuario(user.Id)}
                                                aria-label={`Excluir usuário ${user.Nome}`}
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </article>
                )}
            </section>
        </main>
    );
}