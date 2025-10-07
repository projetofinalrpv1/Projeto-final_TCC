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
     
          <Route path="/" element={<Login/>} /> 

       
          <Route path="/h" element={<AbaPrincipal />}>
            
       
            <Route index element={<HomeDashboard />} />
            
         
            <Route path="gestor" element={<Gestor />} />
            <Route path="tarefas" element={<Tarefas />} />
            <Route path="configuracoes" element={<Configuracoes />} />


           
            <Route path="curso/:id" element={<div>Página do Curso Detalhe</div>} />
            
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export {App};