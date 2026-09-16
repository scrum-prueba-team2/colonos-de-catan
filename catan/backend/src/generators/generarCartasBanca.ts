import { ArraySchema } from "@colyseus/schema";
import { Desarrollo } from "../common/enums.js";
import { mezclar } from "../common/mezclar.js";

export function generarCartasBanca(
    cartas: ArraySchema<Desarrollo>
){
    const baraja = mezclar([
        Desarrollo.CABALLERO, Desarrollo.CABALLERO, Desarrollo.CABALLERO,
        Desarrollo.CABALLERO, Desarrollo.CABALLERO, Desarrollo.CABALLERO,
        Desarrollo.CABALLERO, Desarrollo.CABALLERO, Desarrollo.CABALLERO,
        Desarrollo.CABALLERO, Desarrollo.CABALLERO, Desarrollo.CABALLERO,
        Desarrollo.CABALLERO, Desarrollo.CABALLERO,
        Desarrollo.PUNTOS_VICTORIA, Desarrollo.PUNTOS_VICTORIA, Desarrollo.PUNTOS_VICTORIA,
        Desarrollo.PUNTOS_VICTORIA, Desarrollo.PUNTOS_VICTORIA,
        Desarrollo.CARRETERA, Desarrollo.CARRETERA,
        Desarrollo.ABUNDANCIA, Desarrollo.ABUNDANCIA,
        Desarrollo.MONOPOLIO, Desarrollo.MONOPOLIO
    ])

    baraja.forEach((carta: Desarrollo) => {
        cartas.push(carta);
    })
}