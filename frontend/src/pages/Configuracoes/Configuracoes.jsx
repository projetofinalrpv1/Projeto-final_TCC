import React from "react";
import { useAuth } from "../../contexts/useAuth";
import "./Configuracoes.css";

export function Configuracoes() {
  const { user } = useAuth();

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
        <button>Alterar senha</button>
      </section>

      {/* AÇÕES EXTRAS APENAS PARA GESTOR */}
      {user.role === "gestor" && (
        <section className="secao-config">
          <h3>Administração</h3>
          <button>Gerenciar usuários</button>
          <button>Permissões do sistema</button>
        </section>
      )}
    </div>
  );
}
