import { MapSchema, Schema, type } from "@colyseus/schema"
import { Terreno } from "../common/enums.js";
import { generarRecursos } from "../generators/generarRecursos.js";
import { generarCartas } from "../generators/generarCartas.js";
import { generarConstruccionesDisponibles } from "../generators/generarConstruccionesDisponibles.js";

export class Jugador extends Schema{
    @type("string") nombre: string;
    @type("uint16") puntuacion: number;
    @type("uint16") puntosParaGanar: number;
    @type( {map:"uint8"}) recursos = new MapSchema<number>();
    @type({map:"uint8"}) cartas = new MapSchema<number>();
    @type({map:"uint8"}) construccionesDisponibles =new MapSchema<number>();
    @type("string") ultimoAsentamiento: string;

    constructor(nombre: string = "") {
        super();
        this.nombre = nombre;
        this.puntuacion = 0;
        this.puntosParaGanar = 10;
        this.ultimoAsentamiento = "";
        generarRecursos(this.recursos);
        generarCartas(this.cartas);
        generarConstruccionesDisponibles(this.construccionesDisponibles);
    }
}