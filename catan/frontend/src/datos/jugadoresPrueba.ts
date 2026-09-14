export interface Jugador {
  nombre: string;
  color: string;
  puntos: number;
  cartas: number;
  recursos: number;
}

export const jugadoresPrueba: Jugador[] = [
  { nombre: 'jenjel', color: '#D34F3E', puntos: 4, cartas: 7, recursos: 6 },
  { nombre: 'coca',   color: '#3E7FD3', puntos: 3, cartas: 5, recursos: 5 },
  { nombre: 'jair',   color: '#4CA36B', puntos: 2, cartas: 9, recursos: 9 },
  { nombre: 'elayas', color: '#E0A030', puntos: 5, cartas: 3, recursos: 3 },
];