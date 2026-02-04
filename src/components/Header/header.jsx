import { useState } from 'react';
import { FaBars, FaPlus, FaSignOutAlt, FaUserPlus, FaUserShield } from 'react-icons/fa';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from "../../contexts/useAuth";
import "./Header.css";

export function Header({ onToggle }) {
  const { user, logout } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAberto(!menuAberto);

  // Fecha o menu e navega para a rota especificada
  const handleNavigation = (path) => {
    setMenuAberto(false);
    navigate(path);
  };

  const inicial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="cabecalho">
      <div className="cabecalho-esquerda">
        <FaBars className="menu-icon" onClick={onToggle} />
        <h1>ON THE JOB</h1>
      </div>

      <div className="cabecalho-direita">
        <FaPlus className="add-icon" title="Adicionar novo" />
        
        <div className="perfil-container-google">
          {/* Círculo do Perfil (Gatilho do Menu) */}
          <div className="perfil-circulo" onClick={toggleMenu}>
            {inicial}
          </div>

          {/* Menu Dropdown estilo Google */}
          {menuAberto && (
            <>
              {/* Overlay invisível para fechar ao clicar fora */}
              <div className="menu-overlay" onClick={() => setMenuAberto(false)} />
              
              <div className="google-menu">
                <div className="google-menu-header">
                  <p className="user-email">{user?.email}</p>
                  
                  <div className="avatar-grande">
                    {inicial}
                  </div>
                  
                  <h3>Olá, {user?.name?.split(' ')[0]}!</h3>
                  
                  <div className="button-group-vertical">
                    <button 
                      className="btn-gerenciar" 
                      onClick={() => handleNavigation('/app/perfil')}
                    >
                      Gerenciar sua conta
                    </button>

                    {/* Botão exclusivo para Admin/Gestor */}
                    {(user?.role === 'admin' || user?.role === 'gestor') && (
                      <button 
                        className="btn-admin" 
                        onClick={() => handleNavigation('/app/usuarios')}
                      >
                        <FaUserShield /> Painel de Usuários
                      </button>
                    )}
                  </div>
                </div>

                <div className="google-menu-footer">
                  <button className="footer-item">
                    <FaUserPlus /> Adicionar conta
                  </button>
                  <button className="footer-item" onClick={logout}>
                    <FaSignOutAlt /> Sair
                  </button>
                </div>
                
                <div className="google-menu-legal">
                  <span>Política de Privacidade</span> • <span>Termos de Serviço</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}