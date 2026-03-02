import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import "./Usuarios.css";
import Form from '../Form-cadastro/form';

export function Usuarios() {

  const [listaUsuarios, setListaUsuarios] = useState([
    { id: 1, name: "Usuário Comum", email: "usuario1@email.com", role: "colaborador" },
    { id: 2, name: "Gestor Principal", email: "gestor1@email.com", role: "gestor" },
  ]);

  const [abrirForm, setAbrirForm] = useState(false);

  function adicionarUsuario(data) {
    const novo = {
      id: Date.now(),
      name: data.nome,
      email: `${data.nome.toLowerCase().replace(/\s/g, '')}@empresa.com`,
      role: data.gestor ? "gestor" : "colaborador"
    };

    setListaUsuarios([...listaUsuarios, novo]);
  }

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Gerenciamento de Usuários</h2>

        <button className="btn-add" onClick={() => setAbrirForm(true)}>
          <FaUserPlus /> Novo Usuário
        </button>
      </div>

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
          {listaUsuarios.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td><span className={`badge ${u.role}`}>{u.role}</span></td>
              <td className="actions">
                <button title="Editar"><FaEdit /></button>
                <button title="Excluir" className="delete"><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* FORMULÁRIO COMO MODAL */}
      {abrirForm && (
        <Form 
          fechar={() => setAbrirForm(false)} 
          adicionarUsuario={adicionarUsuario} 
        />
      )}
    </div>
  );
}