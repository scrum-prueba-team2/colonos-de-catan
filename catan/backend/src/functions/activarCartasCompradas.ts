import { Desarrollo } from "../common/enums.js";
import { Jugador } from "../schemas/Jugador.js";

export function activarCartasCompradas(
    jugador: Jugador
) {
    jugador.cartas_inusables.forEach((cantidad, carta) => {

        //? CARTA DE PUNTOS DE VICTORIA
        if (carta === `${Desarrollo.PUNTOS_VICTORIA}`) return;

        /** Pasar las cartas a usables */
        jugador.cartas_usables.set(
            carta,
            jugador.cartas_usables.get(carta) + cantidad
        )

        /** Limpiar las cartas inusables */
        jugador.cartas_inusables.set(carta, 0)

    })
}