import React from 'react';
import './Configuracoes.css'; // Se você for adicionar estilos

export function Configuracoes() {
  return (
    <div className="configuracoes-pagina">
      <h2>Configurações do Usuário</h2>
      <p>Aqui você pode gerenciar suas preferências, notificações e segurança.</p>
      
      <section className="secao-config">
          <h3>Geral</h3>
          <ul>
              <li>Idioma: Português (Brasil)</li>
              <li>Fuso Horário: GMT-3</li>
          </ul>
      </section>

      <section className="secao-config">
          <h3>Conta</h3>
          <button>Informações do usuário</button>
          <button>Desativar Conta</button>
      </section>
      
    </div>
  );
}