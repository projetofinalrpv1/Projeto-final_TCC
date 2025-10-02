import { useState } from "react";
import "./Gestor.css";

export function Gestor() {
  const [info, setInfo] = useState(null);

  const calculaFinalizacao = (data) => {
    const [dia, mes, ano] = data.split("/").map(Number);
    const date = new Date(ano, mes - 1, dia);
    date.setMonth(date.getMonth() + 1);
    const diaF = String(date.getDate()).padStart(2, "0");
    const mesF = String(date.getMonth() + 1).padStart(2, "0");
    const anoF = date.getFullYear();
    return `${diaF}/${mesF}/${anoF}`;
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
    if (perc < 0) perc = 0;
    if (perc > 100) perc = 100;
    return perc;
  };

  const faseTreinamento = (data) => {
    const progresso = calculaProgresso(data);
    if (progresso < 35) return "inicio";
    if (progresso < 70) return "meio";
    return "final";
  };

  const diasRestantes = (data) => {
    const [dia, mes, ano] = data.split("/").map(Number);
    const inicio = new Date(ano, mes - 1, dia);
    const final = new Date(inicio);
    final.setMonth(final.getMonth() + 1);
    const hoje = new Date();
    const diff = Math.ceil((final - hoje) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const dados = {
    gestor: {
      nome: "Davi Luca",
      setor: "Desenvolvimento",
      descricao: "Responsável pela coordenação da equipe de desenvolvimento."
    },
    colaboradores: [
      { nome: "Ana Souza", setor: "Desenvolvimento", ingresso: "10/09/2025", descricao: "Atua na implementação de novas funcionalidades." },
      { nome: "Carlos Mendes", setor: "Desenvolvimento", ingresso: "15/09/2025", descricao: "Especialista em manutenção de sistemas e suporte técnico." },
      { nome: "Júlia Rocha", setor: "Desenvolvimento", ingresso: "20/09/2025", descricao: "Responsável pela integração de APIs e otimização de código." },
      { nome: "Marcos Lima", setor: "Desenvolvimento", ingresso: "22/09/2025", descricao: "Focado em testes automatizados e qualidade do software." },
      { nome: "Fernanda Alves", setor: "Desenvolvimento", ingresso: "25/09/2025", descricao: "Atua no design de interfaces e experiência do usuário." }
    ]
  };

  return (
    <div className="gestor-container">
      <header className="gestor-header">
        <img src="https://via.placeholder.com/50" alt="Foto do Gestor" className="gestor-avatar" />
      </header>

      <main className="gestor-main">
        {/* Card do Gestor */}
        <div
          className={`gestor-card gestor-principal ${info === dados.gestor ? "selecionado" : ""}`}
          onClick={() => setInfo(info === dados.gestor ? null : dados.gestor)}
        >
          <span className="nome">{dados.gestor.nome}</span>
        </div>

        {/* Organograma */}
        <div className="gestor-organograma">
          <div className="linha-horizontal"></div>
          {dados.colaboradores.map((colab, index) => {
            const progresso = calculaProgresso(colab.ingresso);
            const fase = faseTreinamento(colab.ingresso);
            const dias = diasRestantes(colab.ingresso);

            return (
              <div className="colab-wrapper" key={index}>
                <div className="linha-vertical"></div>
                <div
                  className={`gestor-card ${info === colab ? "selecionado" : ""}`}
                  onClick={() => setInfo(info === colab ? null : colab)}
                  title={`${dias} dias restantes do treinamento`}
                >
                  <div className={`fase-indicador ${fase}`}></div>
                  <span className="nome">{colab.nome}</span>
                  <div className="divider"></div>
                  <span className="treinamento">Início: {colab.ingresso}</span>
                  <span className="treinamento">Previsão: {calculaFinalizacao(colab.ingresso)}</span>
                  <div className="barra-progresso">
                    <div className="barra-preenchida" style={{ width: `${progresso}%` }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        

        {/* Info detalhada */}
        {info && (
          <div className="info-box">
            <h3>{info.nome}</h3>
            <p><strong>Setor:</strong> {info.setor}</p>
            {info.ingresso && (
              <>
                <p><strong>Início do treinamento:</strong> {info.ingresso}</p>
                <p><strong>Previsão de finalização:</strong> {calculaFinalizacao(info.ingresso)}</p>
              </>
            )}
            <p>{info.descricao}</p>
          </div>
        )}
      </main>
    </div>
  );
}
