import { MapSchema } from "@colyseus/schema";
import { CartasDesarrollo } from "../common/enums.js";

export function generarCartas(cartas: MapSchema<number>){

    cartas.set(`${CartasDesarrollo.CABALLERO}`, 0);
    cartas.set(`${CartasDesarrollo.PUNTOS_VICTORIA}`, 0);
    cartas.set(`${CartasDesarrollo.CARRETERAS}`, 0);
    cartas.set(`${CartasDesarrollo.ABUNDANCIA}`, 0);
    cartas.set(`${CartasDesarrollo.MONOPOLIO}`, 0);
}