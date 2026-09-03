import { useNavigation } from '../navegacion';
import './Partida.css';

function Partida() {
  const { navegarA } = useNavigation();

  return (
    <div class="marcoPartida">
        <div class="salir"> salir </div>
        <div class="tabCostos"> costos </div>
        <div class="chat"> chat </div>
        <div class="construir"> construir </div>
        <div class="informacion"> 
            <div class="infoJugadores"> Jugadores </div>
            <div class="infopartida"> Partida </div>
        </div>
        <div class="tablero"> tablero </div>
        <div class="cartas"> 
            <div class="carRecursos"> cartas de recursos </div>
            <div class="carDesarrollo"> cartas de desarrollo </div>
            <div class="carEspeciales"> cartas especiales </div>
        </div>
        <div class="acciones"> 
            <div class="negociar"> negociar </div>
            <div class="tirDado"> tirar dado </div>
            <div class="finTurno"> finalizar turno </div>
        </div>
    </div>
  );
}

export default Partida;