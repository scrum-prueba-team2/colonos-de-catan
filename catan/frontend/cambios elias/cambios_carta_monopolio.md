# Carta de monopolio

Issue **#121 — Activación de la carta de Monopolio**: al activar la carta, pedir un recurso a
elección y mandarlo al backend, que le pasa al jugador todo lo que los demás tengan de ese recurso.

Rama: `feature/activación-de-la-carta-de-monopolio` (creada desde `main`).

Continúa el menú de cartas (ver `cambios_usar_carta.md`) y la carta de abundancia (ver
`cambios_carta_abundancia.md`). El backend no se modificó.

## Mensaje que se usa

`msgCartaMonopolio` con el recurso elegido (`madera`, `trigo`, `lana`, `ladrillo` o `mineral`):

```json
{ "recurso": "mineral" }
```

El backend valida que sea tu turno, la fase de Acciones, que `cartaJugable` esté en `true`, que
tengas la carta y que el recurso exista. Si todo va bien, a cada uno de los demás jugadores le
quita todo ese recurso y se lo suma al que jugó la carta, le resta la carta y pone
`cartaJugable = false`. La fase sigue en Acciones. Si algo falla, manda `error` y se muestra el
aviso.

## Qué se hizo

### `src/componentes/ElegirMonopolio.tsx` (nuevo)

Mismo diseño que `ElegirAbundancia.tsx` y `intercambioBanca.tsx` (el `Dialog` de MUI con
`Select`), pero con **un solo** recurso:

- Texto: "Elige un recurso: todos los demás jugadores te darán todo lo que tengan de ese recurso."
- Cada opción muestra cuánto tienes tú, por ejemplo "mineral (tienes 0)". No se muestra cuánto
  tienen los demás porque esa información es privada de cada jugador.
- El botón "Pedir" solo se activa con un recurso elegido; mientras el servidor responde dice
  "Pidiendo…".

### `src/componentes/UsarCarta.tsx`

- Se agregó `CARTA.MONOPOLIO` a `CARTAS_IMPLEMENTADAS`: en el menú ya no dice "Pendiente".

### `src/pantallas/Partida.tsx`

Igual que la abundancia:

- Estado `monopolio`: `null` (no se usa), `'eligiendo'` (diálogo abierto) o un número (mensaje
  enviado; guarda cuántos monopolios usables tenía el jugador).
- `elegirCarta`: si es el Monopolio, abre el diálogo.
- `jugarMonopolio`: envía `msgCartaMonopolio` con `{ recurso }`.
- La carta se confirma cuando el backend la resta de `cartas_usables`; ahí se cierra el diálogo.
- Si llega `error`, el diálogo sigue abierto para elegir otro recurso. Si cambia el turno o la
  fase, se cancela.
- "Usar carta" queda desactivado mientras se usa el Monopolio.

## Cómo se probó

Partida real con backend y frontend corriendo y **3 jugadores**, hasta que Elias tuvo un
Monopolio usable en la fase de Acciones. Al empezar: Rival tenía 4 de mineral y Tercero 2;
Elias, 0.

1. En el menú "Usar carta", **Monopolio (1)** aparece activo.
2. Al elegirlo se abre el diálogo; "Pedir" está desactivado hasta elegir un recurso.
3. "Cancelar" cierra el diálogo y **no gasta la carta** (sigue en 1).
4. Se pidió **mineral**:
   - A Elias le entró todo: mineral de **0 a 6** (4 del Rival + 2 del Tercero).
   - Los totales visibles de los demás **bajaron**: Rival de 6 a **2** recursos y Tercero de 5
     a **3**. Elias subió de 4 a **10**.
   - La carta pasó de 1 a 0, el backend puso `cartaJugable = false` y "Usar carta" quedó
     desactivado (una carta por turno).
   - En el chat apareció "Elias ha usado la carta de monopolio".
5. Sin errores en la consola ni avisos del juego.
