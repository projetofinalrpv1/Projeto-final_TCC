import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AbaPrincipal } from './components/Home/AbaPrincipal';
import { Login } from './components/AbaLogin/Login';
import { Tarefas } from './components/AbaTarefas/Tarefas';
function App() {
 return(
  <>
   <Router>
        <Routes>
          <Route path="/" element={<AbaPrincipal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tarefas" element={<Tarefas />} />
        </Routes>
      </Router>

  </>
 )
  
}

export  {App};