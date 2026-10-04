# Responder propuestas de intercambio

Issue: mostrar a los jugadores que faltan por responder la propuesta que está en juego, con un
❌ y un ✅ para rechazarla o aceptarla, y ocultar esa interfaz cuando el backend los quita de los
que faltan por responder.

Continúa la issue anterior (ver `cambios_proponer_intercambio.md`). El backend no se modificó.

## Cómo funciona el backend

`partida.ofertaIntercambio.respuestas` tiene a todos los jugadores menos al que propone:

| Valor | Significado |
|---|---|
| `0` | Falta por responder |
| `1` | Aceptó |
| `-1` | Rechazó |

Se responde con `msgResponderIntercambio` y `{ "respuesta": 1 }` (aceptar) o `{ "respuesta": -1 }`
(rechazar):

- **Rechazar:** queda en `-1`. Si todos rechazan, la oferta se borra.
- **Aceptar sin tener lo que se pide:** el backend lo cambia a `-1` (no manda error).
- **Aceptar teniendo lo que se pide:** se hace el intercambio y la oferta se borra para todos.
- Si el que propuso ya no tiene lo que ofrecía, la oferta se borra y llega el error
  "Oferta cancelada por falta de recursos".

## Qué se hizo

### `src/componentes/ResponderIntercambio.tsx` (nuevo)

Se muestra en el recuadro **"Negociar"**, en lugar del de proponer, solo al jugador que tiene `0`
en `respuestas`. No es un modal, para no tapar el tablero.

- Texto: "**Caro** te ofrece **1 trigo** a cambio de **1 madera**."
- Si el jugador no tiene lo que se pide, un aviso en rojo: "Tienes 0 madera: si aceptas contará
  como rechazo." (el backend no manda error en ese caso, así el jugador sabe qué pasó).
- Dos botones pequeños: **❌ Rechazar** y **✅ Aceptar**. Mientras el servidor responde se
  desactivan.

### `src/pantallas/Partida.tsx`

- `debeResponder`: hay una oferta activa y mi valor en `respuestas` es `0`.
- `responderIntercambio`: envía `msgResponderIntercambio` con `{ respuesta }`.
- Estado `respuestaEnEspera`: se libera cuando el backend me deja de tener en `0` (respondí o se
  borró la oferta) o si llega `error`.
- En el recuadro "Negociar": si `debeResponder`, se muestra `ResponderIntercambio`; si no, el
  `ProponerIntercambio` de la issue anterior. Así, al responder o al cerrarse la oferta, el panel
  desaparece solo.
- Se actualizó el comentario de `ofertaActiva`: el backend ya borra la oferta al pasar el turno.

## Avisos para el backend (no se tocaron)

1. **El que acepta no entrega sus recursos.** En `functions/intercambiarRecursos.ts`, el bloque
   que le descuenta al aceptante usa la clave equivocada:

   ```ts
   aceptante.recursos.set(
       oferta.recursoOfrecido,                                                   // debería ser recursoSolicitado
       aceptante.recursos.get(oferta.recursoSolicitado) - oferta.cantidadSolicitada
   );
   ```

   Resultado: al que acepta nunca se le resta lo que da y además se le pisa la cantidad del
   recurso que recibe. Se vio en la prueba: Beto tenía 1 madera y 0 trigo, aceptó dar 1 madera
   por 1 trigo y terminó con 1 madera y 1 trigo (debía quedar con 0 madera y 1 trigo).
2. En `msgResponderIntercambio`, el chequeo "No hay una oferta activa" no tiene `return`. No
   rompe nada porque el siguiente chequeo corta, pero el jugador recibe dos errores.

Ya corregidos por el backend desde la issue anterior: la oferta se borra al pasar el turno y el
chequeo "Ya existe una oferta activa" ahora tiene su `return`.

## Cómo se probó

Partida real con backend y frontend corriendo y **4 jugadores**, cada uno en su pestaña. Caro
propuso 1 trigo por 1 madera:

1. Elias, Beto y Dani vieron la propuesta con ❌ y ✅; Caro (la que propuso) no.
2. Elias no tenía madera: vio el aviso en rojo, pulsó ✅ y el backend lo tomó como rechazo. Su
   panel desapareció; Beto y Dani lo seguían viendo.
3. Dani pulsó ❌: su panel desapareció; Beto lo seguía viendo.
4. Beto (con 1 madera) pulsó ✅: se hizo el intercambio y el panel desapareció para todos. Caro
   pasó de 0 madera y 3 trigo a 1 madera y 2 trigo. (A Beto no se le restó la madera: ver aviso 1.)
5. Sin errores en la consola ni avisos del juego.
