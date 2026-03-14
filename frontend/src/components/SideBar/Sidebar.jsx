// src/components/Sidebar/Sidebar.jsx
import { NavLink } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import { useAuth } from "../../contexts/useAuth";
import "./Sidebar.css";

export function Sidebar({ items, isFechado }) {
  const { user } = useAuth();

  const filteredItems = items.filter(item => {
    // Sem restrição de roles — qualquer um vê
    if (!item.roles) return true;

    // Compara com o role exato vindo do banco (ex: 'ADMIN', 'GESTOR', 'COLABORADOR')
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