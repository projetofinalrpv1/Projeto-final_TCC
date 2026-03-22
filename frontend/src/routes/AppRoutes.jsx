// src/routes/AppRoutes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Login } from '../pages/Login/Login';
import { Dashboard } from '../pages/Home/Dashboard';
import { Gestor } from '../pages/Gestor/Gestor';
import { Tarefas } from '../pages/Tarefas/Tarefas';
import { Configuracoes } from '../pages/Configuracoes/Configuracoes';
import { Perfil } from '../pages/Perfil/Perfil';
import { Usuarios } from '../pages/Usuarios/Usuarios';
import { MaterialDetalhes } from '../pages/Material/MaterialDetalhes';
import MainLayout from '../layouts/MainLayout';
import { AuthProvider } from '../contexts/AuthProvider';
import { ProtectedRoute } from './ProtectedRoute';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota pública */}
          <Route path="/" element={<Login />} />

          {/* Rotas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<MainLayout />}>

              {/* Acessível por todos */}
              <Route index element={<Dashboard />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="tarefas" element={<Tarefas />} />
              <Route path="configuracoes" element={<Configuracoes />} />

              {/* Detalhes do material — acessível por todos */}
              <Route path="material/:id" element={<MaterialDetalhes />} />

              {/* Apenas GESTOR e ADMIN */}
              <Route element={<ProtectedRoute allowedRoles={['GESTOR']} />}>
                <Route path="gestor" element={<Gestor />} />
              </Route>

              {/* Apenas ADMIN */}
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