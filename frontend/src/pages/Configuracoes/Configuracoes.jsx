import React from "react";
import { useAuth } from "../../contexts/useAuth";
import "./Configuracoes.css";

export function Configuracoes() {
  const { user } = useAuth();

  return (
    <div className="configuracoes-pagina">
      <header className="config-header">
        <h2>Configurações do Usuário</h2>
        <p>
          Aqui você pode gerenciar suas preferências, notificações e segurança.
        </p>
      </header>

      {/* ================= GERAL ================= */}
      <section className="secao-config">
        <h3>Geral</h3>
        <ul>
          <li>
            <strong>Idioma:</strong> Português (Brasil)
          </li>
          <li>
            <strong>Fuso Horário:</strong> GMT-3
          </li>
        </ul>
      </section>

      {/* ================= CONTA ================= */}
      <section className="secao-config">
        <h3>Conta</h3>

        <div className="botoes-config">
          <button className="btn-primary">
            Informações do usuário
          </button>

          <button className="btn-alert">
            Alterar senha
          </button>
        </div>
      </section>

      {/* ================= ADMIN (APENAS GESTOR) ================= */}
      {user?.role === "gestor" && (
        <section className="secao-config">
          <h3>Administração</h3>

          <div className="botoes-config">
            <button className="btn-primary">
              Gerenciar usuários
            </button>

            <button className="btn-secondary">
              Permissões do sistema
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
