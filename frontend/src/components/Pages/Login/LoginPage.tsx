import React, { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../../api/api";
import LoginDto from "../../../DTOs/Login/LoginDto";
import "./LoginPage.css";

export default function LoginPage() {
    const [formData, setFormData] = useState<LoginDto>({
        Login: "",
        Senha: ""
    });

    const [loading, setLoading] = useState<boolean>(false);

    const navigate = useNavigate();

    function handleInputChange(
        event: ChangeEvent<HTMLInputElement>
    ): void {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ): Promise<void> {
        event.preventDefault();
        if (!formData.Login.trim() || !formData.Senha.trim()) {
            toast.error("Usuário e senha são obrigatórios.");
            return; 
        }

        try {
            setLoading(true);

            const response = await api.post("/api/Auth/login", formData);

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("usuario", response.data.usuario);
            localStorage.setItem("nome", response.data.nome);

            toast.success("Login realizado com sucesso!");
            navigate("/chamados");

        } catch (error: any) {
            console.error(error);

            toast.error("Erro ao realizar login.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="login-page">
            <section className="login-container">
                <header>
                    <h1>Controle de Chamados</h1>
                    <p>Faça login para acessar o sistema</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="Login">
                            Usuário
                        </label>

                        <input
                            id="Login"
                            name="Login"
                            type="text"
                            value={formData.Login}
                            onChange={handleInputChange}
                            required
                            autoComplete="username"
                            placeholder="Digite seu usuário"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="Senha">
                            Senha
                        </label>

                        <input
                            id="Senha"
                            name="Senha"
                            type="password"
                            value={formData.Senha}
                            onChange={handleInputChange}
                            required
                            autoComplete="current-password"
                            placeholder="Digite sua senha"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Entrando..."
                            : "Entrar"}
                    </button>
                </form>
            </section>
        </main>
    );
}