import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './components/Pages/Login/LoginPage';
import SetorPage from './components/Pages/Setor/SetorPage';
import ServicoPage from './components/Pages/Servico/ServicoPage';
import UsuarioPage from './components/Pages/Usuario/UsuarioPage';
import ChamadoPage from './components/Pages/Chamado/ChamadoPage';
import MensagemChamadoPage from './components/Pages/MensagemChamado/MensagemChamadoPage';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './auth/ProtectedRoute';
import { Toaster } from 'react-hot-toast';
import ListaChamadosPage from './components/Pages/Chamado/ListaChamadosPage';
import ChamadoDetalhePage from './components/Pages/Chamado/ChamadoDetalhePage';

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
        <Route path="/usuarios" element={<UsuarioPage />} />
        <Route path="/mensagens" element={<MensagemChamadoPage />} />
        <Route path="/chamados" element={<ListaChamadosPage />} />
        <Route path="/chamados/:id" element={<ChamadoDetalhePage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
    </>
  );
}

export default App;