import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Tema de las pantallas previas a la partida. Va antes que App para que el
// CSS de cada pantalla (que se carga después) pueda ajustarlo.
import './pantallas/tema.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
