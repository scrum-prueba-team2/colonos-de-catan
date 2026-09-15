import { Terreno } from "./enums.js";


export function recursoTexto(terreno: Terreno){
    switch (terreno) {
        case Terreno.DESIERTO:
            return "desierto";
        case Terreno.MADERA:
            return "madera";
        case Terreno.TRIGO:
            return "trigo";
        case Terreno.LANA:
            return "lana";
        case Terreno.LADRILLO:
            return "ladrillo";
        case Terreno.MINERAL:
            return "mineral";
        default:
            return "desconocido";
    }
}