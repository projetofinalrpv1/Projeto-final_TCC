// src/components/Home/HomeDashboard.jsx

import React from 'react';
import { Link } from "react-router-dom"; 



const courseData = [
    { id: 1, title: 'Matemática I', professor: 'Prof. Ana Silva', route: '/h/curso/mat1' },
    { id: 2, title: 'Desenvolvimento Web', professor: 'Prof. João Santos', route: '/h/curso/devweb' },
    { id: 3, title: 'Design Gráfico', professor: 'Prof. Carla Mendes', route: '/h/curso/design' },
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

export function HomeDashboard () {

    return(
        <> 
            <h2>Próximas Atividades</h2>
            
        
            <div className="bloco-atividades">
              
                <div className="atividade-item">
                    <p className="atividade-titulo">Tarefa: Análise de Dados</p>

                </div>
                <div className="atividade-item">
                    <p className="atividade-titulo">Quiz: Estruturas de Repetição</p>

                </div>
            </div>

            <h2 className="cursos-titulo">Meus Cursos</h2>

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