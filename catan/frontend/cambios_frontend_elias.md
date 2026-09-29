# Cambios en el frontend: Bootstrap + MUI

Las pantallas se van pasando, una por una, de CSS hecho a mano a librerías.
Se quitan las animaciones propias y los recursos flotantes de fondo (`Decoracion`).

Pantallas migradas:

1. [Home](#1-home)
2. [Ingresar nombre](#2-ingresar-nombre)
3. [Elegir modo](#3-elegir-modo)
4. [Crear sala](#4-crear-sala)

## Librerías instaladas

| Paquete | Versión | Para qué |
|---|---|---|
| `bootstrap` | ^5.3.8 | CSS: layout, espaciados, colores, tipografía |
| `@mui/material` | ^9.4.0 | Componentes React |
| `@emotion/react`, `@emotion/styled` | ^11 | Requeridos por MUI |
| `react-bootstrap` | ^2.10.10 | Componentes React de Bootstrap (lo agregó otro integrante para los componentes de la partida) |

Bootstrap se importa una vez en `src/main.tsx` (`bootstrap/dist/css/bootstrap.min.css`),
antes del CSS propio, para que el CSS propio pueda ajustarlo. Solo se usan sus clases CSS,
no su JavaScript.

En las pantallas de este documento (Home, Ingresar nombre, Elegir modo y Crear sala) no se usa
`react-bootstrap`: los componentes salen de MUI y Bootstrap se usa solo por sus clases.
Así cada pantalla usa una sola librería de componentes.

---

## 1. Home

Archivo: `src/pantallas/Home/Home.tsx`

Se quitaron las animaciones propias (fichas que caen, ladrón que se mueve, logo que gira,
efectos de hover) y los recursos flotantes de fondo (`Decoracion`).

### Bootstrap usado

- **Navbar:** `navbar`, `navbar-brand`, `bg-body-tertiary`, `border-bottom`
- **Layout / grid:** `container`, `row`, `col-12`, `col-sm-6`, `col-md-4`, `g-2`, `g-3`
- **Flex:** `d-flex`, `align-items-center`, `gap-2`, `gap-3`
- **Espaciados:** `mb-*`, `mt-4`, `my-3`, `mx-auto`, `p-2`, `pb-5`
- **Texto:** `text-center`, `lead`, `fw-bold`, `fw-semibold`, `text-body-secondary`
- **Fondos y bordes:** `bg-info-subtle`, `bg-light`, `border`, `rounded`
- **Otros:** `min-vh-100`, `list-unstyled`

### Componentes de MUI usados

| Componente | Dónde |
|---|---|
| `Button` | Botón "Jugar" del navbar y "Jugar ahora" |
| `Chip` | Etiqueta "En desarrollo · versión de prueba" |
| `Typography` | Título principal, "El equipo" y "Desarrolladores" |
| `Card` + `CardContent` | Tarjeta del equipo |
| `Divider` | Línea bajo "El equipo" |
| `Avatar` | Iniciales de cada integrante |

### CSS propio que queda (`Home.css`)

Solo 3 reglas de ancho máximo:

- `.home__hex-arte`: tamaño del SVG de la isla
- `.home__texto`: ancho del párrafo
- `.home__equipo`: ancho de la tarjeta del equipo

El SVG de la isla de hexágonos se mantiene (Bootstrap es para lo que *no* es SVG), pero ahora
es estático.

---

## 2. Ingresar nombre

Archivo: `src/pantallas/IngresarNombre/IngresarNombre.tsx`

Se quitaron la animación de aparecer de la tarjeta, el hexágono flotante con el poblado y los
recursos flotantes de fondo (`Decoracion`). El ícono del poblado (`/svg/poblado.svg`) se
mantiene, pero quieto junto a la etiqueta "Catan Online".

La lógica no cambió: misma validación (`validarNombreJugador`), mismo contador de caracteres,
el error solo se muestra después de intentar continuar y el botón se desactiva si el campo
está vacío.

### Bootstrap usado

- **Layout / flex:** `d-flex`, `flex-column`, `align-items-center`, `align-items-start`,
  `justify-content-center`, `justify-content-between`, `gap-3`, `w-100`
- **Espaciados:** `px-3`, `py-4`, `p-4`, `mb-3`, `mb-4`, `mt-3`
- **Texto:** `text-body-secondary`
- **Fondo:** `bg-info-subtle`, `min-vh-100`

### Componentes de MUI usados

| Componente | Dónde |
|---|---|
| `Button` (`variant="text"`) | Botón "← Volver" |
| `Card` + `CardContent` | Tarjeta del formulario (`CardContent` hace de `<form>`) |
| `Chip` | Etiqueta "Catan Online" |
| `Typography` | Título "¿Cómo te llamas, colono?" |
| `TextField` | Campo del nombre: etiqueta, placeholder, estado de error, mensaje de error y contador (en `helperText`) y largo máximo |
| `Button` (`variant="contained"`) | Botón "Continuar →" |

Antes el campo usaba las clases `tema-etiqueta`, `tema-input`, `tema-ayuda` y `tema-error` de
`tema.css`. Ahora todo eso lo resuelve `TextField`.

### CSS propio que queda (`IngresarNombre.css`)

Una sola regla:

- `.ingresar-nombre__contenido`: ancho máximo (440px) de la columna con el botón Volver y la tarjeta

---

## 3. Elegir modo

Archivo: `src/pantallas/ElegirModo/ElegirModo.tsx`

Se quitaron la animación de aparecer de las tarjetas, el giro y la elevación al pasar el mouse,
el ícono dentro de un hexágono y los recursos flotantes de fondo (`Decoracion`). Los íconos de
ciudad y carretera (`/svg/ciudad.svg`, `/svg/carretera.svg`) se mantienen, pero quietos.

La lógica no cambió: el saludo con el nombre y el enlace "cambiar nombre" solo aparecen si hay
nombre, y cada tarjeta sigue llamando a `onCrear` o a `onUnirse`.

Las dos opciones ahora salen de una lista (`OPCIONES`) y se dibujan con un `map`, en vez de
repetir el mismo bloque dos veces.

### Bootstrap usado

- **Grid:** `row`, `g-3`, `col-12`, `col-sm-6` (una tarjeta por fila en celular, dos en pantallas más anchas)
- **Flex:** `d-flex`, `flex-column`, `flex-wrap`, `align-items-baseline`, `gap-2`
- **Espaciados:** `px-3`, `py-4`, `mt-4`, `mb-4`, `mb-1`, `mb-0`, `mx-auto`
- **Texto:** `fs-5`, `text-body-secondary`
- **Tamaño:** `h-100` (las dos tarjetas quedan del mismo alto)
- **Fondo:** `bg-info-subtle`, `min-vh-100`

### Componentes de MUI usados

| Componente | Dónde |
|---|---|
| `Button` (`variant="text"`) | Botón "← Volver" |
| `Link` (`component="button"`) | Enlace "cambiar nombre" junto al saludo |
| `Typography` | Título "¿Qué quieres hacer?", título y detalle de cada tarjeta |
| `Card` | Tarjetas "Crear partida" y "Unirse a partida" |
| `CardActionArea` | Hace que toda la tarjeta sea clickeable (antes era un `<button>` con CSS propio) |
| `CardContent` | Contenido de cada tarjeta |

El borde de color de arriba de cada tarjeta se hace con la prop `sx` de MUI
(`borderTop: 6` y `borderTopColor`), usando los colores del tema de MUI: `error.main` (rojo)
para crear e `info.main` (celeste) para unirse. No se usó `border-danger` de Bootstrap porque
pinta los cuatro lados.

### CSS propio que queda (`ElegirModo.css`)

Una sola regla:

- `.elegir__contenido`: ancho máximo (720px) del contenido

---

## 4. Crear sala

Archivo: `src/pantallas/CrearSala/CrearSala.tsx`

Se quitaron la animación de aparecer de la tarjeta y del campo del código, el hexágono detrás
del ícono, el interruptor hecho a mano (con la perilla hexagonal que giraba) y los recursos
flotantes de fondo (`Decoracion`). El ícono de ciudad (`/svg/ciudad.svg`) se mantiene, pero
quieto junto al título.

La lógica no cambió: mismas validaciones (`validarAlias`, `validarCodigoAcceso`), el nombre
sugerido al entrar (`aliasSugerido`), la sala es pública por defecto, el campo del código solo
aparece si la sala es privada, los espacios del código se quitan mientras se escribe, los
errores solo se muestran después de intentar crear y el botón se desactiva mientras se crea
la sala.

### Bootstrap usado

- **Layout / flex:** `d-flex`, `flex-column`, `align-items-start`, `align-items-center`,
  `justify-content-between`, `gap-2`, `gap-3`, `w-100`
- **Espaciados:** `px-3`, `py-4`, `p-3`, `p-4`, `mb-0`, `mb-3`, `mx-auto`
- **Texto:** `fw-semibold`, `text-body-secondary`
- **Fondos y bordes:** `bg-info-subtle`, `bg-success-subtle` / `border-success-subtle`
  (sala pública), `bg-danger-subtle` / `border-danger-subtle` (sala privada), `border`, `rounded`
- **Otros:** `min-vh-100`

### Componentes de MUI usados

| Componente | Dónde |
|---|---|
| `Button` (`variant="text"`) | Botón "← Volver" |
| `Card` + `CardContent` | Tarjeta del formulario (`CardContent` hace de `<form>`) |
| `Typography` | Título "Funda tu sala" |
| `Divider` | Línea bajo el encabezado |
| `TextField` | Campos "Nombre de la sala" y "Código de acceso": etiqueta, placeholder, estado de error, mensaje de error y contador (en `helperText`) y largo máximo |
| `Switch` (`color="error"`) | Interruptor sala pública / privada (antes era un `<button role="switch">` con CSS propio) |
| `Alert` (`severity="error"`) | Error que devuelve el servidor al crear la sala |
| `Button` (`variant="contained"`, `color="error"`) | Botón "Crear sala" |

Antes los campos usaban las clases `tema-etiqueta`, `tema-input`, `tema-ayuda` y `tema-error`
de `tema.css`, el aviso usaba `tema-aviso` y el botón `tema-btn`. Ahora todo eso lo resuelve MUI.

La letra monoespaciada del código de acceso se hace con la prop `sx` del `TextField`
(el placeholder vuelve a la letra normal del tema). No se pasa a mayúsculas porque el backend
compara el código tal cual se escribió.

### CSS propio que queda (`CrearSala.css`)

Una sola regla:

- `.crear-sala__contenido`: ancho máximo (480px) de la columna con el botón Volver y la tarjeta

---

## Cómo correrlo

```bash
# Terminal 1: backend (puerto 2567)
cd catan/backend
npm install
npm start

# Terminal 2: frontend (puerto 5173)
cd catan/frontend
npm install
npm run dev
```
