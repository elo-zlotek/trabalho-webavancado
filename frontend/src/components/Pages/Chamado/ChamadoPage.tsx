import React, { useEffect, useState, ChangeEvent } from "react";
import api from "../../../api/api";
import toast from "react-hot-toast";
import CriarChamadoDto from "../../../DTOs/Chamado/CriarChamadoDto";
import ServicoDto from "../../../DTOs/Servico/ServicoDto";
import SetorDto from "../../../DTOs/Setor/SetorDto";
import { useNavigate, useParams } from "react-router-dom";

import "./ChamadoPage.css";
import ChamadoDto from "../../../DTOs/Chamado/ChamadoDto";

export default function ChamadoPage() {
    const [setores, setSetores] = useState<SetorDto[]>([]);
    const [servicos, setServicos] = useState<ServicoDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [setorId, setSetorId] = useState<number>(0);
    const [formData, setFormData] = useState<CriarChamadoDto>({
        Titulo: "",
        Descricao: "",
        ServicoId: 0
    });

    const { id } = useParams();
    const navigate = useNavigate();
    const modoEdicao = !!id;

    const servicoSelecionado = servicos.find(
        s => s.Id === formData.ServicoId
    );

    useEffect(() => {
        carregarSetores();

        if (id) {
            carregarChamado(Number(id));
        }

    }, [id]);

    async function carregarChamado(chamadoId: number): Promise<void> {

        try {

            const response = await api.get<ChamadoDto>(`/api/Chamados/${chamadoId}`);

            const chamado = response.data;

            setFormData({
                Titulo: chamado.Titulo,
                Descricao: chamado.Descricao || "",
                ServicoId: chamado.Servico?.Id || 0
            });

            if (chamado.Servico?.SetorId) {

                setSetorId(
                    chamado.Servico.SetorId
                );

                await carregarServicos(
                    chamado.Servico.SetorId
                );
            }

        } catch (error) {

            console.error(error);

            toast.error(
                "Erro ao carregar chamado."
            );
        }
    }

    async function carregarSetores(): Promise<void> {
        try {
            const response =
                await api.get<SetorDto[]>("/api/Setores");
            
            console.log(response.data);

            setSetores(response.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar os setores.");
        }
        finally {
            setLoading(false);
        }
    }

    async function carregarServicos(
        idSetor: number
    ): Promise<void> {
        try {
            const response =
                await api.get<ServicoDto[]>(
                    `/api/Servicos/setor/${idSetor}`
                );

            setServicos(response.data);
        }
        catch (error) {
            console.error(error);
            toast.error("Erro ao carregar os serviços.");
        }
    }

    function handleInputChange(
        event: ChangeEvent<
            HTMLInputElement |
            HTMLTextAreaElement |
            HTMLSelectElement
        >
    ): void {

        const { name, value } = event.target;

        if (name === "SetorId") {

            const novoSetorId = Number(value);

            setSetorId(novoSetorId);

            setFormData(prev => ({
                ...prev,
                ServicoId: 0
            }));

            setServicos([]);

            if (novoSetorId > 0) {
                carregarServicos(novoSetorId);
            }

            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]:
                name === "ServicoId"
                    ? Number(value)
                    : value
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ): Promise<void> {

        event.preventDefault();

        try {

            if (!formData.Titulo.trim()) {
                toast.error("Informe o título.");
                return;
            }

            if (formData.ServicoId <= 0) {
                toast.error("Selecione um serviço.");
                return;
            }

            if (modoEdicao) {

                await api.put(
                    `/api/Chamados/${id}`,
                    formData
                );

                toast.success("Chamado atualizado com sucesso.");

            } else {

                await api.post(
                    "/api/Chamados",
                    formData
                );

                toast.success("Chamado criado com sucesso!");
            }

            toast.success("Chamado criado com sucesso!");

            setSetorId(0);

            setServicos([]);

            setFormData({
                Titulo: "",
                Descricao: "",
                ServicoId: 0
            });

            navigate("/chamados");
        }
        catch (error: any) {

            console.error(error);

            const mensagem =
                error?.response?.data?.message ||
                "Erro ao criar chamado.";

            toast.error(mensagem);
        }
    }

    if (loading) {
        return <p>Carregando...</p>;
    }

    return (
        <main className="chamado-page">

            <header className="page-header">
                <h1>
                    {modoEdicao
                        ? "Editar Chamado"
                        : "Abertura de Chamado"}
                </h1>
                <p>
                    Informe o setor e o serviço desejado.
                </p>
            </header>

            <section className="form-section">

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="SetorId">
                            Setor
                        </label>

                        <select
                            id="SetorId"
                            name="SetorId"
                            value={setorId}
                            onChange={handleInputChange}
                            required
                        >
                            <option value={0}>
                                Selecione...
                            </option>

                            {setores.map(setor => (
                                <option
                                    key={setor.Id}
                                    value={setor.Id}
                                >
                                    {setor.Nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="ServicoId">
                            Serviço
                        </label>

                        <select
                            id="ServicoId"
                            name="ServicoId"
                            value={formData.ServicoId}
                            onChange={handleInputChange}
                            required
                            disabled={setorId === 0}
                        >
                            <option value={0}>
                                Selecione...
                            </option>

                            {servicos.map(servico => (
                                <option
                                    key={servico.Id}
                                    value={servico.Id}
                                >
                                    {servico.Nome}
                                </option>
                            ))}
                        </select>

                        {servicoSelecionado && (
                            <div className="servico-info">
                                <h4>
                                    Informações do Serviço
                                </h4>

                                <p>
                                    <strong>Prazo estimado:</strong>{" "}
                                    {servicoSelecionado.PrazoHoras} horas
                                </p>

                                <p>
                                    <strong>Descrição:</strong>{" "}
                                    {servicoSelecionado.Descricao ||
                                        "Nenhuma descrição cadastrada."}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="Titulo">
                            Título
                        </label>

                        <input
                            id="Titulo"
                            name="Titulo"
                            type="text"
                            value={formData.Titulo}
                            onChange={handleInputChange}
                            maxLength={150}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="Descricao">
                            Descrição
                        </label>

                        <textarea
                            id="Descricao"
                            name="Descricao"
                            rows={5}
                            value={formData.Descricao}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button type="submit">
                        {modoEdicao
                            ? "Salvar Alterações"
                            : "Abrir Chamado"}
                    </button>

                </form>

            </section>
        </main>
    );
}