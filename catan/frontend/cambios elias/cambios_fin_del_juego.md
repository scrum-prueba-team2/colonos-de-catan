# Fin del juego

Issue **#124 — Fin del Juego**: cuando el backend pone un ganador y cambia la partida a la fase
**Finalizada**, mostrar un modal obligatorio con el nombre del ganador y dos botones: **Salir de
la sala** y **Ver tablero** (para ver cómo terminó la partida).

Rama: `feature/fin-del-juego` (creada desde `main`). El backend no se modificó.

## Cómo termina la partida en el backend

`functions/verificarVictoria.ts` se llama después de construir un asentamiento, una ciudad o
comprar una carta. Si al jugador ya no le faltan puntos (`puntosParaGanar <= 0`):

- guarda su sessionId en `partida.ganador`;
- pone `partida.fase = FINALIZADA` (4);
- manda al chat "<nombre> HA GANADO LA PARTIDA!!".

## Qué se hizo

### `src/componentes/FinPartida.tsx` (nuevo)

Modal con el `Dialog` de MUI (igual que los demás diálogos de la partida):

- Título "🏆 Partida finalizada".
- Al ganador: "**¡Ganaste la partida!**". A los demás: "**¡Elias ganó la partida!**".
- Botones **Ver tablero** y **Salir de la sala**.
- **Obligatorio:** no se cierra con Escape ni con un clic afuera (su `onClose` no hace nada);
  solo con sus dos botones.

### `src/pantallas/Partida.tsx`

- `partidaFinalizada`: la fase es `FINALIZADA` y hay ganador. Con eso se abre el modal para todos
  los jugadores.
- **Salir de la sala** usa el mismo `onSalir` que el botón "Salir" de la vista (sale de la sala y
  vuelve a la pantalla de inicio).
- **Ver tablero** cierra el modal y deja un aviso arriba del tablero: "Partida finalizada: ganó
  Elias. Usa "Salir" para dejar la sala.", para tomar captura del tablero final y toda la data.
- No hizo falta bloquear nada a mano: todas las acciones dependen de la fase `JUEGO`, así que en
  `FINALIZADA` quedan desactivadas y solo funciona el botón **Salir** que ya tenía la vista.

## Observaciones del backend (no se tocaron)

1. `verificarVictoria` no se llama al jugar un **Caballero**: si alguien llega a los puntos
   justo con el ejército más grande, la partida no termina hasta su siguiente construcción o compra
   de carta.
2. En `jugarCaballero.ts` sigue `jugador.puntosParaGanar -+ 2;` (debería ser `-=`) cuando el
   ejército más grande cambia de dueño.
3. Los puntos que se ven arriba ("5/10") no incluyen las cartas de punto de victoria, que solo
   restan de `puntosParaGanar`. Por eso en la prueba el ganador se veía con 5/10 al ganar (los
   otros 5 eran cartas de punto de victoria). Puede ser intencional (las cartas son ocultas).

## Cómo se probó

Partida **real** con backend y frontend corriendo y 2 jugadores, **sin modificar el backend**: un
script jugó por Elias hasta que ganó (compró las 25 cartas de desarrollo, jugó caballeros para el
ejército más grande y construyó una ciudad). Luego se abrió cada jugador en su pestaña:

1. Elias vio "¡Ganaste la partida!" y el Rival "¡Elias ganó la partida!", ambos con los dos
   botones.
2. Escape y un clic afuera **no** cerraron el modal.
3. "Ver tablero" cerró el modal y mostró el aviso "Partida finalizada: ganó Elias". Todos los
   controles (construir, comprar, usar carta, proponer, banca, pasar turno, dados) quedaron
   desactivados; solo "Salir" activo.
4. "Salir de la sala" sacó al Rival de la partida y lo llevó a "¿Qué quieres hacer?".
5. Sin errores en la consola ni avisos del juego.
