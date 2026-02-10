// src/components/Sidebar/Sidebar.jsx
import { NavLink, Link, useLocation } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import { useAuth } from "../../contexts/useAuth";
import "./Sidebar.css";

export function Sidebar({ items, isFechado }) {
  const location = useLocation();
  const { user } = useAuth();

  // Lógica de filtro aprimorada
  const filteredItems = items.filter(item => {
    // Se o usuário for admin, ele tem acesso total a todos os itens da lista
    if (user?.role === 'admin') return true;
    
    // Se o item não tiver restrição de roles, qualquer um vê
    if (!item.roles) return true;
    
    // Caso contrário, verifica se o cargo do usuário está permitido
    return item.roles.includes(user?.role);
  });

  return (
    <aside className={`menu-lateral ${isFechado ? "fechado" : ""}`}>
      <nav>
        <ul>
          {filteredItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.route}
              className="sidebar-link-wrapper"
              end={item.route === "/app"}
            >
              {({ isActive }) => (
                <li className={isActive ? "ativo" : ""}>
                  {item.icon}
                  <span className="item-name">{item.name}</span>
                </li>
              )}
            </NavLink>
          ))}

          {/* SEÇÃO DE CONTA - ACESSÍVEL PARA TODOS */}
          <div className="divisor"></div>
          <li className="titulo-secao">Conta</li>
          <div className="divisor"></div>

          <NavLink 
            to="/app/configuracoes" 
            className="sidebar-link-wrapper"
          >
            {({ isActive }) => (
              <li className={isActive ? "ativo" : ""}>
                <FaCog />
                <span className="item-name">Configurações</span>
              </li>
            )}
          </NavLink>
        </ul>
      </nav>
    </aside>
  );
}