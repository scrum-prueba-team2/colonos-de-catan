import { Schema, type } from "@colyseus/schema";

export class Partida extends Schema{
  @type("string") turnoActual: string;
  @type("string") fase: string; 

  constructor(){
    super();
    this.turnoActual = "";
    this.fase = "lobby";
  }
}