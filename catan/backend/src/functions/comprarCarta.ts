import { Desarrollo } from "../common/enums.js";
import { Jugador } from "../schemas/Jugador.js";
import { Banca } from "../schemas/Banca.js";

export function comprarCarta(jugador: Jugador, banca: Banca): {
    error: boolean,
    mensaje: string
} {
    //* verificar que la banca tenga cartas disponibles
    if (banca.cartas.length === 0) {
        return {
            error: true,
            mensaje: "La banca no tiene cartas disponibles"
        };
    }

    //* verificar que el jugador tenga recursos suficientes para comprar la carta
    if (!comprobarRecursos(jugador)) {
        return {
            error: true,
            mensaje: "No tienes recursos suficientes para comprar una carta"
        };
    }

    //* colocar la carta en el jugador y sacarla de la banca
    sacarCarta(jugador, banca);

    //* Intercambio de recursos
    eliminarRecursos(jugador, banca);

    return {
        error: false,
        mensaje: "Carta comprada con éxito"
    };
}

function comprobarRecursos(jugador: Jugador): boolean {
    if (jugador.recursos.get("trigo") < 1) return false;
    if (jugador.recursos.get("lana") < 1) return false;
    if (jugador.recursos.get("mineral") < 1) return false;
    return true;
}

function sacarCarta(jugador: Jugador, banca: Banca): void {
    //* sacar la carta de la banca
    const carta = banca.cartas.shift();

    //? CARTA DE PUNTOS DE VICTORIA
    if (carta === Desarrollo.PUNTOS_VICTORIA) {
        jugador.puntosParaGanar -= 1;
    }

    //* agregar la carta al jugador
    jugador.cartas_inusables.set(`${carta}`, (jugador.cartas_inusables.get(`${carta}`)) + 1);
}

function eliminarRecursos(jugador: Jugador, banca: Banca): void {
    jugador.recursos.set("trigo", jugador.recursos.get("trigo") - 1);
    jugador.recursos.set("lana", jugador.recursos.get("lana") - 1);
    jugador.recursos.set("mineral", jugador.recursos.get("mineral") - 1);

    banca.recursos.set("trigo", banca.recursos.get("trigo") + 1);
    banca.recursos.set("lana", banca.recursos.get("lana") + 1);
    banca.recursos.set("mineral", banca.recursos.get("mineral") + 1);
}

