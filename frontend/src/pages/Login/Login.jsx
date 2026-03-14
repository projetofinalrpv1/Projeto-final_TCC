// src/pages/Login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import api from "../../service/api";
import "./Login.css";

export function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  // --- Estados do formulário de login ---
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loadingLogin, setLoadingLogin] = useState(false);

  // --- Estados do formulário de reset ---
  const [resetMode, setResetMode] = useState(false);
  const [emailReset, setEmailReset] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [loadingReset, setLoadingReset] = useState(false);

  // -------------------------------------------------------
  // LOGIN: consome a API real via signIn do AuthContext
  // -------------------------------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoadingLogin(true);

    const result = await signIn({ email, password: senha });

    if (result.success) {
      navigate("/app"); // Redireciona pro Dashboard — ele decide o que mostrar por role
    } else {
      setErrorMsg(result.message);
    }

    setLoadingLogin(false);
  };

  // -------------------------------------------------------
  // RESET DE SENHA: envia e-mail para a rota da API
  // Ajuste o endpoint conforme sua rota no Fastify
  // -------------------------------------------------------
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg("");
    setLoadingReset(true);

    try {
      await api.post("/auth/forgot-password", { email: emailReset });
      setResetMsg("Instruções enviadas para o seu e-mail.");
      setEmailReset("");
    } catch (error) {
      const msg = error.response?.data?.message || "E-mail não encontrado.";
      setResetMsg(msg);
    }

    setLoadingReset(false);
  };

  // -------------------------------------------------------
  // RENDER
  // -------------------------------------------------------
  return (
    <div className="aba-principal">
      <img src="./src/assets/Logo-on-the-job1.PNG" alt="Logo On The Job" />
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

              {/* Exibe mensagem de erro vinda da API */}
              {errorMsg && <p className="error-msg">{errorMsg}</p>}

              <button type="submit" className="botao" disabled={loadingLogin}>
                {loadingLogin ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="link-redefinir">
              Esqueceu sua senha?{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setErrorMsg("");
                  setResetMode(true);
                }}
              >
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
                placeholder="E-mail de recuperação"
                value={emailReset}
                onChange={(e) => setEmailReset(e.target.value)}
                required
              />

              {/* Exibe mensagem de sucesso ou erro do reset */}
              {resetMsg && <p className="error-msg">{resetMsg}</p>}

              <button type="submit" className="botao" disabled={loadingReset}>
                {loadingReset ? "Enviando..." : "Enviar instruções"}
              </button>
            </form>

            <p className="link-redefinir">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setResetMsg("");
                  setResetMode(false);
                }}
              >
                Voltar
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
