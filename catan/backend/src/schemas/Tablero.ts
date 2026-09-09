import { MapSchema, Schema, type } from "@colyseus/schema";
import { Hexagono } from "./Hexagono.js";
import { Vertice } from "./Vertices.js";

export class Tablero extends Schema{
    @type({ map : Hexagono})
    hexagonos = new MapSchema<Hexagono>;
    
    @type({ map : Vertice})
    vertices = new MapSchema<Vertice>();

}