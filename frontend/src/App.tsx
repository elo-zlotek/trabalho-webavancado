import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import SetorPage from './components/Pages/Setor/SetorPage';


function App() {
  return (
    <Routes>
        <Route path="/" element={<SetorPage />} />
        <Route path="/setores" element={<SetorPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;