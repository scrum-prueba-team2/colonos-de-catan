import { Schema, type } from "@colyseus/schema";


export class Coordenada extends Schema{
    @type("int8") h: number;
    @type("int8") d: number;

    constructor(h: number, d: number){
        super();
        this.h = h;
        this.d = d;
    }
}