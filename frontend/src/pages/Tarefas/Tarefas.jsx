import React, { useState, useMemo } from "react";
import "./tarefas.css";

export function Tarefas() {
  const [tarefas, setTarefas] = useState([
    { id: 1, label: "Configurar computador e softwares essenciais", dia: "25", mes: "Set", ano: "2025", setor: "Desenvolvimento" },
    { id: 2, label: "Revisar políticas internas e compliance", dia: "26", mes: "Set", ano: "2025", setor: "Desenvolvimento" },
    { id: 3, label: "Participar do treinamento de segurança da informação", dia: "27", mes: "Set", ano: "2025", setor: "Desenvolvimento" },
    { id: 4, label: "Configuração do ambiente de desenvolvimento", dia: "28", mes: "Set", ano: "2025", setor: "Desenvolvimento" },
    { id: 5, label: "Primeira tarefa prática supervisionada", dia: "29", mes: "Set", ano: "2025", setor: "Desenvolvimento" },
  ]);

  const [checklist, setChecklist] = useState({});
  const [assinatura, setAssinatura] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [novaTarefa, setNovaTarefa] = useState({
    label: "",
    dia: "",
    mes: "",
    ano: "",
    setor: ""
  });

  const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
  ];

  const handleCheckboxChange = (id) => {
    setChecklist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const progressoPercentual = useMemo(() => {
    const total = tarefas.length;
    const concluidas = Object.values(checklist).filter(Boolean).length;
    return total === 0 ? 0 : Math.round((concluidas / total) * 100);
  }, [checklist, tarefas]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (progressoPercentual < 100) {
      alert("Você precisa concluir todas as tarefas antes de finalizar.");
      return;
    }

    if (!assinatura.trim()) {
      alert("Preencha o campo de assinatura.");
      return;
    }

    alert(`Treinamento finalizado com sucesso!\nAssinado por: ${assinatura}`);
  };

  const adicionarTarefa = (e) => {
    e.preventDefault();

    if (!novaTarefa.label || !novaTarefa.dia || !novaTarefa.mes || !novaTarefa.ano || !novaTarefa.setor) {
      alert("Preencha todos os campos da nova atividade.");
      return;
    }

    const novoId = tarefas.length + 1;

    setTarefas([
      ...tarefas,
      { id: novoId, ...novaTarefa }
    ]);

    setChecklist((prev) => ({
      ...prev,
      [novoId]: false
    }));

    setNovaTarefa({
      label: "",
      dia: "",
      mes: "",
      ano: "",
      setor: ""
    });

    setMostrarFormulario(false);
  };

  const concluido = progressoPercentual === 100;

  return (
    <div className="container">
      <div className="form-card">
        <h2>Treinamento de Integração - Setor de Desenvolvimento</h2>

        <div className="progress-bar-container">
          <div
            className={`progress-bar-fill ${concluido ? "complete" : ""}`}
            style={{ width: `${progressoPercentual}%` }}
          >
            {progressoPercentual}%
          </div>
        </div>

        <button
          type="button"
          className="criar-button"
          onClick={() => setMostrarFormulario(true)}
        >
          + Criar Atividade
        </button>

        {mostrarFormulario && (
          <div className="modal">
            <form className="modal-content" onSubmit={adicionarTarefa}>
              <h3>Nova Atividade</h3>

              <input
                type="text"
                placeholder="Descrição"
                value={novaTarefa.label}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, label: e.target.value })
                }
              />

              <input
                type="number"
                placeholder="Dia"
                min="1"
                max="31"
                value={novaTarefa.dia}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, dia: e.target.value })
                }
              />

              <select
                value={novaTarefa.mes}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, mes: e.target.value })
                }
              >
                <option value="">Selecione o mês</option>
                {meses.map((mes, index) => (
                  <option key={index} value={mes}>
                    {mes}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Ano"
                min="2020"
                max="2100"
                value={novaTarefa.ano}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, ano: e.target.value })
                }
              />

              <input
                type="text"
                placeholder="Setor"
                value={novaTarefa.setor}
                onChange={(e) =>
                  setNovaTarefa({ ...novaTarefa, setor: e.target.value })
                }
              />

              <div className="modal-buttons">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {tarefas.map((tarefa) => (
            <div key={tarefa.id} className="checkbox-item">
              <label>
                {tarefa.label}
                <span className="task-info">
                  {tarefa.dia}/{tarefa.mes}/{tarefa.ano} • {tarefa.setor}
                </span>
              </label>

              <input
                type="checkbox"
                checked={checklist[tarefa.id] || false}
                onChange={() => handleCheckboxChange(tarefa.id)}
              />
            </div>
          ))}

          <div className="assinatura-field">
            <label>Assinatura (Nome Completo)</label>
            <input
              type="text"
              value={assinatura}
              onChange={(e) => setAssinatura(e.target.value)}
              placeholder="Digite seu nome para assinar"
            />
          </div>

          <button type="submit" className="submit-button">
            Finalizar
          </button>
        </form>
      </div>
    </div>
  );
}