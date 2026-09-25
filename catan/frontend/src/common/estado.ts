import type { DatosTablero } from './tablero';
import type { Jugadores } from './jugador';
import type { DatosPartida } from './partida';
import type { Banca } from './banca';

export interface EstadoCatan {
  jugadores: Jugadores;
  partida: DatosPartida;
  tablero: DatosTablero;
  banca: Banca;
}