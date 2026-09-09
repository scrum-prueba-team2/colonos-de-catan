import { Schema, type } from "@colyseus/schema";

export class Arista extends Schema{

    @type("int8")h: number;
    @type("int8")d: number;
    @type("uint8")p: number;
    @type("string")propietario: string

    constructor(h: number, d: number, p: number){
        super()
        this.h = h;
        this.d = d;
        this.p = p;
        this.propietario = "";
    }
    
    setPropietario(propietario: string){
        this.propietario = propietario;
    }
}