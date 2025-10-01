import { useState } from "react";
import "./Gestor.css";

export function Gestor() {
  const [info, setInfo] = useState(null);

  const dados = {
    gestor: {
      nome: "Davi Luca",
      setor: "Gestão de Projetos",
      ingresso: "Janeiro de 2020",
      descricao: "Responsável pela coordenação dos projetos estratégicos da empresa."
    },
    colaboradores: [
      {
        nome: "Ana Souza",
        setor: "Recursos Humanos",
        ingresso: "Março de 2022",
        descricao: "Atua no desenvolvimento de programas de treinamento e integração."
      },
      {
        nome: "Carlos Mendes",
        setor: "Tecnologia da Informação",
        ingresso: "Agosto de 2021",
        descricao: "Especialista em suporte técnico e manutenção de sistemas."
      },
      {
        nome: "Júlia Rocha",
        setor: "Marketing",
        ingresso: "Outubro de 2023",
        descricao: "Responsável pelas campanhas digitais e redes sociais."
      }
    ]
  };

  return (
    <div className="gestor-container">
      <header className="gestor-header">
        <img
          src="https://via.placeholder.com/50"
          alt="Foto do Gestor"
          className="gestor-avatar"
        />
      </header>

      <main className="gestor-main">
        <div
          className={`gestor-box gestor-principal ${info === dados.gestor ? "selecionado" : ""}`}
          onClick={() => setInfo(info === dados.gestor ? null : dados.gestor)}
        >
          {dados.gestor.nome}
        </div>

        <div className="gestor-linhas">
          {dados.colaboradores.map((colab, index) => (
            <div
              key={index}
              className={`gestor-box ${info === colab ? "selecionado" : ""}`}
              onClick={() => setInfo(info === colab ? null : colab)}
            >
              {colab.nome}
            </div>
          ))}
        </div>

        {info && (
          <div className="info-box">
            <h3>{info.nome}</h3>
            <p><strong>Setor:</strong> {info.setor}</p>
            <p><strong>Ingresso:</strong> {info.ingresso}</p>
            <p>{info.descricao}</p>
          </div>
        )}
      </main>
    </div>
  );
}
