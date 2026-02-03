// src/components/Home/HomeDashboard.jsx

import React from 'react';
import { Link } from "react-router-dom"; 
import './Dashboard.css'


const courseData = [
  { id: 1, title: 'Matemática I', professor: 'Prof. Ana Silva', route: '/app/curso/mat1' },
  { id: 2, title: 'Desenvolvimento Web', professor: 'Prof. João Santos', route: '/app/curso/devweb' },
  { id: 3, title: 'Design Gráfico', professor: 'Prof. Carla Mendes', route: '/app/curso/design' },
];

const CourseCard = ({ title, professor, route }) => (
    <Link to={route} className="bloco-curso-link"> 
        <div className="bloco-curso">
            <h3>{title}</h3>
            <p className="curso-professor">{professor}</p>
            <div className="curso-rodape">
                <i className="fas fa-folder-open"></i>
                <i className="fas fa-users"></i>
            </div>
        </div>
    </Link>
);

export function Dashboard () {

    return(
        <> 
            <h2>Adaptação</h2>
            
        
            <div className="bloco-atividades">
              
                <div className="atividade-item">
                    <p className="atividade-titulo">Treinamento do setor de Desenvolvimento de Software</p>

                </div>
                <div className="atividade-item">
                    <p className="atividade-titulo">Tarefas Atribuidas</p>

                </div>
            </div>

            <h2 className="cursos-titulo">Conteudos disponíveis</h2>

            <div className="blocos-cursos">
                {courseData.map((course) => (
                    <CourseCard 
                        key={course.id} 
                        title={course.title} 
                        professor={course.professor} 
                        route={course.route}
                    />
                ))}
            </div>
        </> 
    )
}