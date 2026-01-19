import { NavLink, Link, useLocation } from "react-router-dom";
import { FaCog } from "react-icons/fa";
import "./Sidebar.css";

export function Sidebar({ items, isFechado }) {
  const location = useLocation();

  return (
    <aside className={`menu-lateral ${isFechado ? 'fechado' : ''}`}>
      <nav>
        <ul>
          {items.map((item, index) => (
            <NavLink
              key={index}
              to={item.route}
              className="sidebar-link-wrapper"
              end={item.route === '/app'}
            >
              {({ isActive }) => (
                <li className={isActive ? 'ativo' : ''}>
                  {item.icon}
                  <span className="item-name">{item.name}</span>
                </li>
              )}
            </NavLink>
          ))}

          <div className="divisor"></div>
          <li className="titulo-secao">Materiais</li>
          <div className="divisor"></div>

          <Link to="/app/configuracoes" className="sidebar-link-wrapper">
            <li className={location.pathname === '/app/configuracoes' ? 'ativo' : ''}>
              <FaCog />
              <span className="item-name">Configurações</span>
            </li>
          </Link>
        </ul>
      </nav>
    </aside>
  );
}
