import React, { useEffect, useState, ChangeEvent } from "react";
import api from "../../../api/api";
import ServicoDto from "../../../DTOs/Servico/ServicoDto";
import CriarServicoDto from "../../../DTOs/Servico/CriarServicoDto";
import SetorDto from "../../../DTOs/Setor/SetorDto";
import "./ServicoPage.css";

export default function ServicoPage() {
    const [servicos, setServicos] = useState<ServicoDto[]>([]);
    const [setores, setSetores] = useState<SetorDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const [modoEdicao, setModoEdicao] = useState<boolean>(false);
    const [servicoEditandoId, setServicoEditandoId] = useState<number | null>(null);

    const [formData, setFormData] = useState<CriarServicoDto>({
        Nome: "",
        Descricao: "",
        PrazoHoras: 24, 
        SetorId: 0,
    });

    useEffect(() => {
        carregarDadosIniciais();
    }, []);

    async function carregarDadosIniciais(): Promise<void> {
        try {
            setLoading(true);
            setErro("");
            
            const [resServicos, resSetores] = await Promise.all([
                api.get<ServicoDto[]>("/api/Servicos"),
                api.get<SetorDto[]>("/api/Setores")
            ]);

            setServicos(resServicos.data);
            setSetores(resSetores.data);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar os dados do sistema.");
        } finally {
            setLoading(false);
        }
    }

    async function carregarServicos(): Promise<void> {
        try {
            const response = await api.get<ServicoDto[]>("/api/Servicos");
            setServicos(response.data);
        } catch (error) {
            console.error(error);
            setErro("Erro ao atualizar a lista de serviços.");
        }
    }

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "PrazoHoras" || name === "SetorId" ? Number(value) : value,
        }));
    }

    async function handleSubmit(
        event: React.SyntheticEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();

        try {
            setErro("");

            const payload: CriarServicoDto = {
                Nome: formData.Nome.trim(),
                Descricao: formData.Descricao?.trim() || "",
                PrazoHoras: formData.PrazoHoras,
                SetorId: formData.SetorId,
            };

            if (!payload.Nome) {
                setErro("O nome do serviço é obrigatório.");
                return;
            }

            if (payload.SetorId <= 0) {
                setErro("Você precisa selecionar um setor válido.");
                return;
            }

            if (payload.PrazoHoras < 1 || payload.PrazoHoras > 720) {
                setErro("O prazo deve estar entre 1 e 720 horas.");
                return;
            }

            if (modoEdicao && servicoEditandoId !== null) {
                await api.put(`/api/Servicos/${servicoEditandoId}`, payload);
                alert("Serviço atualizado com sucesso.");
            } else {
                await api.post("/api/Servicos", payload);
                alert("Serviço cadastrado com sucesso.");
            }

            limparFormulario();
            await carregarServicos();
        } catch (error: any) {
            console.error(error);
            const mensagem = error?.response?.data?.message || "Erro ao salvar o serviço.";
            setErro(mensagem);
        }
    }

    function editarServico(servico: ServicoDto): void {
        setModoEdicao(true);
        setServicoEditandoId(servico.Id);

        setFormData({
            Nome: servico.Nome,
            Descricao: servico.Descricao || "",
            PrazoHoras: servico.PrazoHoras,
            SetorId: servico.Setor ? servico.Setor.Id : 0,
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    async function excluirServico(id: number): Promise<void> {
        const confirmar = window.confirm("Tem certeza que deseja excluir este serviço?");
        if (!confirmar) return;

        try {
            await api.delete(`/api/Servicos/${id}`);
            alert("Serviço excluído com sucesso.");
            await carregarServicos();
        } catch (error: any) {
            console.error(error);
            const mensagem = error?.response?.data?.message || "Erro ao excluir serviço. Verifique se existem chamados vinculados.";
            alert(mensagem);
        }
    }

    function limparFormulario(): void {
        setModoEdicao(false);
        setServicoEditandoId(null);
        setFormData({
            Nome: "",
            Descricao: "",
            PrazoHoras: 24,
            SetorId: setores.length > 0 ? setores[0].Id : 0,
        });
        setErro("");
    }

    return (
        <main className="servico-page">
            <header className="page-header">
                <h1>Gerenciamento de Serviços</h1>
                <p>Cadastre os tipos de serviços oferecidos associados a cada setor.</p>
            </header>

            <section className="form-section" aria-labelledby="titulo-formulario">
                <article className="form-container">
                    <header>
                        <h2 id="titulo-formulario">
                            {modoEdicao ? "Editar Serviço" : "Cadastrar Serviço"}
                        </h2>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="Nome">Nome do Serviço *</label>
                            <input
                                id="Nome"
                                name="Nome"
                                type="text"
                                value={formData.Nome}
                                onChange={handleInputChange}
                                required
                                maxLength={100}
                                aria-required="true"
                                placeholder="Ex: Troca de Monitor, Redefinição de Senha"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="SetorId">Setor Responsável *</label>
                            <select
                                id="SetorId"
                                name="SetorId"
                                value={formData.SetorId}
                                onChange={handleInputChange}
                                required
                                aria-required="true"
                            >
                                <option value={0}>Selecione um setor...</option>
                                {setores.map((setor) => (
                                    <option key={setor.Id} value={setor.Id}>
                                        {setor.Nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="PrazoHoras">Prazo para Resolução (em horas) *</label>
                            <input
                                id="PrazoHoras"
                                name="PrazoHoras"
                                type="number"
                                min={1}
                                max={720}
                                value={formData.PrazoHoras}
                                onChange={handleInputChange}
                                required
                                aria-required="true"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="Descricao">Descrição do Serviço</label>
                            <textarea
                                id="Descricao"
                                name="Descricao"
                                value={formData.Descricao}
                                onChange={handleInputChange}
                                maxLength={500}
                                rows={3}
                                placeholder="Detalhes sobre o que envolve este serviço..."
                            />
                        </div>

                        {erro && (
                            <p className="mensagem-erro" role="alert">
                                {erro}
                            </p>
                        )}

                        <div className="button-group">
                            <button type="submit">
                                {modoEdicao ? "Atualizar Serviço" : "Cadastrar Serviço"}
                            </button>
                            {(modoEdicao || formData.Nome) && (
                                <button type="button" onClick={limparFormulario}>
                                    Limpar / Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </article>
            </section>

            <section className="lista-section" aria-labelledby="titulo-lista">
                <header>
                    <h2 id="titulo-lista">Serviços Disponíveis</h2>
                </header>

                {loading ? (
                    <p>Carregando serviços...</p>
                ) : servicos.length === 0 ? (
                    <p>Nenhum serviço cadastrado até o momento.</p>
                ) : (
                    <article className="table-container">
                        <table>
                            <caption className="sr-only">Lista de serviços cadastrados</caption>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Serviço</th>
                                    <th>Setor</th>
                                    <th>Prazo</th>
                                    <th>Descrição</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {servicos.map((servico) => (
                                    <tr key={servico.Id}>
                                        <td>{servico.Id}</td>
                                        <td><strong>{servico.Nome}</strong></td>
                                        <td>{servico.Setor ? servico.Setor.Nome : "Não associado"}</td>
                                        <td>{servico.PrazoHoras}h</td>
                                        <td>{servico.Descricao || "Sem descrição"}</td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => editarServico(servico)}
                                                aria-label={`Editar serviço ${servico.Nome}`}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => excluirServico(servico.Id)}
                                                aria-label={`Excluir serviço ${servico.Nome}`}
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