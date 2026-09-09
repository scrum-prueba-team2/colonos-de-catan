import { MapSchema } from "@colyseus/schema";
import { Vertice } from "../schemas/Vertices.js";
import { coordenadasHexagono } from "../common/tablero.js";

export function generarVertices(
    vertices: MapSchema<Vertice>,
){
    coordenadasHexagono.forEach(([h,d]) => {
        const vertice1 = new Vertice(h, d, 0);
        const vertice2 = new Vertice(h, d, 1);
        const vertice3 = new Vertice(h-1, d+1, 0);
        const vertice4 = new Vertice(h, d+1, 1);
        const vertice5 = new Vertice(h, d+1, 0);
        const vertice6 = new Vertice(h+1, d, 1);
        vertices.set(`${h}, ${d}, 0`, vertice1);
        vertices.set(`${h}, ${d}, 1`, vertice2);
        vertices.set(`${h-1}, ${d+1}, 0`, vertice3);
        vertices.set(`${h}, ${d+1}, 1`, vertice4);
        vertices.set(`${h}, ${d+1}, 0`, vertice5);
        vertices.set(`${h+1}, ${d}, 1`, vertice6);
    })
}