import { useState } from "react";
import "./Gestor.css";

export function Gestor() {
  const [info, setInfo] = useState(null);

  const calculaFinalizacao = (data) => {
    const [dia, mes, ano] = data.split("/").map(Number);
    const date = new Date(ano, mes - 1, dia);
    date.setMonth(date.getMonth() + 1);
    return `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;
  };

  const calculaProgresso = (data) => {
    const [dia, mes, ano] = data.split("/").map(Number);
    const inicio = new Date(ano, mes - 1, dia);
    const final = new Date(inicio);
    final.setMonth(final.getMonth() + 1);
    const hoje = new Date();

    const total = final - inicio;
    const decorrido = hoje - inicio;

    let perc = Math.round((decorrido / total) * 100);
    return Math.min(100, Math.max(0, perc));
  };

  const faseTreinamento = (data) => {
    const p = calculaProgresso(data);
    if (p < 35) return "inicio";
    if (p < 70) return "meio";
    return "final";
  };

  const dados = {
    gestor: {
      nome: "Davi Luca",
      setor: "Desenvolvimento",
      descricao:
        "Responsável pela coordenação da equipe de desenvolvimento.",
      foto: "https://via.placeholder.com/300"
    },
    colaboradores: [
      {
        nome: "Ana Souza",
        setor: "Desenvolvimento",
        ingresso: "10/09/2025",
        descricao: "Atua na implementação de novas funcionalidades."
      },
      {
        nome: "Carlos Mendes",
        setor: "Desenvolvimento",
        ingresso: "15/09/2025",
        descricao: "Especialista em manutenção de sistemas."
      },
      {
        nome: "Júlia Rocha",
        setor: "Desenvolvimento",
        ingresso: "20/09/2025",
        descricao: "Integração de APIs e otimização."
      },
      {
        nome: "Marcos Lima",
        setor: "Desenvolvimento",
        ingresso: "22/09/2025",
        descricao: "Testes automatizados e qualidade."
      },
      {
        nome: "Fernanda Alves",
        setor: "Desenvolvimento",
        ingresso: "25/09/2025",
        descricao: "Design de interfaces e UX."
      }
    ]
  };

  return (
    <div className="gestor-container">
      <header className="gestor-header">
        <img
          src={dados.gestor.foto}
          alt="Gestor"
          className="gestor-avatar"
        />
      </header>

      <main className="gestor-main">
        {/* CARD DO GESTOR */}
        <div className="gestor-card gestor-principal">
          <div className="gestor-foto">
            <img src={dados.gestor.foto} alt={dados.gestor.nome} />
          </div>

          <span className="nome">{dados.gestor.nome}</span>
          <span className="setor">{dados.gestor.setor}</span>

          <div className="divider"></div>

          <p className="descricao">{dados.gestor.descricao}</p>
        </div>

        {/* COLABORADORES */}
        <div className="gestor-organograma">
          {dados.colaboradores.map((colab, index) => {
            const progresso = calculaProgresso(colab.ingresso);
            const fase = faseTreinamento(colab.ingresso);

            return (
              <div className="colab-wrapper" key={index}>
                <div className="gestor-card">
                  <div className={`fase-indicador ${fase}`}></div>

                  <span className="nome">{colab.nome}</span>
                  <span className="setor">{colab.setor}</span>

                  <div className="divider"></div>

                  <span className="treinamento">
                    Início: {colab.ingresso}
                  </span>
                  <span className="treinamento">
                    Previsão: {calculaFinalizacao(colab.ingresso)}
                  </span>

                  <div className="barra-progresso">
                    <div
                      className="barra-preenchida"
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
