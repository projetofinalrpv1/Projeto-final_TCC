import React, { useState, useMemo } from 'react';
import './tarefas.css'; 

const tarefas = [
  { id: 1, label: 'Configurar ambiente de desenvolvimento' },
  { id: 2, label: 'Criar a estrutura do componente React' },
  { id: 3, label: 'Definir os estilos CSS para layout' },
  { id: 4, label: 'Implementar a lógica de estado (useState)' },
  { id: 5, label: 'Calcular e atualizar a barra de progresso' },
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

  return (
    <div className="container">
      <div className="form-card">
        <h2>Tarefas do Colaborador</h2>

        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressoPercentual}%` }} 
          >
            {progressoPercentual}%
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {tarefas.map(tarefa => (
            <div key={tarefa.id} className="checkbox-item">
              <input
                type="checkbox"
                id={`tarefa-${tarefa.id}`}
                checked={checklist[tarefa.id]}
                onChange={() => handleCheckboxChange(tarefa.id)}
              />
              <label htmlFor={`tarefa-${tarefa.id}`}>{tarefa.label}</label>
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
