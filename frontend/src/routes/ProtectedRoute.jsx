import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';

export function ProtectedRoute({ allowedRoles }) {
  const { user, signed, loading } = useAuth();

  // 1. Enquanto checa o localStorage, não mostra nada
  if (loading) return null; 

  // 2. Se não estiver logado, manda pro login
  if (!signed) return <Navigate to="/" replace />;

  // 3. Se houver restrição de Role e o usuário não tiver a permissão
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/app" replace />;
  }

  // 4. Se passou em tudo, libera a rota
  return <Outlet />;
}