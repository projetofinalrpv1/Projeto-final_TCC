import React, { useState, useMemo } from 'react';
import './App.css'; 

// Dados das 5 tarefas (para os checkboxes)
const tarefas = [
  { id: 1, label: 'Configurar ambiente de desenvolvimento' },
  { id: 2, label: 'Criar a estrutura do componente React' },
  { id: 3, label: 'Definir os estilos CSS para layout' },
  { id: 4, label: 'Implementar a lógica de estado (useState)' },
  { id: 5, label: 'Calcular e atualizar a barra de progresso' },
];

function App() {
  // 1. Estados para rastrear as checkboxes e a assinatura
  const [checklist, setChecklist] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });
  // NOVO ESTADO: Para o campo de assinatura
  const [assinatura, setAssinatura] = useState('');

  // 2. Função para atualizar o estado quando um checkbox é clicado
  const handleCheckboxChange = (id) => {
    setChecklist(prev => ({
      ...prev,
      [id]: !prev[id], 
    }));
  };

  // 3. Cálculo da Porcentagem da Barra de Progresso
  const progressoPercentual = useMemo(() => {
    const totalTarefas = tarefas.length;
    const tarefasConcluidas = Object.values(checklist).filter(Boolean).length;
    
    return Math.round((tarefasConcluidas / totalTarefas) * 100);
  }, [checklist]); 

  // 4. Função para lidar com a submissão do formulário
  const handleSubmit = (event) => {
    event.preventDefault();

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
        <h2>Checklist de Progresso em React</h2>

        {/* BARRA DE PROGRESSO */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressoPercentual}%` }} 
          >
            {progressoPercentual}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Checkboxes */}
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

          {/* NOVO CAMPO DE ASSINATURA */}
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

export  {App};