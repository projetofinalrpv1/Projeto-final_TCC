import { useState } from "react";
import "./Form.css";

export default function Form({ fechar, adicionarUsuario }) {

  const [formData, setFormData] = useState({
    nome: "",
    setor: "",
    dataInicio: "",
    gestor: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    adicionarUsuario(formData);  
    fechar(); // fecha o modal
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <h2>Cadastro de Plataforma</h2>

        <label>Nome</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <label>Setor</label>
        <input
          type="text"
          name="setor"
          value={formData.setor}
          onChange={handleChange}
          required
        />

        <label>Data de Início do Treinamento</label>
        <input
          type="date"
          name="dataInicio"
          value={formData.dataInicio}
          onChange={handleChange}
          required
        />

        <div className="gestor-toggle">
          <label>É Gestor?</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="gestor"
                value="true"
                checked={formData.gestor === true}
                onChange={() => setFormData({ ...formData, gestor: true })}
              />
              Sim
            </label>

            <label>
              <input
                type="radio"
                name="gestor"
                value="false"
                checked={formData.gestor === false}
                onChange={() => setFormData({ ...formData, gestor: false })}
              />
              Não
            </label>
          </div>
        </div>

        <button type="submit">Cadastrar</button>
        <button type="button" onClick={fechar} className="btn-cancelar">Cancelar</button>

      </form>
    </div>
  );
}