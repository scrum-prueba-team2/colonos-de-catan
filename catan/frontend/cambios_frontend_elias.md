# Cambios en el Home: Bootstrap + MUI

El Home (`src/pantallas/Home/Home.tsx`) ahora usa librerías en vez de CSS hecho a mano.
Se quitaron las animaciones propias (fichas que caen, ladrón que se mueve, logo que gira,
efectos de hover) y los recursos flotantes de fondo (`Decoracion`).

## Librerías instaladas

| Paquete | Versión | Para qué |
|---|---|---|
| `bootstrap` | ^5.3.8 | CSS: layout, espaciados, colores, tipografía |
| `@mui/material` | ^9.4.0 | Componentes React |
| `@emotion/react`, `@emotion/styled` | ^11 | Requeridos por MUI |

Bootstrap se importa una vez en `src/main.tsx` (`bootstrap/dist/css/bootstrap.min.css`),
antes del CSS propio, para que el CSS propio pueda ajustarlo.

## Bootstrap usado (solo clases CSS, sin JavaScript de Bootstrap)

- **Navbar:** `navbar`, `navbar-brand`, `bg-body-tertiary`, `border-bottom`
- **Layout / grid:** `container`, `row`, `col-12`, `col-sm-6`, `col-md-4`, `g-2`, `g-3`
- **Flex:** `d-flex`, `align-items-center`, `gap-2`, `gap-3`
- **Espaciados:** `mb-*`, `mt-4`, `my-3`, `mx-auto`, `p-2`, `pb-5`
- **Texto:** `text-center`, `lead`, `fw-bold`, `fw-semibold`, `text-body-secondary`
- **Fondos y bordes:** `bg-info-subtle`, `bg-light`, `border`, `rounded`
- **Otros:** `min-vh-100`, `list-unstyled`

## Componentes de MUI usados

| Componente | Dónde |
|---|---|
| `Button` | Botón "Jugar" del navbar y "Jugar ahora" |
| `Chip` | Etiqueta "En desarrollo · versión de prueba" |
| `Typography` | Título principal, "El equipo" y "Desarrolladores" |
| `Card` + `CardContent` | Tarjeta del equipo |
| `Divider` | Línea bajo "El equipo" |
| `Avatar` | Iniciales de cada integrante |

## CSS propio que queda (`Home.css`)

Solo 3 reglas de ancho máximo:

- `.home__hex-arte`: tamaño del SVG de la isla
- `.home__texto`: ancho del párrafo
- `.home__equipo`: ancho de la tarjeta del equipo

El SVG de la isla de hexágonos se mantiene (Bootstrap es para lo que *no* es SVG), pero ahora
es estático.

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
