// src/pages/Tarefas/Tarefas.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import { jsPDF } from "jspdf";
import "./tarefas.css";

const prioridadeLabel = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta' };
const prioridadeCor = { LOW: '#4caf50', MEDIUM: '#ffb300', HIGH: '#e74c3c' };

// ── Gera PDF do colaborador ──
function gerarPDFColaborador(user, tarefas, assinatura) {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // Cabeçalho
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ON THE JOB', 105, 20, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('Checklist de Treinamento de Integração', 105, 30, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Dados do colaborador
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Colaborador:', 20, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(user.name, 60, 45);

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, 53);
  doc.setFont('helvetica', 'normal');
  doc.text(user.email, 60, 53);

  doc.setFont('helvetica', 'bold');
  doc.text('Data:', 20, 61);
  doc.setFont('helvetica', 'normal');
  doc.text(dataHoje, 60, 61);

  doc.line(20, 67, 190, 67);

  // Tarefas
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tarefas Concluídas:', 20, 76);

  let y = 85;
  tarefas.forEach((tarefa, index) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`${index + 1}. ${tarefa.title}`, 25, y);
    if (tarefa.description) {
      doc.setTextColor(120, 120, 120);
      doc.text(`   ${tarefa.description}`, 25, y + 5);
      doc.setTextColor(0, 0, 0);
      y += 12;
    } else {
      y += 8;
    }
  });

  // Assinatura do colaborador
  y += 15;
  doc.line(20, y, 190, y);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Colaborador:', 20, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(assinatura, 20, y + 20);
  doc.text(`Data: ${dataHoje}`, 20, y + 28);

  // Espaço para gestor
  y += 45;
  doc.line(20, y, 190, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Gestor:', 20, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text('_______________________________', 20, y + 20);
  doc.text('Data: ___/___/______', 20, y + 28);

  doc.save(`checklist_${user.name.replace(/\s/g, '_')}_${dataHoje.replace(/\//g, '-')}.pdf`);
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

  // ── Finalizar: gera PDF + envia para o backend ──
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
      // 1. Envia para o backend criar o processo de assinatura
      await api.post('/api/tasks/finalize', {
        workAreaId: user.workAreaId,
        signature: assinatura,
      });

      // 2. Gera e baixa o PDF localmente
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

        {mostrarFormulario && (
          <div className="modal">
            <form className="modal-content" onSubmit={adicionarTarefa}>
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
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
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
                <button type="button" onClick={() => setMostrarFormulario(false)}>Cancelar</button>
              </div>
            </form>
          </div>
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

            {/* Assinatura e finalização — só COLABORADOR */}
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
    </div>
  );
}