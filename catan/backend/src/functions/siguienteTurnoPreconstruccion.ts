import { FaseJuego, FasePartida } from "../common/enums.js";
import { Partida } from "../schemas/Partida.js";

export function siguienteTurnoPreconstruccion(partida: Partida) {
    // * Indice del jugador actual en la partida
    const indiceActual = partida.ordenJugadores.indexOf(partida.turnoActual);
    // * Indice del último jugador en la partida
    const ultimoIndice = partida.ordenJugadores.length - 1;

    if(partida.direccionPreconstruccion === 0) {

        if(indiceActual === ultimoIndice){
            // * Si llegamos al último vamos de regreso
            partida.direccionPreconstruccion = -1;
            return;
        }
        partida.turnoActual = partida.ordenJugadores[indiceActual + 1];

    } else {
        
        if(indiceActual === 0){
            // * Al regresar al inicio, comienza el juego
            partida.fase = FasePartida.JUEGO;
            // * La fase del juego comienza en DADOS    
            partida.faseJuego = FaseJuego.DADOS;
            return;
        }
        partida.turnoActual = partida.ordenJugadores[indiceActual - 1];
    }
}