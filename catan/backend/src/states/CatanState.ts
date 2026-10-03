import {MapSchema, Schema, type } from "@colyseus/schema";
import { Jugador } from "../schemas/Jugador.js";
import { Partida } from "../schemas/Partida.js";
import { Hexagono } from "../schemas/Hexagono.js";
import { Tablero } from "../schemas/Tablero.js";
import { generarHexagonos } from "../generators/generarHexagonos.js";
import { generarAristas } from "../generators/generarAristas.js";
import { generarVertices } from "../generators/generarVertices.js";
import { generarPuertos } from "../generators/generarPuertos.js";
import { Banca } from "../schemas/Banca.js";

export class CatanState extends Schema{
  @type({ map: Jugador}) 
  jugadores = new MapSchema<Jugador>();
  
  @type(Partida)
  partida = new Partida();

  @type(Tablero)
  tablero = new Tablero();

  @type(Banca)
  banca = new Banca();

  constructor(){
    super();
    generarHexagonos(this.tablero.hexagonos, this.tablero.ladron);
    generarVertices(this.tablero.vertices);
    generarAristas(this.tablero.aristas);
    generarPuertos(this.tablero.puertos);
  }
};