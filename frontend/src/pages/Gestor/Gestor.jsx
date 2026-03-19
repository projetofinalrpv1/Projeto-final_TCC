// src/pages/Gestor/Gestor.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import { jsPDF } from "jspdf";
import { GestorAlertas } from "./GestorAlertas";
import fotoGestor from "../../assets/david.png";
import "./Gestor.css";

function gerarPDFAprovado(processo, assinaturaGestor, nomeGestor) {
  const doc = new jsPDF();
  const dataHoje = new Date().toLocaleDateString('pt-BR');

  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('ON THE JOB', 105, 20, { align: 'center' });

  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('Checklist de Treinamento — APROVADO', 105, 30, { align: 'center' });

  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Colaborador:', 20, 45);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employee?.name || '—', 60, 45);

  doc.setFont('helvetica', 'bold');
  doc.text('Email:', 20, 53);
  doc.setFont('helvetica', 'normal');
  doc.text(processo.employee?.email || '—', 60, 53);

  doc.setFont('helvetica', 'bold');
  doc.text('Data de conclusão:', 20, 61);
  doc.setFont('helvetica', 'normal');
  const dataConclusao = processo.completedAt
    ? new Date(processo.completedAt).toLocaleDateString('pt-BR')
    : dataHoje;
  doc.text(dataConclusao, 60, 61);

  doc.line(20, 67, 190, 67);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Colaborador:', 20, 80);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(processo.employeeSignature || '—', 20, 90);

  doc.line(20, 100, 190, 100);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Assinatura do Gestor:', 20, 113);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(assinaturaGestor, 20, 123);
  doc.text(`Gestor: ${nomeGestor}`, 20, 131);
  doc.text(`Data de aprovação: ${dataHoje}`, 20, 139);

  doc.line(20, 148, 190, 148);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Documento gerado automaticamente pelo sistema ON THE JOB.', 105, 160, { align: 'center' });

  doc.save(`aprovado_${processo.employee?.name?.replace(/\s/g, '_')}_${dataHoje.replace(/\//g, '-')}.pdf`);
}

export function Gestor() {
  const { user, loading: authLoading } = useAuth();

  const [equipe, setEquipe] = useState([]);
  const [loadingEquipe, setLoadingEquipe] = useState(true);
  const [pendencias, setPendencias] = useState([]);
  const [loadingPendencias, setLoadingPendencias] = useState(true);
  const [assinaturas, setAssinaturas] = useState({});
  const [loadingAprovar, setLoadingAprovar] = useState({});

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

  // ← Adiciona isso: verifica a cada 15 segundos
  const intervalo = setInterval(() => {
    api.get('/api/signatures/pending')
      .then(res => setPendencias(res.data))
      .catch(() => {});
  }, 15000);

  // ← Limpa o intervalo quando o componente desmonta
  return () => clearInterval(intervalo);

}, [user?.workAreaId, authLoading]);

  async function handleAprovar(processo) {
    const assinatura = assinaturas[processo.id];
    if (!assinatura?.trim()) {
      alert('Digite sua assinatura antes de aprovar.');
      return;
    }

    setLoadingAprovar(prev => ({ ...prev, [processo.id]: true }));
    try {
      await api.patch(`/api/signatures/${processo.id}/approve`, { signature: assinatura });
      gerarPDFAprovado(processo, assinatura, user.name);
      setPendencias(prev => prev.filter(p => p.id !== processo.id));
      setAssinaturas(prev => { const n = { ...prev }; delete n[processo.id]; return n; });
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
        {/* CARD DO GESTOR */}
        <div className="gestor-card gestor-principal">
          <div className="gestor-foto">
            <img src={fotoGestor} alt={user?.name} />
          </div>
          <span className="nome">{user?.name}</span>
          <span className="setor">{user?.role}</span>
          <div className="divider" />
          <p className="descricao">Responsável pela coordenação da equipe.</p>
        </div>

        {/* ALERTAS DE 30 DIAS */}
        {!loadingEquipe && <GestorAlertas equipe={equipe} />}

        {/* ASSINATURAS PENDENTES */}
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

        {/* EQUIPE */}
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