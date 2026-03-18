// src/pages/Perfil/Perfil.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import api from '../../service/api';
import './Perfil.css';

export function Perfil() {
  const { user, signOut } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };

      await api.patch(`/api/users/${user.id}`, payload);

      setSuccessMsg('Perfil atualizado com sucesso!');
      setEditMode(false);
      setFormData(prev => ({ ...prev, password: '' }));
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Erro ao atualizar perfil.');
    } finally {
      setLoading(false);
    }
  }

  const roleLabel = {
    ADMIN: 'Administrador',
    GESTOR: 'Gestor',
    COLABORADOR: 'Colaborador',
  };

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>

      <div className="perfil-card">
        {/* Avatar */}
        <div className="avatar-grande">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        {!editMode ? (
          // ── MODO VISUALIZAÇÃO ──
          <>
            <div className="info-grupo">
              <label>Nome</label>
              <p>{user?.name}</p>
            </div>
            <div className="info-grupo">
              <label>Email</label>
              <p>{user?.email}</p>
            </div>
            <div className="info-grupo">
              <label>Cargo</label>
              <p>{roleLabel[user?.role] || user?.role}</p>
            </div>

            {successMsg && <p className="perfil-success">{successMsg}</p>}

            <div className="perfil-acoes">
              <button className="btn-editar" onClick={() => setEditMode(true)}>
                Editar Perfil
              </button>
              <button className="btn-sair" onClick={signOut}>
                Sair
              </button>
            </div>
          </>
        ) : (
          // ── MODO EDIÇÃO ──
          <form className="perfil-form" onSubmit={handleSave}>
            <div className="info-grupo">
              <label>Nome</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="info-grupo">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="info-grupo">
              <label>Nova Senha <span>(deixe em branco para manter)</span></label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                minLength={6}
                placeholder="mínimo 6 caracteres"
              />
            </div>

            {errorMsg && <p className="perfil-error">{errorMsg}</p>}

            <div className="perfil-acoes">
              <button
                type="button"
                className="btn-cancelar"
                onClick={() => {
                  setEditMode(false);
                  setErrorMsg('');
                  setFormData({ name: user?.name, email: user?.email, password: '' });
                }}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-salvar" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}