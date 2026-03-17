// src/pages/Home/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import { CourseCard } from "../../components/CourseCard/CourseCard";
import "./Dashboard.css";

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();

  const [courses, setCourses] = useState([]);
  const [loadingMateriais, setLoadingMateriais] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [loadingSalvar, setLoadingSalvar] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [novoConteudo, setNovoConteudo] = useState({
    titulo: "",
    gestor: "",
    descricao: "",
    arquivoUrl: "",
    rota: "",
  });

  const podeGerenciar = ['ADMIN', 'GESTOR'].includes(user?.role);

  useEffect(() => {
    // Espera o AuthContext terminar de carregar E o token estar disponível
    const token = localStorage.getItem('@App:token');
  console.log('authLoading:', authLoading);
  console.log('user:', user);
  console.log('token:', token);
    if (authLoading || !user?.workAreaId || !token) return;

    async function fetchMaterials() {
      setLoadingMateriais(true);
      try {
        const response = await api.get(`/api/materials/${user.workAreaId}`);
        setCourses(response.data);
      } catch (error) {
        console.error("Erro ao buscar materiais:", error);
      } finally {
        setLoadingMateriais(false);
      }
    }

    fetchMaterials();
  }, [user, authLoading]); // depende do authLoading também

  async function adicionarConteudo() {
    const { titulo, gestor, descricao, arquivoUrl } = novoConteudo;

    if (!titulo || !gestor || !descricao || !arquivoUrl) {
      setErrorMsg("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoadingSalvar(true);
    setErrorMsg("");

    try {
      const response = await api.post("/api/materials", {
        titulo,
        gestor,
        descricao,
        arquivoUrl,
        rota: novoConteudo.rota || "#",
        workAreaId: user.workAreaId,
      });

      setCourses(prev => [...prev, response.data]);
      setMostrarModal(false);
      setNovoConteudo({ titulo: "", gestor: "", descricao: "", arquivoUrl: "", rota: "" });
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Erro ao salvar material.");
    } finally {
      setLoadingSalvar(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Deseja excluir este material permanentemente?")) return;
    try {
      await api.delete(`/api/materials/${id}`);
      setCourses(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Erro ao excluir material.");
    }
  }

  // Enquanto o auth ainda está carregando, não renderiza nada
  if (authLoading) return null;

  return (
    <div className="conteudo-pagina">
      <h2 className="titulo-secao">Adaptação</h2>

      <div className="bloco-atividades">
        <div className="atividade-item">
          <p className="atividade-titulo">
            Programa de integração - Engenharia de Software
          </p>
        </div>
        <div className="atividade-item">
          <p className="atividade-titulo">Demandas técnicas atribuídas</p>
        </div>
      </div>

      <div className="topo-conteudos">
        <h2 className="titulo-secao">Conteúdos recomendados</h2>
        {podeGerenciar && (
          <button className="botao-primario" onClick={() => setMostrarModal(true)}>
            + Adicionar conteúdo
          </button>
        )}
      </div>

      <p className="cursos-subtitulo">
        Materiais estratégicos voltados para desenvolvimento e tecnologia
      </p>

      {loadingMateriais ? (
        <p style={{ opacity: 0.6 }}>Carregando materiais...</p>
      ) : courses.length === 0 ? (
        <p style={{ opacity: 0.6 }}>Nenhum material disponível para sua área.</p>
      ) : (
        <div className="blocos-cursos">
          {courses.map(course => (
            <CourseCard
              key={course.id}
              id={course.id}
              titulo={course.titulo}
              gestor={course.gestor}
              rota={course.rota}
              canDelete={podeGerenciar}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h3 className="modal-titulo">Novo Material de Apoio</h3>

            <input
              type="text"
              placeholder="Título do material *"
              value={novoConteudo.titulo}
              onChange={e => setNovoConteudo(prev => ({ ...prev, titulo: e.target.value }))}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Nome do Gestor responsável *"
              value={novoConteudo.gestor}
              onChange={e => setNovoConteudo(prev => ({ ...prev, gestor: e.target.value }))}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Descrição breve *"
              value={novoConteudo.descricao}
              onChange={e => setNovoConteudo(prev => ({ ...prev, descricao: e.target.value }))}
              className="modal-input"
            />
            <input
              type="url"
              placeholder="Link do arquivo (Google Drive, etc.) *"
              value={novoConteudo.arquivoUrl}
              onChange={e => setNovoConteudo(prev => ({ ...prev, arquivoUrl: e.target.value }))}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Rota interna (opcional, ex: /app/curso/arq)"
              value={novoConteudo.rota}
              onChange={e => setNovoConteudo(prev => ({ ...prev, rota: e.target.value }))}
              className="modal-input"
            />

            {errorMsg && (
              <p style={{ color: '#e74c3c', fontSize: '0.85rem', margin: '4px 0' }}>
                {errorMsg}
              </p>
            )}

            <div className="modal-botoes">
              <button
                className="botao-secundario"
                onClick={() => { setMostrarModal(false); setErrorMsg(""); }}
              >
                Cancelar
              </button>
              <button
                className="botao-primario"
                onClick={adicionarConteudo}
                disabled={loadingSalvar}
              >
                {loadingSalvar ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}