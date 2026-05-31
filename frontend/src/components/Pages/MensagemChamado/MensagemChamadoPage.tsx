import React, { useEffect, useState, ChangeEvent } from "react";
import api from "../../../api/api";
import "./MensagemChamado.css";

export default function MensagemChamadoPage() {
    const [mensagens, setMensagens] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [erro, setErro] = useState<string>("");

    const [chamadoIdInput, setChamadoIdInput] = useState<string>("1");

    const [formData, setFormData] = useState<any>({
        texto: "",
        chamadoId: 1,
        usuarioId: 1,
    });

    useEffect(() => {
        carregarMensagens(formData.chamadoId);
    }, [formData.chamadoId]);

    async function carregarMensagens(idChamado: number): Promise<void> {
        try {
            setLoading(true);
            setErro("");
            const response = await api.get<any[]>(`/api/Mensagens/Chamado/${idChamado}`);
            setMensagens(response.data);
        } catch (error) {
            console.error(error);
            setErro("Erro ao carregar o histórico de mensagens deste chamado.");
        } finally {
            setLoading(false);
        }
    }

    function handleTextAreaChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        const { name, value } = event.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    }

    function handleIdInputChange(event: ChangeEvent<HTMLInputElement>): void {
        const value = event.target.value;
        setChamadoIdInput(value);
    }

    function buscarChamadoEspecifico(event: React.SyntheticEvent): void {
        event.preventDefault();
        const id = Number(chamadoIdInput);
        if (id > 0) {
            setFormData((prev: any) => ({ ...prev, chamadoId: id }));
        }
    }

    async function handleSubmit(event: React.SyntheticEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        try {
            setErro("");

            const payload = {
                texto: formData.texto.trim(),
                chamadoId: formData.chamadoId,
                usuarioId: formData.usuarioId,
            };

            if (!payload.texto) {
                setErro("O texto da mensagem não pode estar vazio.");
                return;
            }

            await api.post("/api/Mensagens", payload);
            alert("Mensagem enviada com sucesso.");

            setFormData((prev: any) => ({ ...prev, texto: "" }));
            await carregarMensagens(payload.chamadoId);
        } catch (error: any) {
            console.error(error);
            const mensagem = error?.response?.data?.message || "Erro ao enviar a mensagem.";
            setErro(mensagem);
        }
    }

    function formatarData(dataString: string): string {
        try {
            const data = new Date(dataString);
            return data.toLocaleString("pt-BR");
        } catch {
            return dataString;
        }
    }

    return (
        <main className="mensagem-page">
            <header className="page-header">
                <h1>Interações do Chamado #{formData.chamadoId}</h1>
                <form onSubmit={buscarChamadoEspecifico} style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                    <div className="form-group" style={{ margin: 0, flexDirection: "row", alignItems: "center", gap: "0.5rem" }}>
                        <label htmlFor="buscarChamadoId" style={{ margin: 0 }}>Visualizar Chamado ID:</label>
                        <input
                            id="buscarChamadoId"
                            type="number"
                            value={chamadoIdInput}
                            onChange={handleIdInputChange}
                            min={1}
                            style={{ padding: "0.5rem", width: "80px" }}
                        />
                    </div>
                    <button type="submit" style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>Mudar</button>
                </form>
            </header>

            <section className="timeline-section" aria-label="Histórico de interações">
                {loading ? (
                    <p>Carregando histórico...</p>
                ) : mensagens.length === 0 ? (
                    <p>Nenhuma mensagem registrada para este chamado ainda.</p>
                ) : (
                    <article className="timeline-container">
                        {mensagens.map((msg: any) => (
                            <div key={msg.id || msg.Id} className="mensagem-card">
                                <div className="mensagem-meta">
                                    <span className="mensagem-autor">
                                        {msg.usuario?.nome || msg.usuarioNome || msg.Usuario?.Nome || "Sistema / Colaborador"}
                                    </span>
                                    <span className="mensagem-data">
                                        {formatarData(msg.dataEnvio || msg.DataEnvio)}
                                    </span>
                                </div>
                                <div className="mensagem-texto">
                                    {msg.texto || msg.Texto}
                                </div>
                            </div>
                        ))}
                    </article>
                )}
            </section>

            <section className="form-section">
                <article className="form-container">
                    <header>
                        <h2>Nova Interação</h2>
                    </header>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="texto">Sua Resposta / Observação *</label>
                            <textarea
                                id="texto"
                                name="texto"
                                value={formData.texto}
                                onChange={handleTextAreaChange}
                                required
                                placeholder="Digite aqui os detalhes da atualização do chamado..."
                            />
                        </div>

                        {erro && (
                            <p className="mensagem-erro" role="alert">
                                {erro}
                            </p>
                        )}

                        <div className="button-group">
                            <button type="submit">Enviar Mensagem</button>
                        </div>
                    </form>
                </article>
            </section>
        </main>
    );
}