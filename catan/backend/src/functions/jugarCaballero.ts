import { MapSchema } from "@colyseus/schema";
import { Jugador } from "../schemas/Jugador.js";
import { Desarrollo } from "../common/enums.js";
import { Partida } from "../schemas/Partida.js";

export function jugarCaballero(
    jugadores: MapSchema<Jugador>,
    sessionId: string,
    partida: Partida
){
    //* Eliminar carta de caballero del jugador
    const jugador = jugadores.get(sessionId);
    jugador.cartas_usables.set(
        `${Desarrollo.CABALLERO}`,
        jugador.cartas_usables.get(`${Desarrollo.CABALLERO}`)  + 1
    );

    //* Aumentar el conteo de caballeros jugados por el jugaodr

    jugador.caballerosJugados ++;

    //* Verificar si el jugador ya jugo 3 caballeros o mas
    if(jugador.caballerosJugados < 3) return;

    const jugadorMayorEjercito = jugadores.get(partida.ejercitoMasGrande);

    //* Si no hay nadie con el puesot, se otorga directamente
    if(!jugadorMayorEjercito){
        partida.ejercitoMasGrande = sessionId;
        jugador.puntuacion += 2;
        jugador.puntosParaGanar -= 2;
        return;
    }

    //* Verificar que sea el mayor
    if(jugador.caballerosJugados > jugadorMayorEjercito.caballerosJugados){
        //* Quitar los 2 puntos del actual
        jugadorMayorEjercito.puntuacion -= 2;
        jugadorMayorEjercito.puntosParaGanar += 2;

        //* Dar 2 puntos al nuevo
        jugador.puntuacion += 2;
        jugador.puntosParaGanar -+ 2;
        //* Asignarlo en la partida como el duenio del ejercito mas grande
        partida.ejercitoMasGrande = sessionId;
    }



}