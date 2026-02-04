import { useState } from 'react';
import { FaBars, FaPlus, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/useAuth";
import "./Header.css";

export function Header({ onToggle }) {
  const { user, logout } = useAuth(); // Certifique-se que o logout existe no seu contexto
  const [menuAberto, setMenuAberto] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAberto(!menuAberto);

  return (
    <header className="cabecalho">
      <div className="cabecalho-esquerda">
        <FaBars className="menu-icon" onClick={onToggle} />
        <h1>ON THE JOB</h1>
      </div>

      <div className="cabecalho-direita">
        <FaPlus className="add-icon" />
        
        <div className="perfil-container-google">
          <div className="perfil-circulo" onClick={toggleMenu}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>

          {menuAberto && (
            <div className="google-menu">
              <div className="google-menu-header">
                <p className="user-email">{user?.email}</p>
                <div className="avatar-grande">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <h3>Olá, {user?.name?.split(' ')[0]}!</h3>
                <button 
                  className="btn-gerenciar" 
                  onClick={() => { navigate('/app/perfil'); setMenuAberto(false); }}
                >
                  Gerenciar sua conta
                </button>
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
          )}
        </div>
      </div>
    </header>
  );
}