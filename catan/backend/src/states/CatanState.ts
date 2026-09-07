import {MapSchema, Schema, type } from "@colyseus/schema";
import { Jugador } from "../schemas/Jugador.js";
import { Partida } from "../schemas/Partida.js";

export class CatanState extends Schema{
  @type({ map: Jugador}) 
  jugadores = new MapSchema<Jugador>();
  
  @type(Partida)
  partida = new Partida();
  
};