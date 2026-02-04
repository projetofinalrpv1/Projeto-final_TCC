import React, { useState } from 'react';
import { FaUserPlus, FaEdit, FaTrash } from 'react-icons/fa';
import "./Usuarios.css";

export function Usuarios() {
  // Estado inicial simulando os dados do seu sistema
  const [listaUsuarios, setListaUsuarios] = useState([
    { id: 1, name: "Usuário Comum", email: "usuario1@email.com", role: "colaborador" },
    { id: 2, name: "Gestor Principal", email: "gestor1@email.com", role: "gestor" },
  ]);

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2>Gerenciamento de Usuários</h2>
        <button className="btn-add"><FaUserPlus /> Novo Usuário</button>
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
    </div>
  );
}