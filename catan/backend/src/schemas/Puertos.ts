import { Schema, type } from "@colyseus/schema"
import { TipoPuerto } from "../common/enums.js";

export class Puerto extends Schema {
    @type("uint8") id: number;
    @type("uint8") tipo: TipoPuerto;
    @type("string") vertice1: string;
    @type("string") vertice2: string;

    constructor(id: number, tipo: TipoPuerto, vertice1: string, vertice2: string) {
        super();
        this.id = id;
        this.tipo = tipo;
        this.vertice1 = vertice1;
        this.vertice2 = vertice2;
    }

    setTipo(tipo: TipoPuerto) {
        this.tipo = tipo;
    }
}