// src/pages/Form-cadastro/form.jsx
import { useState, useEffect } from "react";
import api from "../../service/api";
import "./Form.css";

export default function Form({ fechar, usuarioEditando }) {
  const isEdicao = !!usuarioEditando;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "COLABORADOR",
    workAreaId: "",
    managerId: "",
    dataInicio: "", // apenas visual, não vai para a API
  });

  const [workareas, setWorkareas] = useState([]);
  const [gestores, setGestores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // -------------------------------------------------------
  // Carrega workareas e gestores ao abrir o formulário
  // -------------------------------------------------------
  useEffect(() => {
    async function carregarSelects() {
      try {
        const [areasRes, gestoresRes] = await Promise.all([
          api.get('/api/workareas'),
          api.get('/api/users/managers'),
        ]);
        setWorkareas(areasRes.data);
        setGestores(gestoresRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados dos selects:', error);
      }
    }
    carregarSelects();
  }, []);

  // -------------------------------------------------------
  // Preenche o formulário se for edição
  // -------------------------------------------------------
  useEffect(() => {
    if (isEdicao) {
      setFormData({
        name: usuarioEditando.name || "",
        email: usuarioEditando.email || "",
        password: "", // senha não é preenchida na edição
        role: usuarioEditando.role || "COLABORADOR",
        workAreaId: usuarioEditando.workAreaId || "",
        managerId: usuarioEditando.managerId || "",
        dataInicio: "",
      });
    }
  }, [usuarioEditando]);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  // -------------------------------------------------------
  // Submit: POST (cadastro) ou PATCH (edição)
  // -------------------------------------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      if (isEdicao) {
        // PATCH — só envia campos alterados
        const payload = {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          workAreaId: formData.workAreaId,
          managerId: formData.role === 'GESTOR' ? null : formData.managerId || null,
          ...(formData.password && { password: formData.password }),
        };
        await api.patch(`/api/users/${usuarioEditando.id}`, payload);
      } else {
        // POST — cadastro completo
        const payload = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          workAreaId: formData.workAreaId,
          managerId: formData.role === 'GESTOR' ? null : formData.managerId || null,
        };
        await api.post('/api/users', payload);
      }

      fechar(); // fecha e recarrega a tabela
    } catch (error) {
      setErrorMsg(error.response?.data?.message || 'Erro ao salvar usuário.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="form-overlay">
      <div className="form-container">
        <form className="form" onSubmit={handleSubmit}>
          <h2>{isEdicao ? 'Editar Usuário' : 'Cadastro de Usuário'}</h2>

          <label>Nome</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>{isEdicao ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            {...(!isEdicao && { required: true })}
            minLength={6}
          />

          <label>Setor</label>
          <select
            name="workAreaId"
            value={formData.workAreaId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um setor</option>
            {workareas.map(area => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>

          <label>Data de Início do Treinamento</label>
          <input
            type="date"
            name="dataInicio"
            value={formData.dataInicio}
            onChange={handleChange}
          />

          <label>É Gestor?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="role"
                value="GESTOR"
                checked={formData.role === 'GESTOR'}
                onChange={handleChange}
              />
              Sim
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="COLABORADOR"
                checked={formData.role === 'COLABORADOR'}
                onChange={handleChange}
              />
              Não
            </label>
          </div>

          {/* Gestor responsável — só aparece se for COLABORADOR */}
          {formData.role === 'COLABORADOR' && (
            <>
              <label>Gestor Responsável</label>
              <select
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
              >
                <option value="">Selecione um gestor (opcional)</option>
                {gestores.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </>
          )}

          {errorMsg && <p className="form-error">{errorMsg}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : isEdicao ? 'Salvar Alterações' : 'Cadastrar'}
          </button>
          <button type="button" onClick={fechar} className="btn-cancelar">
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}