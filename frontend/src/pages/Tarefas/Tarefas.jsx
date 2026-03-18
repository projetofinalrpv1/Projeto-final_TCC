// src/pages/Tarefas/Tarefas.jsx
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import "./tarefas.css";

// ── Prioridade ──
const prioridadeLabel = { LOW: 'Baixa', MEDIUM: 'Média', HIGH: 'Alta' };
const prioridadeCor = { LOW: '#4caf50', MEDIUM: '#ffb300', HIGH: '#e74c3c' };

export function Tarefas() {
  const { user, loading: authLoading } = useAuth();
  const podeGerenciar = ['ADMIN', 'GESTOR'].includes(user?.role);

  const [tarefas, setTarefas] = useState([]);
  const [loadingTarefas, setLoadingTarefas] = useState(true);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [assinatura, setAssinatura] = useState("");

  const [novaTarefa, setNovaTarefa] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    isTemplate: false,
    userId: "",
  });

  // ── Busca tarefas conforme o role ──
  useEffect(() => {
    const token = localStorage.getItem('@App:token');
    if (authLoading || !token) return;

    async function fetchTarefas() {
      setLoadingTarefas(true);
      try {
        // COLABORADOR vê suas próprias tarefas
        // GESTOR/ADMIN veem todas as tarefas da área
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
  }, [authLoading]);

  // ── Atualiza status da tarefa ──
  async function handleCheckboxChange(tarefa) {
    const novoStatus = tarefa.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';

    // Otimistic update — atualiza UI antes da resposta
    setTarefas(prev =>
      prev.map(t => t.id === tarefa.id ? { ...t, status: novoStatus } : t)
    );

    try {
      await api.patch(`/api/tasks/${tarefa.id}/status`, { status: novoStatus });
    } catch (error) {
      // Reverte se falhar
      setTarefas(prev =>
        prev.map(t => t.id === tarefa.id ? { ...t, status: tarefa.status } : t)
      );
      alert('Erro ao atualizar tarefa.');
    }
  }

  // ── Criar tarefa (GESTOR/ADMIN) ──
  async function adicionarTarefa(e) {
    e.preventDefault();
    if (!novaTarefa.title) return;

    setLoadingSalvar(true);
    try {
      const payload = {
        title: novaTarefa.title,
        description: novaTarefa.description,
        priority: novaTarefa.priority,
        isTemplate: novaTarefa.isTemplate,
        workAreaId: user.workAreaId,
        ...(novaTarefa.userId && { userId: novaTarefa.userId }),
      };

      const response = await api.post('/api/tasks', payload);
      setTarefas(prev => [...prev, response.data]);
      setMostrarFormulario(false);
      setNovaTarefa({ title: "", description: "", priority: "MEDIUM", isTemplate: false, userId: "" });
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao criar tarefa.');
    } finally {
      setLoadingSalvar(false);
    }
  }

  // ── Excluir tarefa (GESTOR/ADMIN) ──
  async function handleDelete(id) {
    if (!confirm('Deseja excluir esta tarefa?')) return;
    try {
      await api.delete(`/api/tasks/${id}`);
      setTarefas(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao excluir tarefa.');
    }
  }

  // ── Progresso ──
  const progressoPercentual = useMemo(() => {
    if (tarefas.length === 0) return 0;
    const concluidas = tarefas.filter(t => t.status === 'COMPLETED').length;
    return Math.round((concluidas / tarefas.length) * 100);
  }, [tarefas]);

  const concluido = progressoPercentual === 100;

  // ── Finalizar (placeholder para PDF/assinatura) ──
  function handleSubmit(e) {
    e.preventDefault();
    if (progressoPercentual < 100) {
      alert('Conclua todas as tarefas antes de finalizar.');
      return;
    }
    if (!assinatura.trim()) {
      alert('Preencha o campo de assinatura.');
      return;
    }
    // TODO: implementar geração de PDF com assinatura
    alert(`Treinamento finalizado!\nAssinado por: ${assinatura}`);
  }

  if (authLoading) return null;

  return (
    <div className="container">
      <div className="form-card">
        <h2>
          {podeGerenciar
            ? 'Tarefas da Área'
            : 'Meu Treinamento de Integração'}
        </h2>

        {/* Barra de progresso */}
        <div className="progress-bar-container">
          <div
            className={`progress-bar-fill ${concluido ? 'complete' : ''}`}
            style={{ width: `${progressoPercentual}%` }}
          >
            {progressoPercentual > 10 && `${progressoPercentual}%`}
          </div>
        </div>

        {/* Botão criar tarefa — só GESTOR/ADMIN */}
        {podeGerenciar && (
          <button
            type="button"
            className="criar-button"
            onClick={() => setMostrarFormulario(true)}
          >
            + Criar Tarefa
          </button>
        )}

        {/* Modal de criação */}
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
                <button type="button" onClick={() => setMostrarFormulario(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de tarefas */}
        {loadingTarefas ? (
          <p style={{ opacity: 0.6, textAlign: 'center', padding: '20px' }}>
            Carregando tarefas...
          </p>
        ) : tarefas.length === 0 ? (
          <p style={{ opacity: 0.6, textAlign: 'center', padding: '20px' }}>
            Nenhuma tarefa encontrada.
          </p>
        ) : (
          <form onSubmit={handleSubmit}>
            {tarefas.map((tarefa) => (
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
                  {/* Excluir — só GESTOR/ADMIN */}
                  {podeGerenciar && (
                    <button
                      type="button"
                      onClick={() => handleDelete(tarefa.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#e74c3c',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                      }}
                    >
                      ✕
                    </button>
                  )}

                  <input
                    type="checkbox"
                    checked={tarefa.status === 'COMPLETED'}
                    onChange={() => handleCheckboxChange(tarefa)}
                  />
                </div>
              </div>
            ))}

            {/* Assinatura — só para COLABORADOR quando tudo estiver concluído */}
            {!podeGerenciar && (
              <div className="assinatura-field">
                <label>Assinatura (Nome Completo)</label>
                <input
                  type="text"
                  value={assinatura}
                  onChange={e => setAssinatura(e.target.value)}
                  placeholder="Digite seu nome para assinar"
                />
              </div>
            )}

            {!podeGerenciar && (
              <button type="submit" className="submit-button">
                Finalizar Treinamento
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}