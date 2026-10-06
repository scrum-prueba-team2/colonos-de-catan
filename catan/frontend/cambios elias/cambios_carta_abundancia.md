# Carta de abundancia

Issue **#120 — Activación de la carta de la abundancia**: al activar la carta, pedir 2 recursos
que el jugador quiere recibir gratis de la banca, reutilizando el diseño de la elección del
intercambio con la banca.

Rama: `feature/activación-de-la-carta-de-la-abundancia`.

Continúa el menú de cartas (ver `cambios_usar_carta.md`), donde la Abundancia aparecía como
"Pendiente". El backend no se modificó.

## Mensaje que se usa

`msgCartaAbundancia` con los dos recursos (`madera`, `trigo`, `lana`, `ladrillo` o `mineral`):

```json
{ "recurso1": "madera", "recurso2": "madera" }
```

El backend valida que sea tu turno, la fase de Acciones, que `cartaJugable` esté en `true`, que
tengas la carta y que la banca tenga los recursos (si son iguales, la banca necesita al menos 2).
Si todo va bien, te suma los 2 recursos, se los quita a la banca, te resta la carta y pone
`cartaJugable = false`. La fase sigue en Acciones. Si algo falla, manda `error` y se muestra el
aviso.

## Qué se hizo

### `src/componentes/ElegirAbundancia.tsx` (nuevo)

Copia el **diseño** de `intercambioBanca.tsx` (el de Jaime): el mismo `Dialog` de MUI con dos
`Select` y el formato "recurso (banca: N)". No se modificó el componente de Jaime, para no tocar
su issue.

Diferencias con el de la banca:

- Los dos `Select` son recursos que se **reciben**: "Recurso 1" y "Recurso 2".
- **Se puede elegir el mismo recurso dos veces.**
- Un recurso aparece desactivado si la banca no tiene, o si tiene 1 y ya se eligió en el otro
  `Select`.
- El botón "Recibir" solo se activa cuando la elección es válida; mientras el servidor responde
  dice "Recibiendo…".

### `src/componentes/UsarCarta.tsx`

- Se agregó `CARTA.ABUNDANCIA` a `CARTAS_IMPLEMENTADAS`: en el menú ya no dice "Pendiente".

### `src/pantallas/Partida.tsx`

Igual que el Caballero:

- Estado `abundancia`: `null` (no se usa), `'eligiendo'` (diálogo abierto) o un número (mensaje
  enviado; guarda cuántas abundancias usables tenía el jugador).
- `elegirCarta`: si es la Abundancia, abre el diálogo.
- `jugarAbundancia`: envía `msgCartaAbundancia` con `{ recurso1, recurso2 }`.
- La carta se confirma cuando el backend la resta de `cartas_usables`; ahí se cierra el diálogo.
- Si llega `error`, el diálogo sigue abierto para corregir la elección. Si cambia el turno o la
  fase, se cancela.
- "Usar carta" queda desactivado mientras se usa la Abundancia.
- El diálogo se monta al elegir la carta, así cada uso empieza vacío.

## Avisos para el backend (no se tocaron)

1. En `functions/jugarAbundancia.ts` la validación de recursos usa `&&` y debería usar `||`:

   ```ts
   if(!banca.recursos.has(recurso1) && !banca.recursos.has(recurso2)){ ... }
   ```

   Si **solo uno** de los dos es inválido, pasa la validación y al jugador se le guarda `NaN` en
   un recurso que no existe. Desde el frontend no puede pasar (solo se envían nombres válidos),
   pero conviene corregirlo.
2. Error de escritura en un mensaje: "La banca no tiene suficient**er** recursos".

## Cómo se probó

Partida real con backend y frontend corriendo y 2 jugadores, hasta que Elias tuvo una Abundancia
usable en la fase de Acciones:

1. En el menú "Usar carta", **Abundancia (1)** aparece activa con "Toma 2 recursos de la banca."
2. Al elegirla se abre el diálogo; "Recibir" está desactivado hasta elegir los 2 recursos.
3. "Cancelar" cierra el diálogo y **no gasta la carta** (sigue en 1).
4. Se eligió **2 de madera**: la mano pasó de 0 a 2 madera, la banca de 19 a 17 y la carta de
   1 a 0. El backend puso `cartaJugable = false` y "Usar carta" quedó desactivado (una carta por
   turno).
5. Sin errores en la consola ni avisos del juego.
