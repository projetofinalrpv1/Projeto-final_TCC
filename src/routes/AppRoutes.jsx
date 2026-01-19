import { BrowserRouter, Routes, Route } from "react-router-dom";

import {Login} from "../pages/Login/Login";
import {Dashboard} from "../pages/Home/Dashboard";
import {Gestor} from "../pages/Gestor/Gestor";
import {Tarefas} from "../pages/Tarefas/Tarefas";
import {Configuracoes} from "../pages/Configuracoes/Configuracoes";

import MainLayout from "../layouts/MainLayout";

import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Login />} />

          {/* PROTEÇÃO GLOBAL: Só entra no MainLayout se estiver logado */}
          <Route element={<ProtectedRoute />}> 
            <Route path="/app" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              
              {/* Restrição específica para Gestores */}
              <Route element={<ProtectedRoute allowedRoles={['admin', 'gestor']} />}>
                <Route path="gestor" element={<Gestor />} />
              </Route>

              <Route path="tarefas" element={<Tarefas />} />
              <Route path="configuracoes" element={<Configuracoes />} />
            </Route>
          </Route>
          
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}