// src/pages/Home/CourseCard.jsx
import { useNavigate } from "react-router-dom";

export function CourseCard({ id, titulo, gestor, onDelete, canDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bloco-curso-wrapper">
      <div
        className="bloco-curso-link"
        onClick={() => navigate(`/app/material/${id}`)}
        style={{ cursor: 'pointer' }}
      >
        <div className="bloco-curso">
          <div className="bloco-curso-topo" />
          <div className="bloco-curso-conteudo">
            <h3>{titulo}</h3>
            <p className="curso-professor">{gestor}</p>
          </div>
          <div className="curso-rodape">
            <span className="tag-conteudo">Material Estratégico</span>
          </div>
        </div>
      </div>

      {canDelete && (
        <button className="botao-excluir" onClick={() => onDelete(id)}>
          ✕
        </button>
      )}
    </div>
  );
}