import { MapSchema } from "@colyseus/schema";
import { Arista } from "../schemas/Arista.js";
import { coordenadasHexagono } from "../common/tablero.js";

export function generarAristas ( aristas: MapSchema<Arista>){
    
    coordenadasHexagono.forEach((item) => {
        const arista1 = new Arista(item[0], item[1], 0);
        const arista2 = new Arista(item[0], item[1], 1);
        const arista3 = new Arista(item[0], item[1], 2);
        const arista4 = new Arista(item[0]-1, item[1]+1, 0 );
        const arista5 = new Arista(item[0], item[1]+1, 1 );
        const arista6 = new Arista(item[0]+1, item[1], 2);

        aristas.set(`${item[0]},${item[1]},0`, arista1);
        aristas.set(`${item[0]},${item[1]},1`, arista2);
        aristas.set(`${item[0]},${item[1]},2`, arista3);
        aristas.set(`${item[0]-1},${item[1]+1},0`, arista4);
        aristas.set(`${item[0]},${item[1]+1},1`, arista5);
        aristas.set(`${item[0]+1},${item[1]},2`, arista6);
    })
}