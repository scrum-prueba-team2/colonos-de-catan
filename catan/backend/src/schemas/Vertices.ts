import { Schema, type } from "@colyseus/schema";
import { Construccion } from "../common/enums.js"

export class Vertice extends Schema {
    @type("int8") h: number;
    @type("int8") d: number;
    @type("uint8") p: number;
    @type("uint8") constuccion: Construccion;
    @type("string") propietario: string;

    constructor(h: number, d: number, p: number){
        super();
        this.h = h;
        this.d = d;
        this.p = p;
        this.constuccion = Construccion.VACIO;
        this.propietario = "";
    }

    setConstruccion(construccion: Construccion){
        this.constuccion = construccion;
    }

    setPropietario(propietario: string){
        this.propietario = propietario;
    }
}