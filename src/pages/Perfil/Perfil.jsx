import React from 'react';
import './Perfil.css';

export function Perfil() {
  // Mock de dados - depois você pode puxar do seu AuthContext
  const usuario = {
    nome: "Usuário Exemplo",
    email: "usuario@email.com",
    cargo: "Gestor",
    dataAdesao: "01/01/2024"
  };

  return (
    <div className="perfil-container">
      <h2>Meu Perfil</h2>
      <div className="perfil-card">
        <div className="avatar-grande">
          {usuario.nome.charAt(0)}
        </div>
        <div className="info-grupo">
          <label>Nome:</label>
          <p>{usuario.nome}</p>
        </div>
        <div className="info-grupo">
          <label>Email:</label>
          <p>{usuario.email}</p>
        </div>
        <div className="info-grupo">
          <label>Cargo:</label>
          <p>{usuario.cargo}</p>
        </div>
      </div>
    </div>
  );
}