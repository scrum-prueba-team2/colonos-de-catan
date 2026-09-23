export interface DatosPartida {
  // sessionId de quien creo la sala. Solo el puede iniciar la partida.
  creador: string;

  // Ver datos/fases.ts
  fase: number;
  fasePreconstruccion: number;
  faseJuego: number;

  // En preconstruccion se recorre la lista de ida y de vuelta: 1 o -1.
  direccionPreconstruccion: number;

  // sessionId del jugador al que le toca.
  turnoActual: string;

  // El backend lo mezcla al iniciar. Tambien define el color de cada jugador.
  ordenJugadores: string[];

  // Al salir un 7: a quienes se les puede robar.
  jugadoresParaRobar: string[];

  // Al salir un 7: sessionId -> cuantas cartas le toca descartar.
  jugadoresParaDescartar: Record<string, number>;

  // Si el jugador del turno todavia puede jugar una carta de desarrollo.
  cartaJugable: boolean;

  // sessionId del ganador. Vacio mientras la partida siga.
  ganador: string;
}