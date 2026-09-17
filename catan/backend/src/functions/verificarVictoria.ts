import { FasePartida } from "../common/enums.js";
import { Jugador } from "../schemas/Jugador.js";
import { Partida } from "../schemas/Partida.js";

export function verificarVictoria(
    partida: Partida,
    jugador: Jugador,
    sessionId: string
){
    if(jugador.puntosParaGanar <=0){
        partida.ganador = sessionId;
        partida.fase = FasePartida.FINALIZADA
    }
}