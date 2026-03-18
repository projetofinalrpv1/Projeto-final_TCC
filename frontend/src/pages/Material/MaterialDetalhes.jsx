// src/pages/Material/MaterialDetalhes.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../service/api";
import "./MaterialDetalhes.css";

export function MaterialDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function fetchMaterial() {
      try {
        const response = await api.get(`/api/materials/detalhes/${id}`);
        setMaterial(response.data);
      } catch (error) {
        setErro("Material não encontrado ou você não tem permissão para acessá-lo.");
      } finally {
        setLoading(false);
      }
    }
    fetchMaterial();
  }, [id]);

  if (loading) return <div className="material-loading">Carregando material...</div>;
  if (erro) return <div className="material-erro">{erro}</div>;

  return (
    <div className="material-detalhes-container">
      {/* Cabeçalho */}
      <div className="material-header">
        <button className="btn-voltar" onClick={() => navigate(-1)}>
          ← Voltar
        </button>
        <div className="material-meta">
          <h1>{material.titulo}</h1>
          <p className="material-gestor">Responsável: <strong>{material.gestor}</strong></p>
          <p className="material-descricao">{material.descricao}</p>
        </div>
        <a
          href={material.arquivoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-abrir-externo"
        >
          Abrir no Drive ↗
        </a>
      </div>

      {/* Iframe do PDF */}
      <div className="material-iframe-wrapper">
        <iframe
          src={material.arquivoUrl}
          title={material.titulo}
          className="material-iframe"
          allow="autoplay"
        />
      </div>
    </div>
  );
}