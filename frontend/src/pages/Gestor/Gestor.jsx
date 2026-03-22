// src/pages/Gestor/Gestor.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import { jsPDF } from "jspdf";
import { GestorAlertas } from "./GestorAlertas";
import fotoGestor from "../../assets/david.png";
import "./Gestor.css";
import { LOGO_BASE64 } from "../../assets/logo";

// ── PDF aprovado com ambas as assinaturas ──
function gerarPDFAprovado(processo, tarefas, assinaturaGestor, nomeGestor) {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // Logo
  doc.addImage(LOGO_BASE64, 'PNG', 88, 8, 34, 34);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ON THE JOB', 105, 50, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Checklist de Treinamento — APROVADO', 105, 58, { align: 'center' });
  doc.setLineWidth(0.5);
  doc.line(20, 63, 190, 63);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Colaborador:', 20, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employee?.name || '—', 60, 72);
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employee?.email || '—', 60, 80);
  doc.setFont('helvetica', 'bold');
  doc.text('Data de conclusão:', 20, 88);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.completedAt ? new Date(processo.completedAt).toLocaleDateString('pt-BR') : dataHoje, 60, 88);
  doc.line(20, 93, 190, 93);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tarefas Concluídas:', 20, 102);

  let y = 111;
  if (tarefas && tarefas.length > 0) {
    tarefas.forEach((tarefa, index) => {
      if (y > 255) { doc.addPage(); y = 20; }
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
  } else {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Nenhuma tarefa registrada.', 25, y);
    y += 8;
  }

  y += 10;
  doc.line(20, y, 190, y);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Colaborador:', 20, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employeeSignature || '—', 20, y + 20);

  y += 35;
  doc.line(20, y, 190, y);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Gestor:', 20, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(assinaturaGestor, 20, y + 20);
  doc.text(`Gestor: ${nomeGestor}`, 20, y + 28);
  doc.text(`Data de aprovação: ${dataHoje}`, 20, y + 36);

  doc.line(20, y + 45, 190, y + 45);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Documento gerado automaticamente pelo sistema ON THE JOB.', 105, y + 55, { align: 'center' });

  doc.save(`aprovado_${processo.employee?.name?.replace(/\s/g, '_')}_${dataHoje.replace(/\//g, '-')}.pdf`);
}

// ── PDF de visualização (só checklist do colaborador) ──
function visualizarChecklistPDF(processo, tarefas) {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  // Logo
  doc.addImage(LOGO_BASE64, 'PNG', 88, 8, 34, 34);

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('ON THE JOB', 105, 50, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Checklist de Treinamento — Aguardando Aprovação', 105, 58, { align: 'center' });
  doc.setLineWidth(0.5);
  doc.line(20, 63, 190, 63);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Colaborador:', 20, 72);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employee?.name || '—', 60, 72);
  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employee?.email || '—', 60, 80);
  doc.setFont('helvetica', 'bold');
  doc.text('Finalizado em:', 20, 88);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.completedAt ? new Date(processo.completedAt).toLocaleDateString('pt-BR') : dataHoje, 60, 88);
  doc.line(20, 93, 190, 93);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Tarefas Concluídas:', 20, 102);

  let y = 111;
  if (tarefas && tarefas.length > 0) {
    tarefas.forEach((tarefa, index) => {
      if (y > 255) { doc.addPage(); y = 20; }
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`✓ ${index + 1}. ${tarefa.title}`, 25, y);
      if (tarefa.description) {
        doc.setTextColor(120, 120, 120);
        doc.text(`   ${tarefa.description}`, 25, y + 5);
        doc.setTextColor(0, 0, 0);
        y += 12;
      } else {
        y += 8;
      }
    });
  }

  y += 15;
  doc.line(20, y, 190, y);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Colaborador:', 20, y + 10);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employeeSignature || '—', 20, y + 20);

  y += 35;
  doc.line(20, y, 190, y);
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('[ Aguardando assinatura do gestor ]', 105, y + 12, { align: 'center' });

  doc.save(`checklist_${processo.employee?.name?.replace(/\s/g, '_')}_preview.pdf`);
}

export function Gestor() {
  const { user, loading: authLoading } = useAuth();

  const [equipe, setEquipe] = useState([]);
  const [loadingEquipe, setLoadingEquipe] = useState(true);
  const [pendencias, setPendencias] = useState([]);
  const [loadingPendencias, setLoadingPendencias] = useState(true);
  const [assinaturas, setAssinaturas] = useState({});
  const [loadingAprovar, setLoadingAprovar] = useState({});
  const [loadingChecklist, setLoadingChecklist] = useState({});
  const [tarefasPorProcesso, setTarefasPorProcesso] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('@App:token');
    if (authLoading || !token || !user?.workAreaId) return;

    async function fetchDados() {
      try {
        const [equipeRes, pendenciasRes] = await Promise.all([
          api.get('/api/users/team'),
          api.get('/api/signatures/pending'),
        ]);
        setEquipe(equipeRes.data);
        setPendencias(pendenciasRes.data);
      } catch (error) {
        console.error('Erro ao buscar dados do gestor:', error);
      } finally {
        setLoadingEquipe(false);
        setLoadingPendencias(false);
      }
    }

    fetchDados();

    const intervalo = setInterval(() => {
      api.get('/api/signatures/pending')
        .then(res => setPendencias(res.data))
        .catch(() => {});
    }, 15000);

    return () => clearInterval(intervalo);
  }, [user?.workAreaId, authLoading]);

  async function handleVerChecklist(processo) {
    if (tarefasPorProcesso[processo.id]) {
      visualizarChecklistPDF(processo, tarefasPorProcesso[processo.id]);
      return;
    }

    setLoadingChecklist(prev => ({ ...prev, [processo.id]: true }));
    try {
      const response = await api.get(`/api/tasks/user/${processo.employeeId}`);
      const tarefas = response.data;
      setTarefasPorProcesso(prev => ({ ...prev, [processo.id]: tarefas }));
      visualizarChecklistPDF(processo, tarefas);
    } catch (error) {
      alert('Erro ao buscar checklist do colaborador.');
    } finally {
      setLoadingChecklist(prev => ({ ...prev, [processo.id]: false }));
    }
  }

  async function handleAprovar(processo) {
    const assinatura = assinaturas[processo.id];
    if (!assinatura?.trim()) {
      alert('Digite sua assinatura antes de aprovar.');
      return;
    }

    setLoadingAprovar(prev => ({ ...prev, [processo.id]: true }));
    try {
      await api.patch(`/api/signatures/${processo.id}/approve`, { signature: assinatura });
      const tarefas = tarefasPorProcesso[processo.id] || [];
      gerarPDFAprovado(processo, tarefas, assinatura, user.name);
      setPendencias(prev => prev.filter(p => p.id !== processo.id));
      setAssinaturas(prev => { const n = { ...prev }; delete n[processo.id]; return n; });
      setTarefasPorProcesso(prev => { const n = { ...prev }; delete n[processo.id]; return n; });
    } catch (error) {
      alert(error.response?.data?.message || 'Erro ao aprovar assinatura.');
    } finally {
      setLoadingAprovar(prev => ({ ...prev, [processo.id]: false }));
    }
  }

  const fasePorProgresso = (progresso) => {
    if (progresso < 35) return "inicio";
    if (progresso < 70) return "meio";
    return "final";
  };

  if (authLoading) return null;

  return (
    <div className="gestor-container">
      <header className="gestor-header">
        <img src={fotoGestor} alt="Gestor" className="gestor-avatar" />
      </header>

      <main className="gestor-main">
        <div className="gestor-card gestor-principal">
          <div className="gestor-foto">
            <img src={fotoGestor} alt={user?.name} />
          </div>
          <span className="nome">{user?.name}</span>
          <span className="setor">{user?.role}</span>
          <div className="divider" />
          <p className="descricao">Responsável pela coordenação da equipe.</p>
        </div>

        {!loadingEquipe && <GestorAlertas equipe={equipe} />}

        {!loadingPendencias && pendencias.length > 0 && (
          <div style={{ width: '100%' }}>
            <h3 style={{ color: 'var(--cor-texto)', marginBottom: 20, textAlign: 'center' }}>
              ✍️ Assinaturas Pendentes ({pendencias.length})
            </h3>
            <div className="gestor-organograma">
              {pendencias.map(processo => (
                <div className="gestor-card" key={processo.id}>
                  <span className="nome">{processo.employee?.name}</span>
                  <span className="setor">{processo.employee?.email}</span>
                  <div className="divider" />
                  <span className="treinamento">
                    Finalizado em: {processo.completedAt
                      ? new Date(processo.completedAt).toLocaleDateString('pt-BR')
                      : '—'}
                  </span>
                  <span className="treinamento" style={{ fontStyle: 'italic' }}>
                    Assinatura: "{processo.employeeSignature || '—'}"
                  </span>
                  <button
                    onClick={() => handleVerChecklist(processo)}
                    disabled={loadingChecklist[processo.id]}
                    style={{
                      marginTop: 10, width: '100%', padding: '10px', borderRadius: 8,
                      border: '1px solid var(--cor-principal)', background: 'transparent',
                      color: 'var(--cor-principal)', fontWeight: 600, cursor: 'pointer',
                      fontSize: '0.9rem', transition: '0.2s ease'
                    }}
                  >
                    {loadingChecklist[processo.id] ? 'Carregando...' : '📄 Ver Checklist do Colaborador'}
                  </button>
                  <input
                    type="text"
                    placeholder="Sua assinatura para aprovar"
                    value={assinaturas[processo.id] || ''}
                    onChange={e => setAssinaturas(prev => ({ ...prev, [processo.id]: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', borderRadius: 8, marginTop: 10,
                      border: '1px solid var(--cor-secundaria)', background: 'var(--cor-fundo)',
                      color: 'var(--cor-texto)', fontSize: '0.9rem', boxSizing: 'border-box'
                    }}
                  />
                  <button
                    onClick={() => handleAprovar(processo)}
                    disabled={loadingAprovar[processo.id]}
                    style={{
                      marginTop: 10, width: '100%', padding: '10px', borderRadius: 8,
                      border: 'none', background: 'var(--cor-principal)', color: '#fff',
                      fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem'
                    }}
                  >
                    {loadingAprovar[processo.id] ? 'Aprovando...' : '✅ Aprovar e Gerar PDF'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {loadingEquipe ? (
          <p style={{ opacity: 0.6 }}>Carregando equipe...</p>
        ) : equipe.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Nenhum colaborador encontrado na sua equipe.</p>
        ) : (
          <div className="gestor-organograma">
            {equipe.map(membro => (
              <div className="colab-wrapper" key={membro.id}>
                <div className="gestor-card">
                  <div className={`fase-indicador ${fasePorProgresso(membro.progresso)}`} />
                  <span className="nome">{membro.name}</span>
                  <span className="setor">{membro.workArea}</span>
                  <div className="divider" />
                  <span className="treinamento">Tarefas: {membro.completedTasks}/{membro.totalTasks}</span>
                  <div className="barra-progresso">
                    <div className="barra-preenchida" style={{ width: `${membro.progresso}%` }} />
                  </div>
                  <span className="treinamento">{membro.progresso}% concluído</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}