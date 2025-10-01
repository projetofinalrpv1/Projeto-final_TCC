import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AbaPrincipal } from './components/Home/AbaPrincipal';
import { Gestor } from './components/AbaGestor/Gestor';
import { Tarefas } from './components/AbaTarefas/Tarefas';
function App() {
 return(
  <>
   <Router>
        <Routes>
          <Route path="/" element={<AbaPrincipal />} />
          <Route path="/gestor" element={<Gestor />} />
          <Route path="/tarefas" element={<Tarefas />} />
        </Routes>
      </Router>

  </>
 )
  
}

export  {App};