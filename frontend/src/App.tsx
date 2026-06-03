import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Pages/Login/LoginPage';
import SetorPage from './components/Pages/Setor/SetorPage';
import ServicoPage from './components/Pages/Servico/ServicoPage';
import UsuarioPage from './components/Pages/Usuario/UsuarioPage';
import ChamadoPage from './components/Pages/Chamado/ChamadoPage';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import ListaChamadosPage from './components/Pages/Chamado/ListaChamadosPage';
import ChamadoDetalhePage from './components/Pages/Chamado/ChamadoDetalhePage';
import AdminRoute from './auth/AdminRoute';

function App() {
  return (
    <>
    <Toaster
      position="top-right"
      toastOptions={{
          duration: 3000,
      }}
    />
    <Routes>

      <Route path="/login" element={<LoginPage />} />

      <Route  element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/setores" element={<SetorPage />} />
        <Route path="/servicos" element={<ServicoPage />} />
        <Route
            path="/usuarios"
            element={
                <AdminRoute>
                    <UsuarioPage />
                </AdminRoute>
            }
        />
        <Route path="/novoChamado" element={<ChamadoPage />} />
        <Route path="/chamados/:id/editar" element={<ChamadoPage />}/>
        <Route path="/chamados" element={<ListaChamadosPage />} />
        <Route path="/chamados/:id" element={<ChamadoDetalhePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;