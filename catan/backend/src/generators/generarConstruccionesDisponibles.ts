import { MapSchema } from "@colyseus/schema";
import { Construccion } from "../common/enums.js";

export function generarConstruccionesDisponibles(construccionesDisponibles: MapSchema<number>){
    construccionesDisponibles.set(`${Construccion.ASENTAMIENTO}`, 5);
    construccionesDisponibles.set(`${Construccion.CIUDAD}`, 4);
    construccionesDisponibles.set(`${Construccion.CAMINO}`, 15);
}