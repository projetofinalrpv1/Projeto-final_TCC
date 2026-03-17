// src/components/CourseCard/CourseCard.jsx
import { Link } from "react-router-dom";

export function CourseCard({ id, titulo, gestor, rota, onDelete, canDelete }) {
  return (
    <div className="bloco-curso-wrapper">
      <Link to={rota || "#"} className="bloco-curso-link">
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
      </Link>

      {canDelete && (
        <button className="botao-excluir" onClick={() => onDelete(id)}>
          ✕
        </button>
      )}
    </div>
  );
}