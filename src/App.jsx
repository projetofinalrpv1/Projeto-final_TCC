// src/App.js

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/Login/Login';
import { AbaPrincipal } from './components/Home/AbaPrincipal';
import { HomeDashboard } from './components/Home/DashboardAbaPrincipal'; // Importe o novo componente
import { Gestor } from './components/AbaGestor/Gestor';
import { Tarefas } from './components/AbaTarefas/Tarefas';
import { Configuracoes } from './components/AbaConfiguracoes/Configuracoes';

function App() {
  return(
    <>
      <Router>
        <Routes>
          {/* Rota Raiz: A tela de Login */}
          <Route path="/" element={<Login/>} /> 

          {/* Rota Pai: O Layout (Header e Sidebar) */}
          <Route path="/h" element={<AbaPrincipal />}>
            
            {/* Rota Filha: A Página Inicial Padrão (Dashboard) */}
            <Route index element={<HomeDashboard />} />
            
            {/* Outras Rotas Filhas que usam o mesmo Layout */}
            <Route path="gestor" element={<Gestor />} />
            <Route path="tarefas" element={<Tarefas />} />
            <Route path="configuracoes" element={<Configuracoes />} />


            {/* Rotas de Detalhe, se necessário (exemplo) */}
            <Route path="curso/:id" element={<div>Página do Curso Detalhe</div>} />
            
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export {App};