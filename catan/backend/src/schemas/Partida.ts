import { ArraySchema, Schema, type } from "@colyseus/schema";
import { FaseJuego, FasePartida, FasePreconstruccion } from "../common/enums.js";
import { Jugador } from "./Jugador.js";

export class Partida extends Schema {
  @type("string") creador: string;
  @type("uint8") fase: FasePartida;
  @type("uint8") fasePreconstruccion: FasePreconstruccion;
  @type("uint8") direccionPreconstruccion: number;
  @type("uint8") faseJuego: FaseJuego;
  @type("string") turnoActual: string;
  @type(["string"]) ordenJugadores = new ArraySchema<string>();
  @type("string") ganador: string;
  @type("string") ejercitoMasGrande: string;

  constructor() {
    super();
    this.creador = "";
    this.fase = FasePartida.LOBBY;
    this.turnoActual = "";
    this.cartaJugable = false;
    this.fasePreconstruccion = FasePreconstruccion.ASENTAMIENTO;
    this.direccionPreconstruccion = 1;
    this.faseJuego = FaseJuego.DADOS;
    this.ganador = "";
    this.ejercitoMasGrande = "";
  }
}