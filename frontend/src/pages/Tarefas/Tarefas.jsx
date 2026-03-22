// src/pages/Tarefas/Tarefas.jsx
import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import { jsPDF } from "jspdf";
import "./tarefas.css";
import { LOGO_BASE64 } from "../../assets/logo";
const prioridadeLabel = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta' };
const prioridadeCor = { LOW: '#4caf50', MEDIUM: '#ffb300', HIGH: '#e74c3c' };




function gerarPDFColaborador(user, tarefas, assinatura) {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // 1. Configuração da Logo (Nova lógica de centralização)
  // Posicionamento: 85mm da esquerda (para centralizar 40mm em um A4 de 210mm)
  // Tamanho: 40x40 para manter a nitidez dos elementos vazados da logo
  doc.addImage(LOGO_BASE64, 'PNG', 85, 10, 40, 40);

  // 2. Cabeçalho com Identidade Visual
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  // Ajustamos o Y para 55 para dar respiro abaixo da logo
  doc.text('ON THE JOB', 105, 55, { align: 'center' }); 

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Checklist de Treinamento de Integração', 105, 63, { align: 'center' });

  // Linha decorativa com a cor verde oliva da logo (aproximada: R:124, G:140, B:93)
  doc.setDrawColor(124, 140, 93); 
  doc.setLineWidth(0.8);
  doc.line(20, 68, 190, 68);

  // 3. Informações do Colaborador
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0); // Garante que o texto volte ao preto
  
  doc.setFont('helvetica', 'bold');
  doc.text('Colaborador:', 20, 77);
  doc.setFont('helvetica', 'normal');
  doc.text(user.name, 50, 77);

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, 84);
  doc.setFont('helvetica', 'normal');
  doc.text(user.email, 50, 84);

  doc.setFont('helvetica', 'bold');
  doc.text('Data:', 20, 91);
  doc.setFont('helvetica', 'normal');
  doc.text(dataHoje, 50, 91);

  doc.setDrawColor(200, 200, 200); // Linha cinza clara para separação
  doc.line(20, 96, 190, 96);

  // 4. Seção de Tarefas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tarefas Concluídas:', 20, 105);

  let y = 114;
  tarefas.forEach((tarefa, index) => {
    if (y > 260) { doc.addPage(); y = 20; }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${tarefa.title}`, 25, y);
    
    if (tarefa.description) {
      doc.setTextColor(100, 100, 100);
      doc.setFontSize(9);
      doc.text(`   ${tarefa.description}`, 25, y + 5);
      doc.setTextColor(0, 0, 0);
      y += 12;
    } else {
      y += 8;
    }
  });

  // 5. Rodapé de Assinaturas
  y += 15;
  if (y > 250) { doc.addPage(); y = 30; } // Evita que a assinatura fique cortada
  
  doc.setDrawColor(124, 140, 93);
  doc.line(20, y, 190, y);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Colaborador:', 20, y + 10);
  
  doc.setFont('helvetica', 'normal');
  doc.text(assinatura, 20, y + 20);
  doc.setFontSize(9);
  doc.text(`Data da Finalização: ${dataHoje}`, 20, y + 26);

  y += 40;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Gestor:', 20, y);
  doc.setFont('helvetica', 'normal');
  doc.text('_______________________________', 20, y + 10);
  doc.setFontSize(9);
  doc.text('Data: ___/___/______', 20, y + 16);

  doc.save(`checklist_${user.name.replace(/\s/g, '_')}_${dataHoje.replace(/\//g, '-')}.pdf`);
}

// ── Modal renderizado no body via Portal ──
function ModalNovaTarefa({ novaTarefa, setNovaTarefa, onSubmit, onClose, loadingSalvar }) {
  return createPortal(
    <div
      className="modal"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <form className="modal-content" onSubmit={onSubmit}>
        <h3>Nova Tarefa</h3>
        <input
          type="text"
          placeholder="Título da tarefa *"
          value={novaTarefa.title}
          onChange={e => setNovaTarefa(prev => ({ ...prev, title: e.target.value }))}
          required
        />
        <input
          type="text"
          placeholder="Descrição (opcional)"
          value={novaTarefa.description}
          onChange={e => setNovaTarefa(prev => ({ ...prev, description: e.target.value }))}
        />
        <select
          value={novaTarefa.priority}
          onChange={e => setNovaTarefa(prev => ({ ...prev, priority: e.target.value }))}
        >
          <option value="LOW">Prioridade Baixa</option>
          <option value="MEDIUM">Prioridade Média</option>
          <option value="HIGH">Prioridade Alta</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem', color: 'var(--cor-texto)' }}>
          <input
            type="checkbox"
            checked={novaTarefa.isTemplate}
            onChange={e => setNovaTarefa(prev => ({ ...prev, isTemplate: e.target.checked }))}
          />
          É um template (aplica para todos da área)
        </label>
        <div className="modal-buttons">
          <button type="submit" disabled={loadingSalvar}>
            {loadingSalvar ? 'Salvando...' : 'Salvar'}
          </button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </div>
      </form>
    </div>,
    document.body
  );
}

export function Tarefas() {
  const { user, loading: authLoading } = useAuth();
  const podeGerenciar = ['ADMIN', 'GESTOR'].includes(user?.role);

  const [tarefas, setTarefas] = useState([]);
  const [loadingTarefas, setLoadingTarefas] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [loadingFinalizar, setLoadingFinalizar] = useState(false);
  const [assinatura, setAssinatura] = useState("");
  const [finalizado, setFinalizado] = useState(false);

  const [novaTarefa, setNovaTarefa] = useState({
    title: "", description: "", priority: "MEDIUM", isTemplate: false,
  });

  useEffect(() => {
    const token = localStorage.getItem('@App:token');
    if (authLoading || !token || !user?.workAreaId) return;

    async function fetchTarefas() {
      setLoadingTarefas(true);
      try {
        const rota = podeGerenciar ? '/api/tasks/area' : '/api/tasks/my';
        const response = await api.get(rota);
        setTarefas(response.data);
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      } finally {
        setLoadingTarefas(false);
      }
    }
    fetchTarefas();
  }, [user?.workAreaId, authLoading]);

  async function handleCheckboxChange(tarefa) {
    const novoStatus = tarefa.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    setTarefas(prev => prev.map(t => t.id === tarefa.id ? { ...t, status: novoStatus } : t));
    try {
      await api.patch(`/api/tasks/${tarefa.id}/status`, { status: novoStatus });
    } catch {
      setTarefas(prev => prev.map(t => t.id === tarefa.id ? { ...t, status: tarefa.status } : t));
      alert('Erro ao atualizar tarefa.');
    }
  }

  async function adicionarTarefa(e) {
    e.preventDefault();
    if (!novaTarefa.title) return;
    setLoadingSalvar(true);
    try {
      const response = await api.post('/api/tasks', {
        ...novaTarefa,
        workAreaId: user.workAreaId,
      });
      setTarefas(prev => [...prev, response.data]);
      setMostrarFormulario(false);
      setNovaTarefa({ title: "", description: "", priority: "MEDIUM", isTemplate: false });
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar tarefa.');
    } finally {
      setLoadingSalvar(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm('Deseja excluir esta tarefa?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setTarefas(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir tarefa.');
    }
  }

  async function handleFinalizar(e) {
    e.preventDefault();
    if (progressoPercentual < 100) {
      alert('Conclua todas as tarefas antes de finalizar.');
      return;
    }
    if (!assinatura.trim()) {
      alert('Preencha o campo de assinatura.');
      return;
    }
    setLoadingFinalizar(true);
    try {
      await api.post('/api/tasks/finalize', {
        workAreaId: user.workAreaId,
        signature: assinatura,
      });
      gerarPDFColaborador(user, tarefas, assinatura);
      setFinalizado(true);
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao finalizar treinamento.');
    } finally {
      setLoadingFinalizar(false);
    }
  }

  const progressoPercentual = useMemo(() => {
    if (tarefas.length === 0) return 0;
    const concluidas = tarefas.filter(t => t.status === 'COMPLETED').length;
    return Math.round((concluidas / tarefas.length) * 100);
  }, [tarefas]);

  const concluido = progressoPercentual === 100;

  if (authLoading) return null;

  return (
    <div className="container">
      <div className="form-card">
        <h2>{podeGerenciar ? 'Tarefas da Área' : 'Meu Treinamento de Integração'}</h2>

        <div className="progress-bar-container">
          <div
            className={`progress-bar-fill ${concluido ? 'complete' : ''}`}
            style={{ width: `${progressoPercentual}%` }}
          >
            {progressoPercentual > 10 && `${progressoPercentual}%`}
          </div>
        </div>

        {podeGerenciar && (
          <button type="button" className="criar-button" onClick={() => setMostrarFormulario(true)}>
            + Criar Tarefa
          </button>
        )}

        {loadingTarefas ? (
          <p style={{ opacity: 0.6, textAlign: 'center', padding: '20px' }}>Carregando tarefas...</p>
        ) : tarefas.length === 0 ? (
          <p style={{ opacity: 0.6, textAlign: 'center', padding: '20px' }}>Nenhuma tarefa encontrada.</p>
        ) : (
          <form onSubmit={handleFinalizar}>
            {tarefas.map(tarefa => (
              <div key={tarefa.id} className="checkbox-item">
                <label>
                  {tarefa.title}
                  <span className="task-info">
                    {tarefa.description && `${tarefa.description} • `}
                    <span style={{ color: prioridadeCor[tarefa.priority], fontWeight: 600 }}>
                      {prioridadeLabel[tarefa.priority]}
                    </span>
                    {tarefa.user?.name && ` • ${tarefa.user.name}`}
                  </span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {podeGerenciar && (
                    <button
                      type="button"
                      onClick={() => handleDelete(tarefa.id)}
                      style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}
                    >✕</button>
                  )}
                  <input
                    type="checkbox"
                    checked={tarefa.status === 'COMPLETED'}
                    onChange={() => handleCheckboxChange(tarefa)}
                  />
                </div>
              </div>
            ))}

            {!podeGerenciar && (
              <>
                {finalizado ? (
                  <div style={{
                    marginTop: 24, padding: 20, borderRadius: 12,
                    background: '#e8f5e9', border: '1px solid #4caf50', textAlign: 'center'
                  }}>
                    <p style={{ color: '#2e7d32', fontWeight: 600, margin: 0 }}>
                      ✅ Treinamento finalizado! PDF gerado e gestor notificado.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="assinatura-field">
                      <label>Assinatura (Nome Completo)</label>
                      <input
                        type="text"
                        value={assinatura}
                        onChange={e => setAssinatura(e.target.value)}
                        placeholder="Digite seu nome completo para assinar"
                      />
                    </div>
                    <button
                      type="submit"
                      className="submit-button"
                      disabled={loadingFinalizar || !concluido}
                    >
                      {loadingFinalizar ? 'Finalizando...' : 'Finalizar e Gerar PDF'}
                    </button>
                  </>
                )}
              </>
            )}
          </form>
        )}
      </div>

      {mostrarFormulario && (
        <ModalNovaTarefa
          novaTarefa={novaTarefa}
          setNovaTarefa={setNovaTarefa}
          onSubmit={adicionarTarefa}
          onClose={() => setMostrarFormulario(false)}
          loadingSalvar={loadingSalvar}
        />
      )}
    </div>
  );
}