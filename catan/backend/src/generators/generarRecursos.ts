import { MapSchema } from "@colyseus/schema";

export function generarRecursos (recursos: MapSchema<number>){
     
    recursos.set('madera', 0);
    recursos.set('trigo', 0);
    recursos.set('lana', 0);
    recursos.set('ladrillo', 0);
    recursos.set('mineral', 0);
}