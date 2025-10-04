// src/components/Home/AbaPrincipal.jsx

import React, { useState } from 'react';
import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaTasks, FaCog, FaBars, FaPlus } from 'react-icons/fa';
import "./AbaPrincipal.css";

// --- Sub-componentes do Layout ---

const Header = ({ onToggle }) => (
  <header className="cabecalho">
    <div className="cabecalho-esquerda">
      <FaBars className="menu-icon" onClick={onToggle} />
      <h1>Minha Plataforma</h1>
    </div>
    <div className="cabecalho-direita">
      <FaPlus className="add-icon" />
      <div className="perfil">U</div>
    </div>
  </header>
);

const menuItems = [
  { name: 'Início', icon: <FaHome />, route: '/h' },
  { name: 'Gestor', icon: <FaUsers />, route: '/h/gestor' },
  { name: 'Tarefas', icon: <FaTasks />, route: '/h/tarefas' },
];

const Sidebar = ({ items, isFechado }) => {
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
              end={item.route === '/h'}
            >
              {({ isActive }) => (
                <li className={isActive ? 'ativo' : ''}>
                  {item.icon} <span className="item-name">{item.name}</span>
                </li>
              )}
            </NavLink>
          ))}
          <div className="divisor"></div>
          <li className="titulo-secao">Materiais</li>
          <div className="divisor"></div>
          <Link to="/h/configuracoes" className="sidebar-link-wrapper">
            <li className={location.pathname === '/h/configuracoes' ? 'ativo' : ''}>
              <FaCog />
              <span className="item-name">Configurações</span>
            </li>
          </Link>
        </ul>
      </nav>
    </aside>
  );
};


// --- Componente Principal (Layout) ---

export function AbaPrincipal() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const toggleSidebar = () => {
    setIsMenuOpen(prev => !prev);
  };

  return (
    <>
      <Header onToggle={toggleSidebar} />

      <div className="layout-container">
        <Sidebar items={menuItems} isFechado={!isMenuOpen} />

        <main className="conteudo-principal">
          <Outlet />
        </main>
      </div>
    </>
  );
}