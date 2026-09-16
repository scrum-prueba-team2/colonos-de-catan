import { MapSchema } from "@colyseus/schema";
import { Vertice } from "../schemas/Vertices.js";
import { Hexagono } from "../schemas/Hexagono.js";

export function verticesDelHexagono(
    vertices: MapSchema<Vertice>,
    hexagono: Hexagono
): Vertice [] {
    //* Arreglo de vertices encontrados para un hexagono
    const verticesEncontrados: Vertice[] = [];

    //* Sacamos las keys de los vertices involucrados en base al hexagono
    const keys = [
        `${hexagono.h},${hexagono.d},0`,
        `${hexagono.h},${hexagono.d},1`,
        `${hexagono.h - 1},${hexagono.d + 1},0`,
        `${hexagono.h},${hexagono.d + 1},1`,
        `${hexagono.h},${hexagono.d + 1},0`,
        `${hexagono.h + 1},${hexagono.d},1`
    ];

    //* Si existe el vertice se agrega al arreglo
    keys.forEach((key) =>{
        const vertice = vertices.get(key);
        if(vertice) verticesEncontrados.push(vertice);
    })
    return verticesEncontrados;
}