import React, { useState, useMemo } from 'react';
import './tarefas.css'; 

const tarefas = [
  { id: 1, label: 'Configurar computador e softwares essenciais', dia: '25', mes: 'Set', ano: '2025', setor: 'Desenvolvimento' },
  { id: 2, label: 'Revisar políticas internas e compliance', dia: '26', mes: 'Set', ano: '2025', setor: 'Desenvolvimento' },
  { id: 3, label: 'Participar do treinamento de segurança da informação', dia: '27', mes: 'Set', ano: '2025', setor: 'Desenvolvimento' },
  { id: 4, label: 'Configuração do ambiente de desenvolvimento', dia: '28', mes: 'Set', ano: '2025', setor: 'Desenvolvimento' },
  { id: 5, label: 'Primeira tarefa prática supervisionada', dia: '29', mes: 'Set', ano: '2025', setor: 'Desenvolvimento' },
];

export function Tarefas() {
  const [checklist, setChecklist] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const [assinatura, setAssinatura] = useState('');

  const handleCheckboxChange = (id) => {
    setChecklist(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const progressoPercentual = useMemo(() => {
    const totalTarefas = tarefas.length;
    const tarefasConcluidas = Object.values(checklist).filter(Boolean).length;
    return Math.round((tarefasConcluidas / totalTarefas) * 100);
  }, [checklist]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (progressoPercentual < 100) {
      alert('Você precisa concluir todas as tarefas antes de finalizar.');
      return;
    }

    if (!assinatura.trim()) {
      alert('Por favor, preencha o campo de Assinatura antes de finalizar.');
      return;
    }

    alert(`Formulário submetido!
Progresso: ${progressoPercentual}%.
Assinatura: ${assinatura}`);

    console.log('Checklist atual:', checklist);
    console.log('Assinatura:', assinatura);
  };

  const concluido = progressoPercentual === 100;

  return (
    <div className="container">
      <div className="header-profile">
        <div className={`profile-photo ${concluido ? 'complete' : ''}`}></div>
        <div className="profile-info">
          <span className="profile-name">Julio Rodrigues</span>
          <span className="profile-setor">Setor: Desenvolvimento</span>
        </div>
      </div>

      <div className="form-card">
        <h2>Treinamento de Integração - Setor de Desenvolvimento</h2>

        <div className="progress-bar-container">
          <div 
            className={`progress-bar-fill ${concluido ? 'complete' : ''}`} 
            style={{ width: `${progressoPercentual}%` }} 
          >
            {progressoPercentual}%
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {tarefas.map(tarefa => (
            <div key={tarefa.id} className="checkbox-item">
              <div style={{ flex: 1 }}>
                <label htmlFor={`tarefa-${tarefa.id}`}>
                  {tarefa.label} <br />
                  <span className="task-info">
                    Dia: {tarefa.dia}/{tarefa.mes}/{tarefa.ano} | Setor: {tarefa.setor}
                  </span>
                </label>
              </div>
              <input
                type="checkbox"
                id={`tarefa-${tarefa.id}`}
                checked={checklist[tarefa.id]}
                onChange={() => handleCheckboxChange(tarefa.id)}
              />
            </div>
          ))}

          <div className="assinatura-field">
            <label htmlFor="assinatura">Assinatura (Nome Completo):</label>
            <input
              id="assinatura"
              type="text"
              value={assinatura}
              onChange={(e) => setAssinatura(e.target.value)}
              placeholder="Digite seu nome para assinar"
              required
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
