import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SetorPage from './components/Pages/Setor/SetorPage';
import ServicoPage from './components/Pages/Servico/ServicoPage';
import UsuarioPage from './components/Pages/Usuario/UsuarioPage';
import MensagemChamadoPage from './components/Pages/MensagemChamado/MensagemChamadoPage';

function App() {
  return (
    <Routes>
        <Route path="/" element={<SetorPage />} />
        <Route path="/setores" element={<SetorPage />} />
        <Route path="/servicos" element={<ServicoPage />} />
        <Route path="/usuarios" element={<UsuarioPage />} />
        <Route path="/mensagens" element={<MensagemChamadoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;