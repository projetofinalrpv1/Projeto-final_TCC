// src/layouts/MainLayout.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Header/Header";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { FaHome, FaUsers, FaTasks, FaUserShield } from "react-icons/fa";
import { useAuth } from "../contexts/useAuth";

export default function MainLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { user } = useAuth();

  const menuItems = [
    {
      name: "Início",
      icon: <FaHome />,
      route: "/app",
      roles: ["colaborador", "gestor", "admin"]
    },
    {
      name: "Tarefas",
      icon: <FaTasks />,
      route: "/app/tarefas",
      roles: ["colaborador", "gestor", "admin"]
    },
    {
      name: "Gestor",
      icon: <FaUsers />,
      route: "/app/gestor",
      roles: ["gestor", "admin"]
    },
    {
      name: "Usuários",
      icon: <FaUserShield />,
      route: "/app/usuarios",
      roles: ["admin"]
    }
  ];

  return (
    <div className="main-app-container">
      <Header onToggle={() => setIsMenuOpen(prev => !prev)} />

      <div className="layout-body">
        <Sidebar items={menuItems} isFechado={!isMenuOpen} />

        <main className="conteudo-principal">
          <Outlet />
        </main>
      </div>
    </div>
  );
}