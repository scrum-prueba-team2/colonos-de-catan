import { tableroPrueba } from '../datos/tableroPrueba'
import { jugadoresPrueba } from '../datos/jugadoresPrueba';
import TablaCostes from '../componentes/tablaCostes';
import Tablero from '../componentes/tablero';
import InfoJugador from '../componentes/infoJugador';

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
        <div className="informacion"> 
            <div className="infoJugadores">
                {jugadoresPrueba.map((j) => (
                  <InfoJugador key={j.nombre} jugador={j} />
                ))}
            </div>
            <div className="infoPartida">
                area de informacion de partida
            </div>
        </div>
        <div className="tablero">
          <Tablero
            datos={tableroPrueba}
          />
        </div>
        <div className="cartas"> 
            <div className="carRecursos">
              area de cartas de recursos
            </div>
            <div className="carDesarrollo">
              area de cartas de desarollo
            </div>
            <div className="carEspeciales">
              area de cartas especiales 
            </div>
        </div>
        <div className="acciones"> 
          <div className="negociar">
            area de negociar   
          </div>
          <div className="tirDado">
            area de tirar dado
          </div>
          <div className="finTurno">
            area de finaliszar turno
          </div>
        </div>
    </div>
  );
}

export default Partida;