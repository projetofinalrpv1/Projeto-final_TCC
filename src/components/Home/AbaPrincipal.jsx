// src/components/Home/AbaPrincipal.jsx

import React from 'react';
import { useNavigate, Link, Outlet } from "react-router-dom"; // Inclua Outlet
import "./AbaPrincipal.css"; // Seus estilos CSS

// --- Sub-componentes do Layout (Mantenha aqui) ---

const Header = () => (
    /* ... (Mantenha o código do Header aqui) ... */
    <header className="cabecalho">
        <div className="cabecalho-esquerda">
            <i className="fas fa-bars menu-icon"></i>
            <h1>Minha Plataforma</h1>
        </div>
        <div className="cabecalho-direita">
            <i className="fas fa-plus add-icon"></i>
            <div className="perfil">U</div>
        </div>
    </header>
);

const menuItems = [
    { name: 'Início', icon: 'fas fa-home', active: true, route: '/h' }, // Ajuste a rota para a Home
    { name: 'Agenda', icon: 'fas fa-calendar-alt', route: '/h/agenda' }, 
    { name: 'Gestor', icon: 'fas fa-users', route: '/h/gestor' }, // Exemplo de links
    { name: 'Tarefas', icon: 'fas fa-tasks', route: '/h/tarefas' }, // Exemplo de links
];

const Sidebar = ({ items }) => (
    /* ... (Mantenha o código do Sidebar aqui, usando <Link>s) ... */
    <aside className="menu-lateral">
        <nav>
            <ul>
                {items.map((item, index) => (
                    <Link key={index} to={item.route} className="sidebar-link-wrapper">
                        <li className={item.active ? 'ativo' : ''}>
                            <i className={item.icon}></i> {item.name}
                        </li>
                    </Link>
                ))}
                
                <div className="divisor"></div>
                <li className="titulo-secao">Cursos</li>
                {/* ... links de cursos ... */}
                <div className="divisor"></div>
                <Link to="/h/configuracoes" className="sidebar-link-wrapper">
                    <li><i className="fas fa-cog"></i> Configurações</li>
                </Link>
            </ul>
        </nav>
    </aside>
);


// --- Componente Principal (Layout) ---

export function AbaPrincipal() {
    return (
        <>
            <Header />
            <div className="layout-container">
                <Sidebar items={menuItems} />

                {/* CORREÇÃO: Usar a tag <main> com a classe que tem flex-grow: 1 */}
                <main className="conteudo-principal"> 
                   <Outlet />
                </main>
                
            </div>
        </>
    );
}

// Nota: Eu envolvi o <Outlet> em uma div para aplicar um estilo seletor no CSS
// Se o seu CSS já está na tag main, você pode manter a div como <main className="conteudo-principal"><Outlet /></main>