import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
    children: React.ReactNode;
}

export default function AdminRoute({
    children
}: Props) {

    const usuarioSetorId = localStorage.getItem("usuarioSetorId");

    if (usuarioSetorId !== "1") {
        return <Navigate to="/chamados" replace />;
    }

    return <>{children}</>;
}