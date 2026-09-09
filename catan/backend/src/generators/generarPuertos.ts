import { MapSchema } from "@colyseus/schema";
import { TipoPuerto } from "../common/enums.js";
import { Puerto } from "../schemas/Puertos.js";
import { coordenadasPuertos } from "../common/tablero.js";
import { mezclar } from "../common/mezclar.js";

export function generarPuertos(
    puertos: MapSchema<Puerto>
){
    const tipoPuertos = mezclar([
        TipoPuerto.GENERICO, TipoPuerto.GENERICO,
        TipoPuerto.GENERICO, TipoPuerto.GENERICO,
        TipoPuerto.MADERA, TipoPuerto.TRIGO,
        TipoPuerto.LANA, TipoPuerto.LADRILLO,
        TipoPuerto.MINERAL
    ]);

    coordenadasPuertos.forEach((puerto, i) => {
        const nuevoPuerto = new Puerto(puerto.id, tipoPuertos[i], puerto.vertices[0], puerto.vertices[1]);
        puertos.set(`${puerto.id}`, nuevoPuerto);
    })
}