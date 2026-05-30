import React, { useEffect, useState, ChangeEvent } from "react";
import api from "../../../api/api";
import SetorDto from "../../../DTOs/Setor/SetorDto";
import SetorCreateDto from "../../../DTOs/Setor/SetorCreateDto";
import "./SetorPage.css";

export default function SetorPage() {
    const [setores, setSetores] = useState<SetorDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const [modoEdicao, setModoEdicao] = useState<boolean>(false);
    const [setorEditandoId, setSetorEditandoId] = useState<number | null>(null);

    const [formData, setFormData] = useState<SetorCreateDto>({
        Nome: "",
        Descricao: "",
    });

    useEffect(() => {
        carregarSetores();
    }, []);

    async function carregarSetores(): Promise<void> {
        try {
            setLoading(true);
            setErro("");

            const response = await api.get<SetorDto[]>("/api/Setores");
            setSetores(response.data);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar setores.");
        } finally {
            setLoading(false);
        }
    }

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(
        event: React.SyntheticEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        try {
            setErro("");

            const payload: SetorCreateDto = {
                Nome: formData.Nome.trim(),
                Descricao: formData.Descricao?.trim() || "",
            };

            if (!payload.Nome) {
                setErro("O nome do setor é obrigatório.");
                return;
            }

            if (modoEdicao && setorEditandoId !== null) {
                await api.put(
                    `/api/Setores/${setorEditandoId}`,
                    payload
                );

                alert("Setor atualizado com sucesso.");
            } else {
                await api.post("/api/Setores", payload);

                alert("Setor cadastrado com sucesso.");
            }

            limparFormulario();
            await carregarSetores();
        } catch (error: any) {
            console.error(error);

            const mensagem =
                error?.response?.data?.message ||
                "Erro ao salvar setor.";

            setErro(mensagem);
        }
    }

    function editarSetor(setor: SetorDto): void {
        setModoEdicao(true);
        setSetorEditandoId(setor.Id);

        setFormData({
            Nome: setor.Nome,
            Descricao: setor.Descricao || "",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    async function excluirSetor(id: number): Promise<void> {
        const confirmar = window.confirm(
            "Tem certeza que deseja excluir este setor?"
        );

        if (!confirmar) return;

        try {
            await api.delete(`/api/Setores/${id}`);

            alert("Setor excluído com sucesso.");

            await carregarSetores();
        } catch (error: any) {
            console.error(error);

            const mensagem =
                error?.response?.data?.message ||
                "Erro ao excluir setor.";

            alert(mensagem);
        }
    }

    function limparFormulario(): void {
        setModoEdicao(false);
        setSetorEditandoId(null);

        setFormData({
            Nome: "",
            Descricao: "",
        });

        setErro("");
    }

    return (
        <main className="setor-page">
            <header className="page-header">
                <h1>Gerenciamento de Setores</h1>
                <p>Cadastre, edite e exclua setores do sistema.</p>
            </header>

            <section
                className="form-section"
                aria-labelledby="titulo-formulario"
            >
                <article className="form-container">
                    <header>
                        <h2 id="titulo-formulario">
                            {modoEdicao
                                ? "Editar Setor"
                                : "Cadastrar Setor"}
                        </h2>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="Nome">
                                Nome do setor *
                            </label>

                            <input
                                id="Nome"
                                name="Nome"
                                type="text"
                                value={formData.Nome}
                                onChange={handleInputChange}
                                required
                                maxLength={100}
                                aria-required="true"
                                placeholder="Digite o nome do setor"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Descricao">
                                Descrição
                            </label>

                            <textarea
                                id="Descricao"
                                name="Descricao"
                                value={formData.Descricao}
                                onChange={handleInputChange}
                                maxLength={500}
                                rows={4}
                                placeholder="Digite a descrição do setor"
                            />
                        </div>

                        {erro && (
                            <p
                                className="mensagem-erro"
                                role="alert"
                            >
                                {erro}
                            </p>
                        )}

                        <div className="button-group">
                            <button type="submit">
                                {modoEdicao
                                    ? "Atualizar"
                                    : "Cadastrar"}
                            </button>

                            {modoEdicao && (
                                <button
                                    type="button"
                                    onClick={limparFormulario}
                                >
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </article>
            </section>

            <section
                className="lista-section"
                aria-labelledby="titulo-lista"
            >
                <header>
                    <h2 id="titulo-lista">
                        Lista de Setores
                    </h2>
                </header>

                {loading ? (
                    <p>Carregando setores...</p>
                ) : setores.length === 0 ? (
                    <p>Nenhum setor cadastrado.</p>
                ) : (
                    <article className="table-container">
                        <table>
                            <caption className="sr-only">
                                Lista de setores cadastrados
                            </caption>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>

                            <tbody>
                                {setores.map((setor) => (
                                    <tr key={setor.Id}>
                                        <td>{setor.Id}</td>
                                        <td>{setor.Nome}</td>
                                        <td>
                                            {setor.Descricao ||
                                                "Sem descrição"}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    editarSetor(setor)
                                                }
                                                aria-label={`Editar setor ${setor.Nome}`}
                                            >
                                                Editar
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    excluirSetor(setor.Id)
                                                }
                                                aria-label={`Excluir setor ${setor.Nome}`}
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