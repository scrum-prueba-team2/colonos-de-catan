import { ArraySchema, MapSchema, Schema, type } from "@colyseus/schema";
import { Desarrollo } from "../common/enums.js";
import { generarRecursosBanca } from "../generators/generarRecursosBanca.js";
import { generarCartasBanca } from "../generators/generarCartasBanca.js";


export class Banca extends Schema {
    @type({ map: "uint8"})
    recursos = new MapSchema<number>();

    @type(["uint8"])
    cartas = new ArraySchema<Desarrollo>();

    constructor() {
        super();
        generarRecursosBanca(this.recursos);
        generarCartasBanca(this.cartas);
    }
}