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
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [resetMsg, setResetMsg] = useState({ texto: "", tipo: "" });
  const [loadingReset, setLoadingReset] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoadingLogin(true);

    const result = await signIn({ email, password: senha });

    if (result.success) {
      navigate("/app");
    } else {
      setErrorMsg(result.message);
    }

    setLoadingLogin(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetMsg({ texto: "", tipo: "" });

    // Validação local
    if (novaSenha.length < 6) {
      setResetMsg({ texto: "A senha deve ter no mínimo 6 caracteres.", tipo: "erro" });
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setResetMsg({ texto: "As senhas não coincidem.", tipo: "erro" });
      return;
    }

    setLoadingReset(true);

    try {
      await api.post("/auth/reset-password", {
        email: emailReset,
        password: novaSenha,
      });

      setResetMsg({ texto: "Senha redefinida com sucesso! Faça login.", tipo: "sucesso" });

      // Volta para login após 2 segundos
      setTimeout(() => {
        setResetMode(false);
        setEmailReset("");
        setNovaSenha("");
        setConfirmarSenha("");
        setResetMsg({ texto: "", tipo: "" });
      }, 2000);

    } catch (error) {
      const msg = error.response?.data?.message || "E-mail não encontrado.";
      setResetMsg({ texto: msg, tipo: "erro" });
    }

    setLoadingReset(false);
  };

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
                placeholder="Seu e-mail cadastrado *"
                value={emailReset}
                onChange={(e) => setEmailReset(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Nova senha (mín. 6 caracteres) *"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                required
                minLength={6}
              />
              <input
                type="password"
                placeholder="Confirmar nova senha *"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />

              {resetMsg.texto && (
                <p className={`error-msg ${resetMsg.tipo === 'sucesso' ? 'success-msg' : ''}`}>
                  {resetMsg.texto}
                </p>
              )}

              <button type="submit" className="botao" disabled={loadingReset}>
                {loadingReset ? "Redefinindo..." : "Redefinir Senha"}
              </button>
            </form>

            <p className="link-redefinir">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setResetMsg({ texto: "", tipo: "" });
                  setResetMode(false);
                }}
              >
                ← Voltar ao login
              </a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}