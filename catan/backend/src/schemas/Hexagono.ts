import { Schema, type } from "@colyseus/schema";
import { Terreno } from "../common/enums.js";

export class Hexagono extends Schema {
    @type("int8") h: number;
    @type("int8") d: number;
    @type("uint8") terreno:  Terreno;
    @type("uint8") numero: number;
    @type("boolean") esLadron: boolean

    constructor(h: number, d: number, terreno: Terreno, numero: number){
        super();
        this.h = h;
        this.d = d;
        this.terreno = terreno;
        this.numero = numero;
        this.esLadron = this.terreno === Terreno.DESIERTO;
    }

    setEsLadro(value: boolean){
        this.esLadron = value;
    }
}
