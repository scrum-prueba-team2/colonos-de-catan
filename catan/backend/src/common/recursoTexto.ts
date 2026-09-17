import { Terreno, TipoPuerto } from "./enums.js";


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

export function recursoTipoPuerto(recurso: string): TipoPuerto{
    switch(recurso){
        case "madera": return TipoPuerto.MADERA;
        case "trigo": return TipoPuerto.TRIGO;
        case "lana": return TipoPuerto.LANA;
        case "ladrillo": return TipoPuerto.LADRILLO;
        case "mineral": return TipoPuerto.MINERAL;
        default: return TipoPuerto.GENERICO;
    }
}