import React, {useEffect, useState, ChangeEvent} from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import api from "../../../api/api";
import ChamadoDto from "../../../DTOs/Chamado/ChamadoDto";
import MensagemChamadoDto from "../../../DTOs/Chamado/MensagemChamadoDto";
import CriarMensagemChamadoDto from "../../../DTOs/Chamado/CriarMensagemChamadoDto";
import { useNavigate } from "react-router-dom";

import "./ChamadoDetalhePage.css";

export default function ChamadoDetalhePage() {

    const { id } = useParams();
    const [chamado, setChamado] = useState<ChamadoDto | null>(null);
    const [mensagens, setMensagens] = useState<MensagemChamadoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [novaMensagem, setNovaMensagem] = useState<string>("");
    const [alterandoStatus, setAlterandoStatus] = useState<boolean>(false);
    const usuarioId = Number(localStorage.getItem("usuarioId"));
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            return;
        }
        carregarDados(Number(id));
    }, [id]);

    async function carregarDados(chamadoId: number): Promise<void> {

        try {

            setLoading(true);

            const [
                chamadoResponse,
                mensagensResponse
            ] = await Promise.all([
                api.get<ChamadoDto>(
                    `/api/Chamados/${chamadoId}`
                ),
                api.get<MensagemChamadoDto[]>(
                    `/api/chamados/${chamadoId}/mensagens`
                )
            ]);

            setChamado(chamadoResponse.data);
            setMensagens(mensagensResponse.data);

        } catch (error) {

            console.error(error);

            toast.error("Erro ao carregar os dados do chamado.");

        } finally {

            setLoading(false);
        }
    }

    async function carregarMensagens(chamadoId: number): Promise<void> {
        try {
            const response =
                await api.get<MensagemChamadoDto[]>(
                    `/api/chamados/${chamadoId}/mensagens`
                );

            setMensagens(response.data);

        } catch (error) {

            console.error(error);
        }
    }

    async function enviarMensagem(event: React.FormEvent<HTMLFormElement>): Promise<void> {

        event.preventDefault();

        try {

            if (!novaMensagem.trim()) {

                toast.error(
                    "Digite uma mensagem."
                );

                return;
            }

            const payload:
                CriarMensagemChamadoDto = {

                Mensagem:
                    novaMensagem.trim()
            };

            await api.post(
                `/api/chamados/${id}/mensagens`,
                payload
            );

            toast.success(
                "Mensagem enviada."
            );

            setNovaMensagem("");

            await carregarMensagens(Number(id));

        } catch (error: any) {

            console.error(error);

            const mensagem =
                error?.response?.data?.message ||
                "Erro ao enviar mensagem.";

            toast.error(mensagem);
        }
    }

    async function assumirChamado(): Promise<void> {

        try {

            await api.patch(`/api/Chamados/${id}/assumir`);

            toast.success("Chamado assumido com sucesso.");

            await carregarDados(Number(id));

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Erro ao assumir chamado."
            );
        }
    }

    async function alterarStatus(novoStatus: string): Promise<void> {
        try {

            setAlterandoStatus(true);

            await api.patch(
                `/api/Chamados/${id}/status`,
                {
                    Status: novoStatus
                }
            );

            toast.success("Status do chamado atualizado.");

            await carregarDados(Number(id));

        } catch (error: any) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                "Erro ao alterar status."
            );

        } finally {

            setAlterandoStatus(false);
        }
    }

    function obterProximosStatus(): string[] {

        if (!chamado) {
            return [];
        }

        switch (chamado.Status) {

            case "Aberto":
                return [
                    "Em Atendimento",
                    "Cancelado"
                ];

            case "Em Atendimento":
                return [
                    "Aguardando Usuário",
                    "Concluído",
                    "Cancelado"
                ];

            case "Aguardando Usuário":
                return [
                    "Em Atendimento"
                ];

            default:
                return [];
        }
    }

    function formatarData(data?: string): string {

        if (!data) {
            return "-";
        }

        return new Date(data)
            .toLocaleString("pt-BR");
    }

    async function excluirChamado(): Promise<void> {

        const resultado = await Swal.fire({
            title: "Excluir chamado?",
            text: "Esta ação não poderá ser desfeita.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Sim, excluir",
            cancelButtonText: "Cancelar",
            reverseButtons: true
        });
        
        if (!resultado.isConfirmed) {
            return;
        }

        try {

            await api.delete(
                `/api/Chamados/${id}`
            );

            toast.success(
                "Chamado excluído com sucesso."
            );

            window.location.href = "/chamados";

        } catch (error: any) {

            toast.error(
                error?.response?.data?.message ||
                "Erro ao excluir chamado."
            );
        }
    }

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!chamado) {
        return <p>Chamado não encontrado.</p>;
    }

    const usuarioEhSolicitante =
        chamado.Usuario?.Id === usuarioId;

    const usuarioEhResponsavel =
        chamado.Responsavel?.Id === usuarioId;

    const podeEnviarMensagem =
        usuarioEhSolicitante ||
        usuarioEhResponsavel;

    const mostrarBotaoAssumir =
        chamado.Status === "Aberto" && !chamado.Responsavel && chamado.Servico && chamado.Servico.SetorId === Number(localStorage.getItem("usuarioSetorId"));

    const podeEditarOuExcluir =
        usuarioEhSolicitante &&
        !chamado.Responsavel &&
        chamado.Status !== "Concluído" &&
        chamado.Status !== "Cancelado";

    return (
        <main className="chamado-detalhe-page">

            <header className="page-header">

                <h1>
                    Chamado #{chamado.Id}
                </h1>

                <p>
                    {chamado.Titulo}
                </p>

            </header>

            <section className="detalhes-card">

                <div className="info-grid">

                    <div>
                        <strong>Status</strong>
                        <span>
                            {chamado.Status}
                        </span>
                    </div>

                    <div>
                        <strong>Serviço</strong>
                        <span>
                            {chamado.Servico?.Nome ?? "-"}
                        </span>
                    </div>

                    <div>
                        <strong>Solicitante</strong>
                        <span>
                            {chamado.Usuario?.Nome ?? "-"}
                        </span>
                    </div>

                    <div>
                        <strong>Responsável</strong>
                        <span>
                            {chamado.Responsavel?.Nome ??
                                "Não atribuído"}
                        </span>
                    </div>

                    <div>
                        <strong>
                            Data de abertura
                        </strong>

                        <span>
                            {formatarData(
                                chamado.DataCriacao
                            )}
                        </span>
                    </div>

                    <div>
                        <strong>Prazo</strong>

                        <span>
                            {formatarData(
                                chamado.PrazoConclusao
                            )}
                        </span>
                    </div>

                    <div>
                        <strong>Conclusão</strong>

                        <span>
                            {formatarData(
                                chamado.DataConclusao
                            )}
                        </span>
                    </div>

                </div>

                <div className="descricao-box">

                    <h3>Descrição</h3>

                    <p>
                        {chamado.Descricao ||
                            "Nenhuma descrição informada."}
                    </p>

                </div>

            </section>

            <section className="acoes-section">

                <h2>Ações</h2>

                {mostrarBotaoAssumir && (
                    <button
                        onClick={assumirChamado}
                    >
                        Assumir Chamado
                    </button>
                )}

                {usuarioEhResponsavel &&
                    obterProximosStatus().length > 0 && (

                        <div
                            style={{
                                display: "flex",
                                gap: "0.5rem",
                                flexWrap: "wrap"
                            }}
                        >

                            {obterProximosStatus().map(
                                status => (

                                    <button
                                        key={status}
                                        disabled={
                                            alterandoStatus
                                        }
                                        onClick={() =>
                                            alterarStatus(
                                                status
                                            )
                                        }
                                    >
                                        {status}
                                    </button>

                                )
                            )}

                        </div>

                    )}
                
                {podeEditarOuExcluir && (
                    <>
                        <button
                            onClick={() =>
                                navigate(
                                    `/chamados/${chamado.Id}/editar`
                                )
                            }
                        >
                            Editar
                        </button>

                        <button
                            onClick={excluirChamado}
                        >
                            Excluir
                        </button>
                    </>
                )}

            </section>

            <section className="mensagens-section">

                <h2>Histórico</h2>

                {mensagens.length === 0 ? (

                    <p>
                        Nenhuma mensagem registrada.
                    </p>

                ) : (

                    <div className="mensagens-lista">

                        {mensagens.map(
                            mensagem => (

                                <article
                                    key={mensagem.Id}
                                    className="mensagem-card"
                                >

                                    <div className="mensagem-header">

                                        <strong>
                                            {mensagem.Usuario}
                                        </strong>

                                        <span>
                                            {formatarData(
                                                mensagem.DataEnvio
                                            )}
                                        </span>

                                    </div>

                                    <p>
                                        {mensagem.Mensagem}
                                    </p>

                                </article>

                            )
                        )}

                    </div>

                )}

            </section>

            {podeEnviarMensagem && (

                <section
                    className="nova-mensagem-section"
                >

                    <h2>
                        Nova Mensagem
                    </h2>

                    <form
                        onSubmit={
                            enviarMensagem
                        }
                    >

                        <textarea
                            value={
                                novaMensagem
                            }
                            onChange={(
                                event:
                                ChangeEvent<HTMLTextAreaElement>
                            ) =>
                                setNovaMensagem(
                                    event.target.value
                                )
                            }
                            rows={5}
                            placeholder="Digite sua mensagem..."
                        />

                        <button
                            type="submit"
                        >
                            Enviar Mensagem
                        </button>

                    </form>

                </section>

            )}

        </main>
    );
}