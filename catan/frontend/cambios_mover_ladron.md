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
- **No se dibuja el círculo donde está el ladrón ahora.** Para saber dónde está se usa la
  función `posicionLadron` (ver "Corrección: el ladrón inicial no se borraba").
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

## Lo que no se tocó

- El dibujo del ladrón en el tablero sigue usando `hexagono.esLadron`, que el backend nunca
  actualiza. Por eso, después de moverlo, la figura del ladrón se sigue viendo en el desierto
  aunque en el backend ya esté en otro hexágono. El círculo sí se oculta en la posición real.
  Corregir el dibujo es fuera de esta issue.
- La elección del jugador a robar (fase `ROBO`).
