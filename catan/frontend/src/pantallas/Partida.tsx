import {
  jugadoresPrueba, ordenJugadoresPrueba, turnoActualPrueba, miSessionIdPrueba,
} from '../datos/jugadoresPrueba';
import InfoJugadores from '../componentes/infoJugadores';

import { bancaPrueba } from '../datos/bancaPruebas';
import Existencias from '../componentes/existencias';
import { tableroPrueba } from '../datos/tableroPrueba'
import TablaCostes from '../componentes/tablaCostes';
import Tablero from '../componentes/tablero';

import './Partida.css'

// Pantalla principar de la partida. Contiene todos los componentes de la partida.
function Partida() {

  return (
    <div className="marcoPartida">
        <div className="salir"> 
            <button className="btnSalida">Salir</button>
        </div>
        <div className="tabCostos">
            <TablaCostes />
        </div>
        <div className="chat">
          area de chat
        </div>
        <div className="construir">
          area de construccion
        </div>
        <div className="infoJugadores">
          <InfoJugadores
            jugadores={jugadoresPrueba}
            ordenJugadores={ordenJugadoresPrueba}
            turnoActual={turnoActualPrueba}
            miSessionId={miSessionIdPrueba}
          />
        </div>
        <div className="infoPartida">
            area de informacion de partida
        </div>
        <div className="tablero">
          <Tablero
            datos={tableroPrueba}
          />
        </div>
        <div className="carRecursos">
          area de cartas de recursos
        </div>
        <div className="carDesarrollo">
          area de cartas de desarollo
        </div>
        <div className="carEspeciales">
          area de cartas especiales 
        </div>
        <div className="negociar">
            area de negociar   
        </div>
        <div className="tirDado">
          area de tirar dado
        </div>
        <div className="finTurno">
          area de finaliszar turno
        </div>
        <div className="existencias">
          <Existencias
            banca={bancaPrueba}
            miJugador={jugadoresPrueba[miSessionIdPrueba]}
          />
        </div>
    </div>
  );
}

export default Partida;