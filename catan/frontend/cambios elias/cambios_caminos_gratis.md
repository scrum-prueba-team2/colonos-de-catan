# Construcción de caminos gratis

Issue **#123 — Construcción de Caminos Gratis**: una vez usada la carta de carreteras (fase
**Carreteras**), activar la vista de aristas del tablero para construir los caminos, con la misma
lógica que un camino normal pero usando otro mensaje.

Rama: `feature/construcción-de-caminos-gratis` (creada desde `main`).

Es la segunda parte de la carta de carreteras: la activación (fase Carreteras y bloqueo de la
vista) está en `cambios_carta_carreteras.md` (#122). El backend no se modificó.

## Mensaje que se usa

`msgCaminoGratis` con el **mismo JSON** que `msgColocarCamino`:

```json
{ "h": -3, "d": 3, "p": 0 }
```

El backend solo lo acepta en tu turno y en la fase `CARRETERAS`. Usa la misma función que un
camino normal (`construirCamino`), que en esta fase **no cobra madera ni ladrillo** pero sí exige
que la arista esté libre y conecte con algo tuyo. Cada mensaje descuenta un camino de
`partida.carreterasGratis`; al llegar a 0 la fase **vuelve a Acciones**.

## Qué se hizo (`src/pantallas/Partida.tsx`)

Se reutiliza todo el flujo de construir caminos (botón "Camino" del panel Construir y aristas del
tablero en `tablero.tsx`), con tres diferencias:

1. **Modo camino automático.** Al entrar a la fase Carreteras en tu turno se selecciona solo
   "Camino" y las aristas libres quedan listas para elegir. Al salir de la fase (cuando el backend
   vuelve a Acciones) se quita la selección. Se controla con la referencia `modoCaminosGratis`.
2. **Panel Construir.** En esa fase solo se permite el camino y sin pedir recursos
   (`tipoPermitido = 'camino'`), igual que en la preconstrucción.
3. **Otro mensaje.** En `seleccionarObjetivo`, si se está en la fase Carreteras se envía
   `msgCaminoGratis` en vez de `msgColocarCamino`. El modo camino sigue activo para el segundo.

Además:

- Estado `caminoGratisEnEspera`: guarda cuántos caminos gratis quedaban al enviar. Mientras el
  servidor responde se ocultan las aristas, para no mandar dos mensajes con un doble clic (cada
  uno gastaría un camino gratis). Se libera cuando el backend descuenta el camino, si llega `error`
  o al salir de la fase.
- El aviso de arriba del tablero ahora dice: "Construcción de carreteras: elige una arista para
  colocar un camino gratis (te quedan N). El resto de acciones está bloqueado."

## Aviso para el backend (no se tocó)

En `msgCaminoGratis`, si la arista **no es válida** (ocupada o sin conexión) se manda el error
pero **igual se descuenta el camino gratis**, porque falta el `return`:

```ts
if (resultado.error && resultado.mensaje !== "No tienes caminos disponibles") {
  client.send("error", { mensajeError: resultado.mensaje })
  // falta return; aqui
}
this.partida.carreterasGratis -= 1;
```

Así, un clic en una arista que no conecta hace perder uno de los dos caminos gratis. Parece que la
intención era descontarlo sin error solo cuando el jugador ya no tiene piezas de camino ("No
tienes caminos disponibles"), para que no se quede atascado. El tablero muestra como elegibles
todas las aristas libres (misma lógica que un camino normal), así que el error es posible.

## Cómo se probó

Partida real con backend y frontend corriendo y 3 jugadores, hasta que Elias tuvo una carta de
carreteras usable. Elias tenía **0 madera y 0 ladrillo** (si se cobrara, no podría construir):

1. Al activar la carta: aviso "te quedan 2", **66 aristas clicables**, el botón Camino quedó
   seleccionado solo y "Pasar turno" bloqueado.
2. Primer camino gratis: el aviso pasó a "te quedan 1", las piezas de camino bajaron de 13 a 12 y
   los recursos no cambiaron.
3. Segundo camino gratis: el backend volvió a **Acciones**, las piezas de camino quedaron en 11,
   el aviso desapareció, "Pasar turno" se reactivó, las aristas dejaron de ser clicables y el
   botón Camino volvió a su estado normal.
4. Madera y ladrillo siguieron en 0/0: los caminos fueron gratis.
5. Sin errores en la consola ni avisos del juego.
