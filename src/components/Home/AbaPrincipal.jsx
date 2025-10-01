import { Link } from "react-router-dom";
import "./AbaPrincipal.css"; 

export function AbaPrincipal() {
  return (
    <div className="aba-principal">
      <h1>ON THE JOB</h1>

    
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form">
          <input type="email" placeholder="Digite seu e-mail" required />
          <input type="password" placeholder="Digite sua senha" required />
          <button type="submit" className="botao">Entrar</button>
        </form>
      </div>

     
      <div className="botoes">
        <Link to="/tarefas">
          <button className="botao">Ir para Tarefas</button>
        </Link>

        <Link to="/gestor">
          <button className="botao">Ir para Gestor</button>
        </Link>
      </div>
    </div>
  );
}
