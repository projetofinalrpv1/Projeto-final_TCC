import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [identificadorReset, setIdentificadorReset] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  
  const navigate = useNavigate();

  
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

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (usuarios.hasOwnProperty(identificadorReset)) {
    
      alert(`Uma instrução para redefinição de senha foi enviada para ${identificadorReset}. 
            (Simulação: A senha foi "redefinida" com sucesso para "${novaSenha}")`);
      
      setResetMode(false);
      setIdentificadorReset("");
      setNovaSenha("");

    } else {
      alert("Identificador de usuário (e-mail) não encontrado.");
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
              <button type="submit" className="botao">
                Entrar
              </button>
            </form>
            
           
            <p className="link-redefinir">
               Esqueceu sua senha?
              <a href="#" onClick={() => setResetMode(true)}>
               redefinir senha
              </a>
            </p>
          </>
        ) : (   
          <>
            <h2>Redefinir Senha</h2>
            <form className="login-form" onSubmit={handleResetPassword}>
              <input
                type="email"
                placeholder="Digite seu e-mail de recuperação"
                value={identificadorReset}
                onChange={(e) => setIdentificadorReset(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Digite a nova senha"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
              />
              <button type="submit" className="botao">
                Redefinir
              </button>
            </form>
            
            <p className="link-redefinir">
              <a href="#" onClick={() => setResetMode(false)}>
                Voltar para o Login
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}