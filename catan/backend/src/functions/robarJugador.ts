import { mezclar } from "../common/mezclar.js";
import { Jugador } from "../schemas/Jugador.js";

export function robarJugador(
    jugadorReceptor: Jugador,
    jugadorRobado: Jugador
){
    //* Copia de las llaves de los recursos del jugador robado y mezcla de las mismas
    const recursos = Array.from(jugadorRobado.recursos.keys());
    mezclar(recursos);
    
    //* Para cada key del jugador, si alguna llega a tener un valor mayor a 0
    for(const recurso of recursos){
        if(jugadorRobado.recursos.get(recurso) > 0){
            //* El jugador robado pierde 1 copia del recurso
            jugadorRobado.recursos.set(
                recurso,
                jugadorRobado.recursos.get(recurso) - 1
            );

            //* El jugador receptor gana 1 copia del recurso
            jugadorReceptor.recursos.set(
                recurso,
                jugadorReceptor.recursos.get(recurso) + 1
            );

            break;
        }
    }
}