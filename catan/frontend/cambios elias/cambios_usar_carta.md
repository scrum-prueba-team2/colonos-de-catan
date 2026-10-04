# Usar cartas de desarrollo: menú y carta Caballero

Issue: permitir al jugador elegir qué carta de desarrollo usar con un menú común para las 4
cartas usables, y que la carta Caballero mueva al ladrón eligiendo el hexágono antes de llamar
al mensaje.

## Alcance

- **Hecho:** el menú común para elegir carta y el flujo completo del **Caballero**.
- **Pendiente (otras issues):** Carreteras, Abundancia y Monopolio aparecen en el menú pero
  desactivadas con el texto "Pendiente". Cada una necesita su propio JSON y su propia pantalla:

  | Carta | Mensaje del backend | JSON |
  |---|---|---|
  | Caballero | `msgCartaCaballero` | `{ h, d }` |
  | Carreteras | `msgCartaCarreteras` y luego `msgCaminoGratis` (×2) | ninguno, luego `{ h, d, p }` |
  | Abundancia | `msgCartaAbundancia` | `{ recurso1, recurso2 }` |
  | Monopolio | `msgCartaMonopolio` | `{ recurso }` |

  Para activar una de ellas en el menú basta con agregarla a `CARTAS_IMPLEMENTADAS` en
  `UsarCarta.tsx` y manejarla en `elegirCarta` de `Partida.tsx`.

El backend no se modificó.

## Cuándo se puede usar una carta

El botón **"Usar carta"** (en "Mis cartas") se habilita solo si se cumple todo:

- es el turno del jugador, la partida está en `JUEGO` y la subfase es `ACCIONES`;
- `partida.cartaJugable` es `true` (el backend permite una carta por turno);
- el jugador tiene al menos una carta usable (caballero, carreteras, abundancia o monopolio)
  en `cartas_usables`. Las compradas en este turno (`cartas_inusables`) no cuentan;
- no hay un caballero en curso.

## Qué se hizo

### `src/componentes/UsarCarta.tsx` (nuevo)

- Menú en un `Dialog` de MUI, igual que `ElegirRobo`.
- Muestra las 4 cartas usables con su ícono (`/svg/...`), nombre, cantidad y efecto.
- Una carta se puede elegir si el jugador tiene al menos 1 y si ya está implementada
  (`CARTAS_IMPLEMENTADAS`, por ahora solo el Caballero).
- Botón "Cancelar" y cierre al hacer clic fuera.

### `src/componentes/carDesarrollo.tsx`

- El botón "Usar carta", que estaba siempre desactivado, ahora se habilita con
  `puedeUsarCarta` y abre el menú con `onUsarCarta`. No se cambió nada más del componente.

### `src/pantallas/Partida.tsx`

- `puedeUsarCarta`: las condiciones de la sección anterior.
- `elegirCarta`: cierra el menú y, si es el Caballero, entra al modo "eligiendo hexágono".
- **Caballero, reutilizando lo de MoverLadron:** se muestran los mismos círculos del tablero
  (`moviendoLadron` de `tablero.tsx`), sin círculo donde está el ladrón. Arriba del tablero
  aparece un aviso "Caballero: elige a qué hexágono mover al ladrón." con botón "Cancelar".
- `jugarCaballero`: al elegir el hexágono envía `msgCartaCaballero` con `{ h, d }`.
- Estado `caballero`:
  - `null`: no se está usando;
  - `'eligiendo'`: se muestran los círculos;
  - un número: el mensaje se envió; guarda cuántos caballeros usables tenía el jugador.
    Cuando el servidor le resta la carta, el caballero termina.
  - Si el backend responde `error`, vuelve a `'eligiendo'` para elegir otro hexágono.
  - Si cambia el turno o la fase deja de ser `ACCIONES`, se cancela.

## Qué pasa después del Caballero

Lo decide el backend, igual que al mover al ladrón con un 7:

- **Acciones:** si no hay jugadores para robar, o hay uno solo (el backend le roba solo).
- **Robo:** si hay 2 o más, el backend pasa a la fase `ROBO` y se abre `ElegirRobo`, que ya
  existía, para elegir a quién robar.

## Avisos para el backend (no se tocaron)

- En `msgCartaCaballero`, `partida.cartaJugable = false` solo se pone cuando pasa a la fase de
  Robo (2 o más jugadores). Si no hay a quién robar, o hay uno solo, `cartaJugable` sigue en
  `true` y el jugador podría usar otra carta en el mismo turno. El frontend respeta lo que dice
  el backend, así que en ese caso el botón "Usar carta" se vuelve a habilitar.
- En `functions/jugarCaballero.ts` hay `jugador.puntosParaGanar -+ 2;` (debería ser `-=`), al
  dar el ejército más grande a un nuevo dueño.

## Cómo probarlo

Hace falta una partida real con al menos 2 jugadores, pasar la construcción inicial, comprar un
Caballero y esperar al siguiente turno (las cartas compradas se activan al pasar el turno).
Luego, en la fase de Acciones:

1. Pulsar "Usar carta" y elegir Caballero.
2. Elegir un hexágono en el tablero (el del ladrón no tiene círculo).
3. Comprobar que el ladrón se mueve, que el contador de Caballero baja y, si hay 2 o más
   jugadores alrededor, que se abre el diálogo para elegir a quién robar.
