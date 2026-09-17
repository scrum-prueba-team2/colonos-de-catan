import { useState } from 'react'
import './App.css'
import Home from './pantallas/Home/Home'
import ElegirModo from './pantallas/ElegirModo/ElegirModo'
import Lobby from './pantallas/Lobby/Lobby'
// import Partida from './pantallas/Partida'

type Pantalla = 'home' | 'elegirModo' | 'lobby' | 'partida'

function App() {
  const [pantalla, setPantalla] = useState<Pantalla>('home')

  return (
    <>
      {pantalla === 'home' && (
        <Home onAbrirMenu={() => setPantalla('elegirModo')} />
      )}

      {pantalla === 'elegirModo' && (
        <ElegirModo
          onCrear={() => {
            // TODO: crear sala cuando exista backend
            setPantalla('partida')
          }}
          onUnirse={() => setPantalla('lobby')}
          onVolver={() => setPantalla('home')}
        />
      )}

      {pantalla === 'lobby' && (
        <Lobby
          onCrearSala={() => {
            // TODO: crear sala cuando exista backend
            setPantalla('partida')
          }}
          onUnirseASala={(codigo) => {
            // TODO: validar código contra el backend
            console.log('Unirse a la sala:', codigo)
            setPantalla('partida')
          }}
          onVolver={() => setPantalla('elegirModo')}
        />
      )}

      {pantalla === 'partida' && (
        <div style={{ padding: 24 }}>
          {/* <Partida /> */}
          Pantalla de partida (pendiente de conectar)
        </div>
      )}
    </>
  )
}

export default App
