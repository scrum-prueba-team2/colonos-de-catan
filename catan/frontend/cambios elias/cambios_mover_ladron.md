# Mover al ladrón

Issue: habilitar en el centro de los hexágonos un círculo para elegir a qué hexágono se mueve
el ladrón.

## Cuándo aparece

Se llega a esta fase de dos formas, y las dos las decide el backend:

- Después de lanzar los dados y sacar 7, si nadie tiene más de 7 recursos.
- Después de que todos los jugadores que tenían que descartar terminan de hacerlo.

En ambos casos el backend deja `partida.faseJuego` en `LADRON` (3). Los círculos se muestran
solo si se cumplen las tres condiciones:

- la partida está en la fase `JUEGO`;
- la subfase es `LADRON`;
- es el turno del jugador.

Los demás jugadores no ven los círculos.

## Qué se hizo

### `src/componentes/tablero.tsx`

- Dos props nuevas: `moviendoLadron` (muestra u oculta los círculos) y
  `onSeleccionarHexagonoLadron` (recibe `{ h, d }` del hexágono elegido).
- Con `moviendoLadron` en `true` se dibuja un `<circle>` SVG en el centro de cada hexágono,
  encima de la ficha del número.
- **No se dibuja el círculo donde está el ladrón ahora.** Para saber dónde está se usa
  `hexagono.esLadron`, que el backend mantiene actualizado (ver "Corrección: el ladrón inicial
  no se borraba").
- El círculo se puede elegir con clic o con el teclado (Enter o espacio), igual que los
  objetivos de construcción.

### `src/componentes/tablero.css`

- Clase `.tbObjetivoLadron`: círculo semitransparente con borde punteado azul, para que se
  siga viendo el número de la ficha. Al pasar el mouse cambia de color, como los objetivos de
  construcción.

### `src/pantallas/Partida.tsx`

- `puedeMoverLadron`: es mi turno, la partida está en `JUEGO` y la subfase es `LADRON`.
- `moverLadron(hexagono)`: envía `sala.send('msgMoverLadron', { h, d })`, que es lo que
  espera `CatanRoom`.
- Estado `moviendoLadron`: mientras el servidor responde se ocultan los círculos, para no
  mandar el mensaje dos veces. Se vuelve a habilitar si el backend responde `error` o cuando
  la fase deja de ser `LADRON`.

## Qué pasa después

El frontend no decide nada: el backend valida, mueve al ladrón y cambia la fase.

- **Acciones:** si en ese hexágono no hay otros jugadores con recursos, o hay solo uno (en ese
  caso el backend le roba automáticamente).
- **Robo:** si hay 2 o más jugadores para robar (`partida.jugadoresParaRobar`). Elegir a quién
  robar es otra issue.

Al cambiar la fase, los círculos desaparecen solos.

## Corrección: el ladrón inicial no se borraba

### El problema

Al mover al ladrón por primera vez quedaban **dos ladrones dibujados**: uno en el desierto
(donde empezó) y otro en el hexágono elegido. Desde el segundo movimiento ya funcionaba bien.

La causa está en la generación inicial del tablero en el backend:

- `Tablero.ladron` se crea en `(0, 0)` (`schemas/Tablero.ts`).
- `generarHexagonos` pone el desierto en un lugar al azar y le pone `esLadron = true`, pero
  **no actualiza `tablero.ladron`**. Al empezar, el desierto tiene `esLadron = true` pero
  `tablero.ladron` dice `(0, 0)`.
- En el primer movimiento, `moverLadron` le quita `esLadron` al `(0, 0)` (que no lo tenía) y
  el desierto se queda con `esLadron = true` para siempre.

### Primera solución (solo frontend, ya retirada)

Mientras el backend tenía el error, en `tablero.tsx` se agregó la función `posicionLadron`
(con `tieneAlLadron`), que elegía un solo hexágono para dibujar al ladrón: si había un solo
hexágono con `esLadron` era ese, y si había más de uno, el que coincidía con
`tablero.ladron`. Así nunca se dibujaban dos ladrones.

### Lo que arregló Hengel en el backend

Hengel corrigió la causa en `main` (commit `ee4afd5`, "Feature/chat-log"):

- `backend/src/generators/generarHexagonos.ts`: ahora recibe `tablero.ladron` como segundo
  parámetro y, al crear el desierto, le copia sus coordenadas (`ladron.h` y `ladron.d`).
- `backend/src/states/CatanState.ts`: llama a `generarHexagonos(this.tablero.hexagonos,
  this.tablero.ladron)`.

Con eso, desde el inicio de la partida `tablero.ladron` apunta al desierto y, como
`moverLadron` ya le quita `esLadron` al hexágono anterior y se lo pone al nuevo, **solo un
hexágono tiene `esLadron = true` en todo momento**.

### Cómo quedó el frontend

Se trajeron los cambios de `main` a esta rama (merge `434e07e`) y, como pidió el coordinador,
se quitaron las verificaciones que ya hace el backend:

- `tablero.tsx`: se eliminaron `posicionLadron` y `tieneAlLadron`. El ladrón se dibuja con
  `hexagono.esLadron` y los círculos se ocultan donde `hexagono.esLadron` es `true`. Al
  moverlo, el backend actualiza los dos hexágonos y el anterior se repinta sin ladrón.
- `common/tablero.ts`: el comentario de `esLadron` ahora dice que es `true` solo donde está el
  ladrón y que el backend lo mantiene actualizado.

## Lo que no se tocó

- La elección del jugador a robar (fase `ROBO`).
