# Carta de construcción de carreteras (activación)

Issue **#122 — Activación de la carta Construcción de Carreteras**: permitir activar la carta,
que cambia la fase del juego a **Carreteras** y bloquea el resto de acciones de la vista.

Rama: `feature/activación-de-la-carta-de-carreteras` (creada desde `main`).

Esta carta tiene 2 fases y se maneja en dos issues. **Esta issue es solo la activación.** Colocar
los 2 caminos gratis (`msgCaminoGratis`) es la siguiente issue. El backend no se modificó.

## Mensaje que se usa

`msgCartaCarreteras`, **sin datos**. El backend le resta la carta al jugador, pone
`partida.carreterasGratis = 2`, cambia `partida.faseJuego` a `CARRETERAS` (6) y pone
`cartaJugable = false`. Si algo falla, manda `error` y se muestra el aviso.

## Qué se hizo

### `src/componentes/UsarCarta.tsx`

- Se agregó `CARTA.CARRETERAS` a `CARTAS_IMPLEMENTADAS`: en el menú ya no dice "Pendiente".
  Con esto las 4 cartas usables quedan activas en el menú.

### `src/pantallas/Partida.tsx`

- `elegirCarta`: si es Carreteras, llama a `activarCarreteras`. No hay diálogo porque la carta no
  pide datos.
- `activarCarreteras`: quita cualquier construcción que estuviera elegida (para que no queden
  aristas o vértices activos en el tablero) y envía `msgCartaCarreteras`.
- Estado `carreterasEnEspera`: guarda cuántas cartas de carreteras tenía el jugador. Se libera
  cuando el backend pasa la fase a `CARRETERAS` o resta la carta, si llega `error` o si cambia el
  turno. Mientras tanto "Usar carta" está desactivado.
- `enFaseCarreteras`: la partida está en `JUEGO` y la subfase es `CARRETERAS`. Con eso se muestra
  un aviso arriba del tablero **a todos los jugadores**:
  - al que jugó la carta: "Construcción de carreteras: tienes 2 camino(s) gratis. El resto de
    acciones está bloqueado." (el número sale de `partida.carreterasGratis`);
  - a los demás: "Elias está usando Construcción de carreteras."

### Cómo se bloquea el resto de la vista

No hizo falta agregar bloqueos nuevos: todas las acciones ya dependen de la fase. Construir,
comprar carta, usar carta, proponer intercambio, intercambiar con la banca y pasar turno solo se
habilitan en `ACCIONES`; lanzar dados solo en `DADOS`; mover al ladrón y robar en sus propias
fases. En `CARRETERAS` ninguna se cumple, así que todo queda desactivado.

## Avisos para el backend (no se tocaron)

En `msgCartaCarreteras`:

1. **No verifica que sea el turno del jugador.** Cualquier jugador con la carta podría activarla
   durante el turno de otro (si la fase es Acciones). El frontend solo deja usarla en tu turno.
2. **No verifica `cartaJugable`.** Se podría usar después de otra carta en el mismo turno. El
   frontend no lo permite porque "Usar carta" depende de `cartaJugable`.
3. El chequeo de "partida finalizada" responde "No es tu turno" (mensaje equivocado).
4. El chequeo de la fase de Acciones está repetido dos veces.

Además, mientras la siguiente issue no esté hecha, al activar la carta el jugador queda en la fase
Carreteras sin poder hacer nada (ni pasar turno), porque el backend solo vuelve a Acciones cuando
se colocan los caminos gratis.

## Cómo se probó

Partida real con backend y frontend corriendo y 3 jugadores, hasta que Elias tuvo una carta de
Carreteras usable en la fase de Acciones:

| Control | Antes de activar | Después de activar |
|---|---|---|
| Usar carta | activo | desactivado |
| Proponer intercambio | activo | desactivado |
| Intercambiar con la banca | activo | desactivado |
| Pasar turno | activo | desactivado |
| Construir (camino, poblado, ciudad) | desactivado (sin recursos) | desactivado |
| Comprar carta / Lanzar dados | desactivado | desactivado |
| Aristas o vértices clicables | 0 | 0 |

- En el menú, **Carreteras (1)** apareció activa.
- Al activarla, el backend pasó la fase a **6 (Carreteras)** con `carreterasGratis = 2`, la carta
  bajó de 1 a 0 y `cartaJugable` quedó en `false`.
- Apareció el aviso "Construcción de carreteras: tienes 2 camino(s) gratis…" y en el chat
  "Elias ha jugado una carta de carreteras".
- Sin errores en la consola ni avisos del juego.
