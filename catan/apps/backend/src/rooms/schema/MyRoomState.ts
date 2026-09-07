import {MapSchema, Schema, type } from "@colyseus/schema";

export class Player extends Schema{
  @type("uint16") puntuacion: number = 0;
};

export class MyRoomState extends Schema{
  @type({ map: Player}) jugadores = new MapSchema<Player>();

  @type("string") turnoActual: string = "";
  
  @type("number") tiempoLimiteTurno: number = 0;

  @type("uint16") contadorTurnos: number = 0;

  // Estado por defecto de la sala
  @type("string") fase: string = "lobby"; 

};