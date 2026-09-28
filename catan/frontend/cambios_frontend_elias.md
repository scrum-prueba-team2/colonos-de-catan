# Cambios en el frontend: Bootstrap + MUI

Las pantallas se van pasando, una por una, de CSS hecho a mano a librerías.
Se quitan las animaciones propias y los recursos flotantes de fondo (`Decoracion`).

Pantallas migradas:

1. [Home](#1-home)
2. [Ingresar nombre](#2-ingresar-nombre)

## Librerías instaladas

| Paquete | Versión | Para qué |
|---|---|---|
| `bootstrap` | ^5.3.8 | CSS: layout, espaciados, colores, tipografía |
| `@mui/material` | ^9.4.0 | Componentes React |
| `@emotion/react`, `@emotion/styled` | ^11 | Requeridos por MUI |

Bootstrap se importa una vez en `src/main.tsx` (`bootstrap/dist/css/bootstrap.min.css`),
antes del CSS propio, para que el CSS propio pueda ajustarlo. Solo se usan sus clases CSS,
no su JavaScript.

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
