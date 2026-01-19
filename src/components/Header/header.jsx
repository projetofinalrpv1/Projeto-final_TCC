import { FaBars, FaPlus } from 'react-icons/fa';
import "./Header.css";

export  function Header({ onToggle }) {
  return (
    <header className="cabecalho">
      <div className="cabecalho-esquerda">
        <FaBars className="menu-icon" onClick={onToggle} />
        <h1>Minha Plataforma</h1>
      </div>
      <div className="cabecalho-direita">
        <FaPlus className="add-icon" />
        <div className="perfil">U</div>
      </div>
    </header>
  );
}
