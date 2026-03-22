// src/pages/Home/AdminDashboard.jsx
// Componente separado para não poluir o Dashboard principal
import { useState, useEffect } from "react";
import api from "../../service/api";
import "./AdminDashboard.css";

export function AdminDashboard() {
  const [dados, setDados] = useState([]);
  const [pendencias, setPendencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDados() {
      try {
        const [dashRes, pendRes] = await Promise.all([
          api.get('/api/users/admin-dashboard'),
          api.get('/api/signatures/pending'),
        ]);
        setDados(dashRes.data);
        setPendencias(pendRes.data);
      } catch (error) {
        console.error('Erro ao buscar dashboard admin:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDados();
  }, []);

  // Conta assinaturas pendentes por área
  function getPendenciasPorArea(workAreaId) {
    return pendencias.filter(p => p.workAreaId === workAreaId).length;
  }

  if (loading) return <p style={{ opacity: 0.6 }}>Carregando painel administrativo...</p>;
  if (dados.length === 0) return null;

  return (
    <div className="admin-dashboard">
      <h2 className="titulo-secao">Painel Administrativo</h2>
      <p className="admin-subtitulo">Visão geral das equipes e progresso por área</p>

      <div className="admin-grid">
        {dados.map(item => {
          const pendencias = getPendenciasPorArea(item.workAreaId);

          return (
            <div className="admin-card" key={item.gestor.id}>
              {/* Cabeçalho */}
              <div className="admin-card-header">
                <div className="admin-avatar">{item.gestor.name.charAt(0)}</div>
                <div>
                  <p className="admin-gestor-nome">{item.gestor.name}</p>
                  <p className="admin-gestor-area">{item.workArea}</p>
                </div>
              </div>

              <div className="admin-divider" />

              {/* Métricas */}
              <div className="admin-metricas">
                <div className="admin-metrica">
                  <span className="admin-metrica-valor">{item.totalColaboradores}</span>
                  <span className="admin-metrica-label">Colaboradores</span>
                </div>
                <div className="admin-metrica">
                  <span className="admin-metrica-valor">{item.progressoMedio}%</span>
                  <span className="admin-metrica-label">Progresso médio</span>
                </div>
                <div className="admin-metrica">
                  <span
                    className="admin-metrica-valor"
                    style={{ color: pendencias > 0 ? '#e74c3c' : '#4caf50' }}
                  >
                    {pendencias}
                  </span>
                  <span className="admin-metrica-label">Assinaturas pendentes</span>
                </div>
              </div>

              {/* Barra de progresso */}
              <div className="admin-barra-bg">
                <div
                  className="admin-barra-fill"
                  style={{ width: `${item.progressoMedio}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}