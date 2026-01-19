// src/layouts/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { FaHome, FaUsers, FaTasks } from 'react-icons/fa';

export default function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const menuItems = [
    { name: 'Início', icon: <FaHome />, route: '/app' },
    { name: 'Gestor', icon: <FaUsers />, route: '/app/gestor' },
    { name: 'Tarefas', icon: <FaTasks />, route: '/app/tarefas' },
  ];

  return (
    <div className="main-app-container"> {/* Wrapper total */}
      <Header onToggle={() => setIsMenuOpen(prev => !prev)} />

      <div className="layout-body"> {/* Flexbox aqui */}
        <Sidebar items={menuItems} isFechado={!isMenuOpen} />

        {/* O 'conteudo-principal' agora vai respeitar o espaço da sidebar */}
        <main className="conteudo-principal">
          <Outlet />
        </main>
      </div>
    </div>
  );
}