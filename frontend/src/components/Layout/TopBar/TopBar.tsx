import { Link, useNavigate } from "react-router-dom";
import "./TopBar.css";

export default function TopBar() {
    const navigate = useNavigate();

    const nome =
        localStorage.getItem("nome") ||
        "Usuário";

    function logout(): void {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        localStorage.removeItem("nome");

        navigate("/login");
    }

    return (
        <header className="topbar">
            <div className="topbar-logo">
                <h2>Controle de Chamados</h2>
            </div>

            <nav className="topbar-nav">
                <Link to="/chamados">
                    Chamados
                </Link>

                <Link to="/servicos">
                    Serviços
                </Link>

                <Link to="/setores">
                    Setores
                </Link>

                <Link to="/usuarios">
                    Usuários
                </Link>
            </nav>

            <div className="topbar-user">
                <span>
                    {nome}
                </span>

                <button
                    type="button"
                    onClick={logout}
                >
                    Sair
                </button>
            </div>
        </header>
    );
}