import { Schema, type } from "@colyseus/schema"

export class Jugador extends Schema{
    @type("uint16") puntuacion: number = 0;
}