import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {App} from './App.jsx'

import "./assets/styles/variables.css";
import "./assets/styles/global.css";
const tema = localStorage.getItem('@App:tema') || 'light';
document.documentElement.setAttribute('data-theme', tema);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
