export type Recurso = 'madera' | 'trigo' | 'lana' | 'ladrillo' | 'mineral';

export interface Recursos {
  madera: number;
  trigo: number;
  lana: number;
  ladrillo: number;
  mineral: number;
}

// Para recorrerlos en pantalla en un orden fijo.
export const RECURSOS: Recurso[] = ['madera', 'trigo', 'lana', 'ladrillo', 'mineral'];

export const CARTA = {
  CABALLERO: '1',
  PUNTOS_VICTORIA: '2',
  CARRETERAS: '3',
  ABUNDANCIA: '4',
  MONOPOLIO: '5',
} as const;

export interface Cartas {
  '1': number;   // caballero
  '2': number;   // punto de victoria
  '3': number;   // carreteras
  '4': number;   // abundancia
  '5': number;   // monopolio
}

export const NOMBRE_CARTA: Record<string, string> = {
  '1': 'Caballero',
  '2': 'Punto de victoria',
  '3': 'Carreteras',
  '4': 'Abundancia',
  '5': 'Monopolio',
};

// Construcciones disponibles
export const PIEZA = {
  ASENTAMIENTO: '1',
  CIUDAD: '2',
  CAMINO: '3',
} as const;

export interface ConstruccionesDisponibles {
  '1': number;   // asentamientos
  '2': number;   // ciudades
  '3': number;   // caminos
}

export const NOMBRE_PIEZA: Record<string, string> = {
  '1': 'Asentamiento',
  '2': 'Ciudad',
  '3': 'Camino',
};

export interface Jugador {
  nombre: string;
  color: string;
  puntuacion: number;
  puntosParaGanar: number;
  recursos: Recursos;
  cartas_usables: Cartas;
  cartas_inusables: Cartas;
  construccionesDisponibles: ConstruccionesDisponibles;
  ultimoAsentamiento: string;
  caballerosJugados: number;
}

export type Jugadores = Record<string, Jugador>;

// ya que el backend parece no mandar totales se suma en frontend (temporal)
function sumar(mapa: Recursos | Cartas): number {
  return Object.values(mapa).reduce((total, n) => total + n, 0);
}

// Cartas de recurso en la mano. Es el numero que ven los rivales.
export function totalRecursos(jugador: Jugador): number {
  return sumar(jugador.recursos);
}

// Cartas de desarrollo en la mano, se puedan usar ahora o no.
export function totalCartas(jugador: Jugador): number {
  return sumar(jugador.cartas_usables) + sumar(jugador.cartas_inusables);
}

// Todas las cartas que tiene en la mano: recursos mas desarrollo.
export function totalEnMano(jugador: Jugador): number {
  return totalRecursos(jugador) + totalCartas(jugador);
}

// Con mas de 7 recursos, si sale un 7 hay que descartar la mitad.
export const LIMITE_DESCARTE = 7;
export function enRiesgoDeDescarte(jugador: Jugador): boolean {
  return totalRecursos(jugador) > LIMITE_DESCARTE;
}


// DATOS DE PRUEBA

// Los sessionId son inventados.
export const miSessionIdPrueba = 'zNEakYdRU';

export const jugadoresPrueba: Jugadores = {
  zNEakYdRU: {
    nombre: 'jenjel',
    color: '#D34F3E',
    puntuacion: 4,
    puntosParaGanar: 10,
    recursos: { madera: 2, trigo: 1, lana: 0, ladrillo: 3, mineral: 0 },
    cartas_usables: { '1': 1, '2': 1, '3': 0, '4': 0, '5': 0 },
    cartas_inusables: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    construccionesDisponibles: { '1': 3, '2': 4, '3': 11 },
    ultimoAsentamiento: '0,0,0',
    caballerosJugados: 2,
  },
  aB7kLm2Qx: {
    nombre: 'coca',
    color: '#3E7FD3',
    puntuacion: 3,
    puntosParaGanar: 10,
    recursos: { madera: 1, trigo: 2, lana: 1, ladrillo: 0, mineral: 1 },
    cartas_usables: { '1': 0, '2': 0, '3': 1, '4': 0, '5': 0 },
    // Compro una carta este turno: todavia no la puede usar.
    cartas_inusables: { '1': 1, '2': 0, '3': 0, '4': 0, '5': 0 },
    construccionesDisponibles: { '1': 4, '2': 4, '3': 13 },
    ultimoAsentamiento: '-1,1,1',
    caballerosJugados: 0,
  },
  Rv9TpZo4c: {
    nombre: 'jair',
    color: '#4CA36B',
    puntuacion: 2,
    puntosParaGanar: 10,
    // Nueve recursos: si sale un 7 tiene que descartar.
    recursos: { madera: 3, trigo: 2, lana: 2, ladrillo: 1, mineral: 1 },
    cartas_usables: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    cartas_inusables: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    construccionesDisponibles: { '1': 4, '2': 4, '3': 14 },
    ultimoAsentamiento: '2,-1,0',
    caballerosJugados: 0,
  },
  Wq3sYh8Nd: {
    nombre: 'elayas',
    color: '#E0A030',
    puntuacion: 5,
    puntosParaGanar: 10,
    recursos: { madera: 0, trigo: 1, lana: 1, ladrillo: 0, mineral: 1 },
    cartas_usables: { '1': 3, '2': 0, '3': 0, '4': 1, '5': 0 },
    cartas_inusables: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 },
    construccionesDisponibles: { '1': 2, '2': 3, '3': 9 },
    ultimoAsentamiento: '1,-2,1',
    caballerosJugados: 3,
  },
};

/* Estos cuatro NO son del jugador: viven en state.partida. Estan aqui solo
   para poder probar la fila sin depender de otro archivo, y se llaman igual
   que en la guia para que al conectar sea cambiar el valor y nada mas. */
export const ordenJugadoresPrueba: string[] = [
  'zNEakYdRU', 'aB7kLm2Qx', 'Rv9TpZo4c', 'Wq3sYh8Nd',
];
export const turnoActualPrueba = 'aB7kLm2Qx';