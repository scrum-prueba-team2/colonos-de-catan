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
- Dos botones pequeños: **❌ Rechazar** y **✅ Aceptar**. Mientras el servidor responde se
  desactivan.
- Si el jugador no tiene lo que se pide, **✅ Aceptar queda desactivado** y aparece un aviso en
  rojo: "Tienes 0 madera: no te alcanza para aceptar." Solo puede rechazar. (Observación del
  product owner en la revisión: aceptar sin recursos no sirve porque el backend lo cambia a "no".)

### `src/pantallas/Partida.tsx`

- `debeResponder`: hay una oferta activa y mi valor en `respuestas` es `0`.
- `responderIntercambio`: envía `msgResponderIntercambio` con `{ respuesta }`.
- Estado `respuestaEnEspera`: se libera cuando el backend me deja de tener en `0` (respondí o se
  borró la oferta) o si llega `error`.
- En el recuadro "Negociar": si `debeResponder`, se muestra `ResponderIntercambio`; si no, el
  `ProponerIntercambio` de la issue anterior. Así, al responder o al cerrarse la oferta, el panel
  desaparece solo.
- Se actualizó el comentario de `ofertaActiva`: el backend ya borra la oferta al pasar el turno.

## Errores del backend encontrados en la prueba (ya corregidos)

El frontend no tocó el backend. Estos errores se reportaron y Angel Jiménez los corrigió en esta
misma rama con el commit `b2a91a4` ("fix: error de propuestas corregido"):

1. **El que acepta no entregaba sus recursos.** En `functions/intercambiarRecursos.ts`, el
   bloque que le descuenta al aceptante usaba la clave equivocada (`oferta.recursoOfrecido`
   en vez de `oferta.recursoSolicitado`). Al que aceptaba nunca se le restaba lo que daba. En la
   prueba, Beto tenía 1 madera y 0 trigo, aceptó dar 1 madera por 1 trigo y terminó con 1 madera
   y 1 trigo. **Corregido:** ahora usa `oferta.recursoSolicitado`.
2. En `msgResponderIntercambio`, el chequeo "No hay una oferta activa" no tenía `return` y el
   jugador recibía dos errores. **Corregido:** se agregó el `return`.

También se cambió el mensaje "Oferta cancelada por falta de recursos" por "Oferta cancelada, el
negociante no tiene ya recursos".

Ya corregidos por el backend desde la issue anterior: la oferta se borra al pasar el turno y el
chequeo "Ya existe una oferta activa" tiene su `return`.

## Cómo se probó

Primera prueba (antes del arreglo del backend y antes de desactivar ✅ sin recursos). Partida real
con backend y frontend corriendo y **4 jugadores**, cada uno en su pestaña. Caro propuso 1 trigo
por 1 madera:

1. Elias, Beto y Dani vieron la propuesta con ❌ y ✅; Caro (la que propuso) no.
2. Elias no tenía madera: vio el aviso en rojo, pulsó ✅ y el backend lo tomó como rechazo. Su
   panel desapareció; Beto y Dani lo seguían viendo.
3. Dani pulsó ❌: su panel desapareció; Beto lo seguía viendo.
4. Beto (con 1 madera) pulsó ✅: se hizo el intercambio y el panel desapareció para todos. Caro
   pasó de 0 madera y 3 trigo a 1 madera y 2 trigo. (A Beto no se le restó la madera: ver aviso 1.)
5. Sin errores en la consola ni avisos del juego.

Segunda prueba (con el arreglo del backend `b2a91a4` y con ✅ desactivado sin recursos), también
con 4 jugadores. Dani propuso 1 madera por 1 trigo:

1. Caro no tenía trigo: vio ✅ Aceptar **desactivado** y el aviso "Tienes 0 trigo: no te alcanza
   para aceptar." Pulsó ❌ y su panel desapareció.
2. Beto pulsó ❌: su panel desapareció.
3. Elias (con 2 trigo) pulsó ✅: el panel desapareció para todos y el intercambio cuadró para los
   dos. Dani pasó de 1 madera y 0 trigo a 0 madera y 1 trigo; Elias, de 0 madera y 2 trigo a
   1 madera y 1 trigo.
4. Sin errores en la consola ni avisos del juego.
