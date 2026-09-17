import { ArraySchema, Schema, type } from "@colyseus/schema";
import { FaseJuego, FasePartida, FasePreconstruccion } from "../common/enums.js";

export class Partida extends Schema{
  @type("string") creador: string; 
  @type("uint8") fase: FasePartida;
  @type("uint8") fasePreconstruccion: FasePreconstruccion;
  @type("uint8") direccionPreconstruccion: number;
  @type("uint8") faseJuego: FaseJuego;
  @type("string") turnoActual: string;
  @type(["string"]) ordenJugadores = new ArraySchema<string>();
  
  constructor(){
    super();
    this.creador = "";
    this.fase = FasePartida.LOBBY;
    this.turnoActual = "";
    this.faseJuego = FaseJuego.DADOS;
  }
}