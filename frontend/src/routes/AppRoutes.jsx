//src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import {Login} from "../pages/Login/Login";
import {Dashboard} from "../pages/Home/Dashboard";
import {Gestor} from "../pages/Gestor/Gestor";
import {Tarefas} from "../pages/Tarefas/Tarefas";
import {Configuracoes} from "../pages/Configuracoes/Configuracoes";
import { Perfil } from "../pages/Perfil/Perfil";
import MainLayout from "../layouts/MainLayout";
import { Usuarios } from "../pages/Usuarios/Usuarios";
import { AuthProvider } from '../contexts/AuthProvider';
import { ProtectedRoute } from './ProtectedRoute';


export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
<Routes>
  <Route path="/" element={<Login />} />

  <Route element={<ProtectedRoute />}> 
    <Route path="/app" element={<MainLayout />}>
      {/* Abas acessíveis por TODOS (Admin, Gestor e Colaborador) */}
      <Route index element={<Dashboard />} />
      <Route path="perfil" element={<Perfil />} />
      <Route path="tarefas" element={<Tarefas />} />
      <Route path="configuracoes" element={<Configuracoes />} />

      {/* Aba de Gestor: Acessível por Admin e Gestor */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'GESTOR']} />}>
        <Route path="gestor" element={<Gestor />} />
      </Route>

      {/* PAINEL EXCLUSIVO: Apenas o Admin entra aqui */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
        <Route path="usuarios" element={<Usuarios />} />
      </Route>
      
    </Route>
  </Route>
</Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}