# Proponer intercambio a otros jugadores

Issue: igual que con la banca, permitir indicar qué recurso das y en qué cantidad y qué recurso
pides y en qué cantidad. Al confirmar, la propuesta queda en el estado de la partida y se muestra
a todos los jugadores.

## Alcance

- **Hecho:** el formulario para proponer y mostrar a todos la propuesta activa (solo
  información).
- **No hecho (siguiente issue):** aceptar o rechazar la propuesta (`msgResponderIntercambio`).
  Por eso la propuesta se muestra sin botones de respuesta.

El backend no se modificó.

## Mensaje que se usa

`msgIntercambiarJugador` con:

```json
{ "recursoEntregado": "madera", "cantidadEntregada": 1, "recursoRecibido": "trigo", "cantidadRecibida": 3 }
```

Los recursos son `madera`, `trigo`, `lana`, `ladrillo` y `mineral`. El backend guarda la
propuesta en `partida.ofertaIntercambio` (`jugador`, `recursoOfrecido`, `cantidadOfrecida`,
`recursoSolicitado`, `cantidadSolicitada`) y con eso les llega a todos los jugadores. La fase
sigue siendo Acciones.

## Qué se hizo

### `src/componentes/ProponerIntercambio.tsx` (nuevo)

Va en el recuadro "Negociar" (antes decía "area de negociar").

- Muestra la propuesta activa a **todos** los jugadores: "Elias ofrece 1 madera por 3 trigo.
  Propuesta activa". Si no hay, dice "No hay propuestas activas.".
- Botón **"Proponer intercambio"**, que abre un `Dialog` de MUI (igual que `ElegirRobo` y
  `UsarCarta`) con dos filas:
  - **Doy:** recurso y cantidad. Solo aparecen los recursos que el jugador tiene, y la cantidad
    va de 1 hasta lo que tiene.
  - **Pido:** recurso (no puede ser el mismo que se da) y cantidad de 1 a 19 (lo que tiene la
    banca de cada recurso al empezar).
- "Proponer" solo se activa cuando los datos son válidos.

### `src/pantallas/Partida.tsx`

- `ofertaActiva`: la oferta de `partida.ofertaIntercambio`, solo si es del jugador en turno.
- `puedeProponer`: mi turno, fase Acciones, sin otra propuesta activa y con al menos un recurso.
- `proponerIntercambio`: envía `msgIntercambiarJugador`.
- Estado `propuestaEnEspera`: mientras el servidor responde el botón dice "Enviando
  propuesta…". Se libera cuando la oferta aparece en el estado, si el backend responde `error`,
  o si cambia el turno o la fase.

## Avisos para el backend (no se tocaron)

1. **No se cancela al pasar el turno.** La issue dice que si se pasa el turno la propuesta se
   cancela, pero `msgPasarTurno` limpia `this.ofertas` (un mapa que no se usa) y no
   `partida.ofertaIntercambio`. Mientras tanto, el frontend solo muestra la oferta si es del
   jugador en turno, así que al pasar el turno deja de verse.
2. **"Ya existe una oferta activa" no detiene nada.** En `msgIntercambiarJugador` la condición
   usa `( ... )` en vez de `{ ...; return; }`: manda el error pero sigue y reemplaza la oferta.
   El frontend evita el caso porque no deja proponer si ya hay una activa.
3. **No valida que tengas lo que ofreces al proponer.** La issue dice que el backend lo valida,
   pero en `msgIntercambiarJugador` no está; solo se revisa cuando otro jugador acepta. El
   frontend solo deja ofrecer hasta la cantidad que tienes.
4. **Oferta de un turno anterior.** Por el punto 1, si el siguiente jugador propone mientras
   sigue guardada la oferta vieja, el backend le manda el error "Ya existe una oferta activa"
   (se ve como aviso) pero igual guarda la nueva por el punto 2.

## Cómo se probó

Partida real con backend y frontend corriendo y 2 jugadores, cada uno en su pestaña:

1. En el turno de Elias (fase Acciones) el botón "Proponer intercambio" está activo; en la
   pestaña del Rival está desactivado.
2. En "Doy" solo aparecen madera y lana (lo que tenía Elias). Se propuso 1 madera por 3 trigo.
3. Las dos pestañas muestran "Elias ofrece 1 madera por 3 trigo. Propuesta activa" y el botón de
   Elias queda desactivado.
4. Al pasar el turno, la pestaña del Rival vuelve a "No hay propuestas activas.".
