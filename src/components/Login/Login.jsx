import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  // Objeto com emails e senhas de teste
  const usuarios = {
    // Usuários comuns
    "usuario1@email.com": "senha123",
    "usuario2@email.com": "senha456",
    // Gestores
    "gestor1@email.com": "senha789",
    "gestor2@email.com": "senhaabc",
  };

const handleLogin = (e) => {
    e.preventDefault();

    const senhaCorreta = usuarios[email];

    if (senhaCorreta && senhaCorreta === senha) {
        

        let rotaDestino;

        if (email.includes("gestor")) {

            rotaDestino = "/h/gestor"; 
        } else {

            rotaDestino = "/h/tarefas";
        }
        navigate(rotaDestino);

    } else {

        alert("Email ou senha incorretos.");
    }
};

  return (
    <div className="aba-principal">
      <h1>ON THE JOB</h1>

      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <button type="submit" className="botao">
            Entrar
          </button>
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