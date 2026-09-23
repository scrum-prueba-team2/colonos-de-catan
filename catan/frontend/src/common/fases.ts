/*
 * Copiado de backend/src/common/enums.ts.
 *
 * El backend publica estos valores como números mediante Colyseus, pero sus
 * enums TypeScript no llegan al navegador. Si se modifican las fases en el
 * backend, actualiza este archivo para mantener ambos lados sincronizados.
 */

// Estado general de la partida.
export const FASE_PARTIDA = {
  LOBBY: 1,
  PRECONSTRUCCION: 2,
  JUEGO: 3,
  FINALIZADA: 4,
} as const;

export type FasePartida = (typeof FASE_PARTIDA)[keyof typeof FASE_PARTIDA];

export const NOMBRE_FASE_PARTIDA: Record<FasePartida, string> = {
  [FASE_PARTIDA.LOBBY]: 'En espera',
  [FASE_PARTIDA.PRECONSTRUCCION]: 'Construcción inicial',
  [FASE_PARTIDA.JUEGO]: 'En juego',
  [FASE_PARTIDA.FINALIZADA]: 'Partida finalizada',
};

// Pasos de la colocación inicial antes de empezar el juego normal.
export const FASE_PRECONSTRUCCION = {
  ASENTAMIENTO: 1,
  CAMINO: 2,
} as const;

export type FasePreconstruccion =
  (typeof FASE_PRECONSTRUCCION)[keyof typeof FASE_PRECONSTRUCCION];

export const NOMBRE_FASE_PRECONSTRUCCION: Record<FasePreconstruccion, string> = {
  [FASE_PRECONSTRUCCION.ASENTAMIENTO]: 'Coloca un asentamiento',
  [FASE_PRECONSTRUCCION.CAMINO]: 'Coloca un camino',
};

// Subfases que controlan las acciones durante el juego.
export const FASE_JUEGO = {
  DADOS: 1,
  ACCIONES: 2,
  LADRON: 3,
  ROBO: 4,
  DESCARTE: 5,
  CARRETERAS: 6,
} as const;

export type FaseJuego = (typeof FASE_JUEGO)[keyof typeof FASE_JUEGO];

export const NOMBRE_FASE_JUEGO: Record<FaseJuego, string> = {
  [FASE_JUEGO.DADOS]: 'Lanzar dados',
  [FASE_JUEGO.ACCIONES]: 'Realizar acciones',
  [FASE_JUEGO.LADRON]: 'Mover al ladrón',
  [FASE_JUEGO.ROBO]: 'Robar recurso',
  [FASE_JUEGO.DESCARTE]: 'Descartar recursos',
  [FASE_JUEGO.CARRETERAS]: 'Construir carreteras',
};
