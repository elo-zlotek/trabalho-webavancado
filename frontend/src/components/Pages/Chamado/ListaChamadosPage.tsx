import React, { useEffect, useState } from "react";
import api from "../../../api/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ChamadoListaDto from "../../../DTOs/Chamado/ChamadoListaDto";

import "./ListaChamadosPage.css";

export default function ListaChamadosPage() {
    const navigate = useNavigate();

    const [abaAtiva, setAbaAtiva] =
        useState<"meus" | "atendimentos">("meus");

    const [loading, setLoading] =
        useState<boolean>(true);

    const [chamados, setChamados] =
        useState<ChamadoListaDto[]>([]);

    useEffect(() => {
        carregarChamados();
    }, [abaAtiva]);

    function abrirChamado(id: number) {
        navigate(`/chamados/${id}`);
    }

    async function carregarChamados(): Promise<void> {

        try {

            setLoading(true);

            const rota =
                abaAtiva === "meus"
                    ? "/api/Chamados/meus"
                    : "/api/Chamados/atendimentos";

            const response =
                await api.get<ChamadoListaDto[]>(rota);

            setChamados(response.data);

        }
        catch (error) {

            console.error(error);

            toast.error(
                "Erro ao carregar chamados."
            );
        }
        finally {
            setLoading(false);
        }
    }

    function formatarData(data: string): string {

        return new Date(data)
            .toLocaleString("pt-BR");
    }

    return (
        <main className="chamados-page">

            <header className="page-header">

                <h1>Chamados</h1>

                <p>
                    Consulte seus chamados e os
                    atendimentos do seu setor.
                </p>

            </header>

            <section className="tabs-container">

                <button
                    className={
                        abaAtiva === "meus"
                            ? "tab active"
                            : "tab"
                    }
                    onClick={() => setAbaAtiva("meus")}
                >
                    Meus Chamados
                </button>

                <button
                    className={
                        abaAtiva === "atendimentos"
                            ? "tab active"
                            : "tab"
                    }
                    onClick={() =>
                        setAbaAtiva("atendimentos")
                    }
                >
                    Atendimentos
                </button>

            </section>

            {loading ? (

                <p className="loading">
                    Carregando...
                </p>

            ) : chamados.length === 0 ? (

                <div className="empty-state">
                    Nenhum chamado encontrado.
                </div>

            ) : (

                <section className="cards-container">

                    {chamados.map(chamado => (

                        <article
                            key={chamado.Id}
                            className="chamado-card"
                            onClick={() => abrirChamado(chamado.Id)}
                            style={{ cursor: "pointer" }}
                        >

                            <div className="card-header">

                                <span className="card-id">
                                    #{chamado.Id}
                                </span>

                                <span
                                    className={`status status-${chamado.Status
                                        .toLowerCase()
                                        .replaceAll(" ", "-")
                                    }`}
                                >
                                    {chamado.Status}
                                </span>

                            </div>

                            <h3>
                                {chamado.Titulo}
                            </h3>

                            <div className="card-info">

                                <p>
                                    <strong>Serviço:</strong>{" "}
                                    {chamado.NomeServico}
                                </p>

                                <p>
                                    <strong>Solicitante:</strong>{" "}
                                    {chamado.NomeSolicitante}
                                </p>

                                <p>
                                    <strong>Responsável:</strong>{" "}
                                    {chamado.NomeResponsavel ||
                                        "Não atribuído"}
                                </p>

                                <p>
                                    <strong>Criado em:</strong>{" "}
                                    {formatarData(
                                        chamado.DataCriacao
                                    )}
                                </p>

                                <p>
                                    <strong>Prazo:</strong>{" "}
                                    {formatarData(
                                        chamado.PrazoConclusao
                                    )}
                                </p>

                            </div>

                        </article>

                    ))}

                </section>

            )}

        </main>
    );
}