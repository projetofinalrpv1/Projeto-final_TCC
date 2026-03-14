// src/pages/Usuarios/Usuarios.jsx
import { useState, useEffect } from 'react';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import api from '../../service/api';
import Form from '../Form-cadastro/form';
import "./Usuarios.css";

export function Usuarios() {
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [loadingTabela, setLoadingTabela] = useState(true);
  const [abrirForm, setAbrirForm] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null); // null = cadastro, objeto = edição

  // -------------------------------------------------------
  // Carrega lista de usuários do banco ao montar
  // -------------------------------------------------------
  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    setLoadingTabela(true);
    try {
      const response = await api.get('/api/users');
      setListaUsuarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoadingTabela(false);
    }
  }

  // -------------------------------------------------------
  // Abre formulário para EDIÇÃO
  // -------------------------------------------------------
  function handleEditar(usuario) {
    setUsuarioEditando(usuario);
    setAbrirForm(true);
  }

  // -------------------------------------------------------
  // Abre formulário para CADASTRO
  // -------------------------------------------------------
  function handleNovo() {
    setUsuarioEditando(null);
    setAbrirForm(true);
  }

  // -------------------------------------------------------
  // Fecha formulário e recarrega lista
  // -------------------------------------------------------
  function handleFechar() {
    setAbrirForm(false);
    setUsuarioEditando(null);
    carregarUsuarios(); // Atualiza a tabela após qualquer operação
  }

  // -------------------------------------------------------
  // Soft delete via DELETE /api/users/:id
  // -------------------------------------------------------
  async function handleExcluir(id) {
    if (!confirm('Deseja desativar este usuário?')) return;

    try {
      await api.delete(`/api/users/${id}`);
      carregarUsuarios();
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir usuário.');
    }
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Gerenciamento de Usuários</h2>
        <button className="btn-add" onClick={handleNovo}>
          <FaUserPlus /> Novo Usuário
        </button>
      </div>

      {loadingTabela ? (
        <p className="loading-msg">Carregando usuários...</p>
      ) : (
        <table className="usuarios-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Cargo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {listaUsuarios.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', opacity: 0.6 }}>
                  Nenhum usuário cadastrado.
                </td>
              </tr>
            ) : (
              listaUsuarios.map(u => (
                <tr key={u.id} className={!u.isActive ? 'inativo' : ''}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`badge ${u.role.toLowerCase()}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="actions">
                    <button title="Editar" onClick={() => handleEditar(u)}>
                      <FaEdit />
                    </button>
                    <button
                      title="Excluir"
                      className="delete"
                      onClick={() => handleExcluir(u.id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {abrirForm && (
        <Form
          fechar={handleFechar}
          usuarioEditando={usuarioEditando}
        />
      )}
    </div>
  );
}