import { Schema, type } from "@colyseus/schema";
import { FaseJuego, FasePartida } from "../common/enums.js";

export class Partida extends Schema{
  @type("string") creador: string; 
  @type("string") fase: FasePartida;
  @type("string") faseJuego: FaseJuego;
  @type("string") turnoActual: string;
  
  constructor(){
    super();
    this.creador = "";
    this.fase = FasePartida.LOBBY;
    this.turnoActual = "";
    this.faseJuego = FaseJuego.DADOS;
  }
}