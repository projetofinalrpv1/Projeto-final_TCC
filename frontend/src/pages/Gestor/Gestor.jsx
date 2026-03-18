// src/pages/Gestor/Gestor.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import fotoGestor from "../../assets/david.png";
import "./Gestor.css";

export function Gestor() {
  const { user, loading: authLoading } = useAuth();
  const [equipe, setEquipe] = useState([]);
  const [loadingEquipe, setLoadingEquipe] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@App:token');
    if (authLoading || !token) return;

    async function fetchEquipe() {
      setLoadingEquipe(true);
      try {
        const response = await api.get('/api/users/team');
        setEquipe(response.data);
      } catch (error) {
        console.error('Erro ao buscar equipe:', error);
      } finally {
        setLoadingEquipe(false);
      }
    }

    fetchEquipe();
  }, [authLoading]);

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
        {/* CARD DO GESTOR LOGADO */}
        <div className="gestor-card gestor-principal">
          <div className="gestor-foto">
            <img src={fotoGestor} alt={user?.name} />
          </div>

          <span className="nome">{user?.name}</span>
          <span className="setor">{user?.role}</span>

          <div className="divider" />

          <p className="descricao">
            Responsável pela coordenação da equipe.
          </p>
        </div>

        {/* COLABORADORES DA EQUIPE */}
        {loadingEquipe ? (
          <p style={{ opacity: 0.6 }}>Carregando equipe...</p>
        ) : equipe.length === 0 ? (
          <p style={{ opacity: 0.6 }}>Nenhum colaborador encontrado na sua equipe.</p>
        ) : (
          <div className="gestor-organograma">
            {equipe.map((membro) => {
              const fase = fasePorProgresso(membro.progresso);

              return (
                <div className="colab-wrapper" key={membro.id}>
                  <div className="gestor-card">
                    <div className={`fase-indicador ${fase}`} />

                    <span className="nome">{membro.name}</span>
                    <span className="setor">{membro.workArea}</span>

                    <div className="divider" />

                    <span className="treinamento">
                      Tarefas: {membro.completedTasks}/{membro.totalTasks}
                    </span>

                    <div className="barra-progresso">
                      <div
                        className="barra-preenchida"
                        style={{ width: `${membro.progresso}%` }}
                      />
                    </div>

                    <span className="treinamento">
                      {membro.progresso}% concluído
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}