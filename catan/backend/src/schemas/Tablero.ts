import { MapSchema, Schema, type } from "@colyseus/schema";
import { Hexagono } from "./Hexagono.js";
import { Arista } from "./Arista.js";
import { Vertice } from "./Vertices.js";
import { Puerto } from "./Puertos.js";


export class Tablero extends Schema{
    @type({ map : Hexagono})
    hexagonos = new MapSchema<Hexagono>;
    
    @type({ map : Vertice})
    vertices = new MapSchema<Vertice>();

    @type({ map: Arista })
    aristas = new MapSchema<Arista>;

    @type({ map: Puerto })
    puertos = new MapSchema<Puerto>();

}