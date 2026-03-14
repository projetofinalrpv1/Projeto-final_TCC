// src/components/Home/HomeDashboard.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

/* ======================================================
   DADOS MOCKADOS ANTIGOS (REMOVIDOS)
   AGORA OS MATERIAIS VÊM DO BACKEND
====================================================== */

// const initialCourses = [
//   {
//     id: 1,
//     title: "Arquitetura de Software",
//     professor: "Liderança Técnica",
//     route: "/app/curso/arq",
//   },
//   {
//     id: 2,
//     title: "Práticas em Desenvolvimento",
//     professor: "Equipe de Engenharia",
//     route: "/app/curso/dev",
//   },
//   {
//     id: 3,
//     title: "Segurança e Governança de TI",
//     professor: "Time de Infraestrutura",
//     route: "/app/curso/seguranca",
//   },
// ];

const CourseCard = ({ id, title, professor, route }) => (
  <div className="bloco-curso-wrapper">
    <Link to={route || "#"} className="bloco-curso-link">
      <div className="bloco-curso">
        <div className="bloco-curso-topo" />

        <div className="bloco-curso-conteudo">
          <h3>{title}</h3>
          <p className="curso-professor">{professor}</p>
        </div>

        <div className="curso-rodape">
          <span className="tag-conteudo">Material Estratégico</span>
        </div>
      </div>
    </Link>
  </div>
);

export function Dashboard() {

  /* =============================
     STATE DOS MATERIAIS
  ============================== */

  // antes:
  // const [courses, setCourses] = useState(initialCourses);

  const [courses, setCourses] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [novoConteudo, setNovoConteudo] = useState({
    titulo: "",
    tipo: "pdf",
    arquivo: null,
  });

  /* =============================
     BUSCAR MATERIAIS NO BACKEND
  ============================== */

  useEffect(() => {

    const fetchMaterials = async () => {

      try {

        const workAreaId = localStorage.getItem("workAreaId");

        const response = await axios.get(
          `http://localhost:3333/materials/${workAreaId}`
        );

        setCourses(response.data);

      } catch (error) {

        console.error("Erro ao buscar materiais:", error);

      }

    };

    fetchMaterials();

  }, []);

  /* =============================
     SALVAR MATERIAL NO BACKEND
  ============================== */

  const adicionarConteudo = async () => {

    if (!novoConteudo.titulo) return;

    try {

      const workAreaId = localStorage.getItem("workAreaId");
      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://localhost:3333/materials",
        {
          titulo: novoConteudo.titulo,
          gestor: "Gestor da Área",
          descricao: "Material enviado pela plataforma",
          arquivoUrl: "https://drive.google.com",
          workAreaId: workAreaId,
          rota: "#"
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setCourses([...courses, response.data]);

      setMostrarModal(false);

      setNovoConteudo({
        titulo: "",
        tipo: "pdf",
        arquivo: null,
      });

    } catch (error) {

      console.error("Erro ao salvar material:", error);

    }

  };

  return (

    <div className="conteudo-pagina">

      <h2 className="titulo-secao">Adaptação</h2>

      <div className="bloco-atividades">

        <div className="atividade-item">
          <p className="atividade-titulo">
            Programa de integração - Engenharia de Software
          </p>
        </div>

        <div className="atividade-item">
          <p className="atividade-titulo">
            Demandas técnicas atribuídas
          </p>
        </div>

      </div>

      <div className="topo-conteudos">

        <h2 className="titulo-secao">
          Conteúdos recomendados
        </h2>

        <button
          className="botao-primario"
          onClick={() => setMostrarModal(true)}
        >
          + Adicionar conteúdo
        </button>

      </div>

      <p className="cursos-subtitulo">
        Materiais estratégicos voltados para desenvolvimento e tecnologia
      </p>

      <div className="blocos-cursos">

        {courses.map((course) => (

          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            professor={course.manager}
            route={course.route}
          />

        ))}

      </div>

      {mostrarModal && (

        <div className="modal-overlay">

          <div className="modal-container">

            <h3 className="modal-titulo">
              Novo Conteúdo Técnico
            </h3>

            <input
              type="text"
              placeholder="Título do material"
              value={novoConteudo.titulo}
              onChange={(e) =>
                setNovoConteudo({
                  ...novoConteudo,
                  titulo: e.target.value,
                })
              }
              className="modal-input"
            />

            <select
              value={novoConteudo.tipo}
              onChange={(e) =>
                setNovoConteudo({
                  ...novoConteudo,
                  tipo: e.target.value,
                })
              }
              className="modal-input"
            >
              <option value="pdf">PDF</option>
              <option value="video">Vídeo</option>
            </select>

            <input
              type="file"
              accept={
                novoConteudo.tipo === "pdf"
                  ? ".pdf"
                  : "video/*"
              }
              onChange={(e) =>
                setNovoConteudo({
                  ...novoConteudo,
                  arquivo: e.target.files[0],
                })
              }
              className="modal-file"
            />

            <div className="modal-botoes">

              <button
                className="botao-secundario"
                onClick={() => setMostrarModal(false)}
              >
                Cancelar
              </button>

              <button
                className="botao-primario"
                onClick={adicionarConteudo}
              >
                Salvar
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}
