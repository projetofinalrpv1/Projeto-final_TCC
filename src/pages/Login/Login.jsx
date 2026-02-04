import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import "./Login.css";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [identificadorReset, setIdentificadorReset] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  const usuarios = {
    "usuario1@email.com": { senha: "senha123", role: "colaborador", name: "Usuário Comum" },
    "gestor1@email.com": { senha: "senha789", role: "gestor", name: "Gestor Principal" },
    "admin1@email.com": { senha: "admin123", role: "admin", name: "Administrador" }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const dadosUsuario = usuarios[email];

    if (dadosUsuario && dadosUsuario.senha === senha) {
      login({
        email: email,
        name: dadosUsuario.name,
        role: dadosUsuario.role
      });

      // Redirecionamento imediato após setar o contexto
      if (dadosUsuario.role === "gestor") {
        navigate("/app/gestor");
      } else {
        navigate("/app/tarefas");
      }
    } else {
      alert("Email ou senha incorretos.");
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (usuarios.hasOwnProperty(identificadorReset)) {
      alert(`Instrução enviada para ${identificadorReset}.`);
      setResetMode(false);
      setIdentificadorReset("");
      setNovaSenha("");
    } else {
      alert("E-mail não encontrado.");
    }
  };

  return (
    <div className="aba-principal">
      <img src="./src/assets/Logo-on-the-job1.PNG" alt="" />
      <h1>ON THE JOB</h1>
      <div className="login-container">
        {!resetMode ? (
          <>
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
              <button type="submit" className="botao">Entrar</button>
            </form>
            <p className="link-redefinir">
              Esqueceu sua senha?{" "}
              <a href="#" onClick={(e) => { e.preventDefault(); setResetMode(true); }}>redefinir senha</a>
            </p>
          </>
        ) : (
          <>
            <h2>Redefinir Senha</h2>
            <form className="login-form" onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="E-mail de recuperação"
                value={identificadorReset}
                onChange={(e) => setIdentificadorReset(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
              <button type="submit" className="botao">Redefinir</button>
            </form>
            <p className="link-redefinir">
              <a href="#" onClick={(e) => { e.preventDefault(); setResetMode(false); }}>Voltar</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}