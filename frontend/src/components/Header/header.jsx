// src/components/Header/header.jsx
import { useState, useEffect } from 'react';
import { FaBars, FaPlus, FaSignOutAlt, FaUserPlus, FaUserShield, FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import "./Header.css";

export function Header({ onToggle }) {
  const { user, signOut } = useAuth();
  const [menuAberto, setMenuAberto] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [sinoAberto, setSinoAberto] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuAberto(!menuAberto);
  const inicial = user?.name ? user.name.charAt(0).toUpperCase() : "U";
  const podeGerenciar = ['ADMIN', 'GESTOR'].includes(user?.role);

  // Busca colaboradores próximos de 30 dias
  useEffect(() => {
    if (!podeGerenciar || !user?.workAreaId) return;

    async function fetchNotificacoes() {
      try {
        const response = await api.get('/api/users/team');
        const hoje = new Date();

        const alertas = response.data
          .filter(membro => {
            if (!membro.createdAt) return false;
            const admissao = new Date(membro.createdAt);
            const diasDesdeAdmissao = Math.floor((hoje - admissao) / (1000 * 60 * 60 * 24));
            // Alerta entre 25 e 35 dias (janela de 10 dias em torno dos 30 dias)
            return diasDesdeAdmissao >= 25 && diasDesdeAdmissao <= 35;
          })
          .map(membro => {
            const admissao = new Date(membro.createdAt);
            const dias = Math.floor((hoje - admissao) / (1000 * 60 * 60 * 24));
            return {
              id: membro.id,
              nome: membro.name,
              dias,
              mensagem: dias === 30
                ? `${membro.name} completou 30 dias hoje!`
                : dias < 30
                ? `${membro.name} completa 30 dias em ${30 - dias} dia(s)`
                : `${membro.name} está há ${dias} dias — verifique o treinamento`
            };
          });

        setNotificacoes(alertas);
      } catch (error) {
        console.error('Erro ao buscar notificações:', error);
      }
    }

    fetchNotificacoes();
  }, [user?.workAreaId]);

  const handleNavigation = (path) => {
    setMenuAberto(false);
    navigate(path);
  };

  return (
    <header className="cabecalho">
      <div className="cabecalho-esquerda">
        <FaBars className="menu-icon" onClick={onToggle} />
        <h1>ON THE JOB</h1>
      </div>

      <div className="cabecalho-direita">
        <FaPlus className="add-icon" />

        {/* Sino de notificações — só para GESTOR/ADMIN */}
        {podeGerenciar && (
          <div className="sino-container">
            <div className="sino-wrapper" onClick={() => setSinoAberto(prev => !prev)}>
              <FaBell className="sino-icon" />
              {notificacoes.length > 0 && (
                <span className="sino-badge">{notificacoes.length}</span>
              )}
            </div>

            {sinoAberto && (
              <>
                <div className="menu-overlay" onClick={() => setSinoAberto(false)} />
                <div className="notificacoes-dropdown">
                  <h4 className="notificacoes-titulo">🔔 Lembretes de 30 dias</h4>
                  {notificacoes.length === 0 ? (
                    <p className="notificacoes-vazio">Nenhum lembrete no momento.</p>
                  ) : (
                    notificacoes.map(n => (
                      <div key={n.id} className="notificacao-item">
                        <span className="notificacao-nome">{n.nome}</span>
                        <span className="notificacao-msg">{n.mensagem}</span>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}

        <div className="perfil-container-google">
          <div className="perfil-circulo" onClick={toggleMenu}>
            {inicial}
          </div>

          {menuAberto && (
            <>
              <div className="menu-overlay" onClick={() => setMenuAberto(false)} />
              <div className="google-menu">
                <div className="google-menu-header">
                  <p className="user-email">{user?.email}</p>
                  <div className="avatar-grande">{inicial}</div>
                  <h3>Olá, {user?.name?.split(' ')[0]}!</h3>
                  <div className="button-group-vertical">
                    <button className="btn-gerenciar" onClick={() => handleNavigation('/app/perfil')}>
                      Gerenciar sua conta
                    </button>
                    {user?.role === 'ADMIN' && (
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
                  <button className="footer-item"><FaUserPlus /> Adicionar conta</button>
                  <button className="footer-item" onClick={signOut}>
                    <FaSignOutAlt /> Sair
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}