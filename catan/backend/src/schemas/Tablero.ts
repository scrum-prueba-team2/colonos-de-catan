import { MapSchema, Schema, type } from "@colyseus/schema";
import { Hexagono } from "./Hexagono.js";

export class Tablero extends Schema{
    @type({ map : Hexagono})
    hexagonos = new MapSchema<Hexagono>;
    
}