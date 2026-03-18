// src/pages/Configuracoes/Configuracoes.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import "./Configuracoes.css";

export function Configuracoes() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ── Tema ──
  const [temaDark, setTemaDark] = useState(
    () => localStorage.getItem('@App:tema') === 'dark'
  );

  useEffect(() => {
    const tema = temaDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('@App:tema', tema);
  }, [temaDark]);

  // ── Alterar senha ──
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [senhaForm, setSenhaForm] = useState({ password: '', confirmar: '' });
  const [loadingSenha, setLoadingSenha] = useState(false);
  const [senhaMsg, setSenhaMsg] = useState({ texto: '', tipo: '' });

  function handleSenhaChange(e) {
    const { name, value } = e.target;
    setSenhaForm(prev => ({ ...prev, [name]: value }));
  }

  async function handleAlterarSenha(e) {
    e.preventDefault();
    setSenhaMsg({ texto: '', tipo: '' });

    if (senhaForm.password !== senhaForm.confirmar) {
      setSenhaMsg({ texto: 'As senhas não coincidem.', tipo: 'erro' });
      return;
    }
    if (senhaForm.password.length < 6) {
      setSenhaMsg({ texto: 'A senha deve ter no mínimo 6 caracteres.', tipo: 'erro' });
      return;
    }

    setLoadingSenha(true);
    try {
      await api.patch(`/api/users/${user.id}`, { password: senhaForm.password });
      setSenhaMsg({ texto: 'Senha alterada com sucesso!', tipo: 'sucesso' });
      setSenhaForm({ password: '', confirmar: '' });
      setMostrarSenha(false);
    } catch (error) {
      setSenhaMsg({
        texto: error.response?.data?.message || 'Erro ao alterar senha.',
        tipo: 'erro'
      });
    } finally {
      setLoadingSenha(false);
    }
  }

  return (
    <div className="configuracoes-pagina">
      <header className="config-header">
        <h2>Configurações do Usuário</h2>
        <p>Aqui você pode gerenciar suas preferências e segurança.</p>
      </header>

      {/* ── APARÊNCIA ── */}
      <section className="secao-config">
        <h3>Aparência</h3>
        <div className="config-row">
          <div>
            <strong>Tema escuro</strong>
            <p className="config-descricao">Alterna entre o tema claro e escuro</p>
          </div>
          <button
            className={`toggle-btn ${temaDark ? 'ativo' : ''}`}
            onClick={() => setTemaDark(prev => !prev)}
            aria-label="Alternar tema"
          >
            <span className="toggle-bolinha" />
          </button>
        </div>
      </section>

      {/* ── GERAL ── */}
      <section className="secao-config">
        <h3>Geral</h3>
        <ul>
          <li><strong>Idioma:</strong> Português (Brasil)</li>
          <li><strong>Fuso Horário:</strong> GMT-3</li>
        </ul>
      </section>

      {/* ── CONTA ── */}
      <section className="secao-config">
        <h3>Conta</h3>

        <div className="botoes-config">
          <button className="btn-primary" onClick={() => navigate('/app/perfil')}>
            Informações do usuário
          </button>
          <button className="btn-alert" onClick={() => setMostrarSenha(prev => !prev)}>
            {mostrarSenha ? 'Cancelar' : 'Alterar senha'}
          </button>
        </div>

        {/* Formulário de alteração de senha */}
        {mostrarSenha && (
          <form className="senha-form" onSubmit={handleAlterarSenha}>
            <input
              type="password"
              name="password"
              placeholder="Nova senha"
              value={senhaForm.password}
              onChange={handleSenhaChange}
              className="senha-input"
              required
              minLength={6}
            />
            <input
              type="password"
              name="confirmar"
              placeholder="Confirmar nova senha"
              value={senhaForm.confirmar}
              onChange={handleSenhaChange}
              className="senha-input"
              required
            />

            {senhaMsg.texto && (
              <p className={`senha-msg ${senhaMsg.tipo}`}>{senhaMsg.texto}</p>
            )}

            <button type="submit" className="btn-primary" disabled={loadingSenha}>
              {loadingSenha ? 'Salvando...' : 'Confirmar nova senha'}
            </button>
          </form>
        )}
      </section>

      {/* ── ADMINISTRAÇÃO (só ADMIN e GESTOR) ── */}
      {['ADMIN', 'GESTOR'].includes(user?.role) && (
        <section className="secao-config">
          <h3>Administração</h3>
          <div className="botoes-config">
            <button className="btn-primary" onClick={() => navigate('/app/usuarios')}>
              Gerenciar usuários
            </button>
          </div>
        </section>
      )}
    </div>
  );
}