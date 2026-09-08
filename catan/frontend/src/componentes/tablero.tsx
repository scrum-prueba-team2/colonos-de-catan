import TexturasTablero from './texturasTablero';
import './tablero.css';

export interface DatosTablero {
  // q,r [terreno, numero, ladron]
  hexagonos: Record<string, [number, number, number]>;
  // q,r,p(indice) [construccion, dueño]
  vertices: Record<string, [number, string]>;
  // q,r,p(indice) dueño
  aristas: Record<string, string>;
  // id [tipo, verticeA, verticeB]
  puertos: Record<string, [number, string, string]>;
}

// viewBox hace que todo se escale junto al tamano que tenga el contenedor.
const S = 60;

const NOMBRE_PUERTO: Record<number, string> = {
  0: '3:1', 1: 'Madera', 2: 'Lana', 3: 'Trigo', 4: 'Ladrillo', 5: 'Piedra',
};

// Centro de un hexagono en el lienzo.
function centro(q: number, r: number): [number, number] {
  return [
    // x
    S * Math.sqrt(3) * (q + r / 2), 
    // y
    S * 1.5 * r];
}

// las 6 esquinas en orden: N, NE, SE, S, SO, NO
function esquinas(q: number, r: number): [number, number][] {
  const [cx, cy] = centro(q, r);
  const h = (S * Math.sqrt(3)) / 2;
  return [
    [cx, cy - S], [cx + h, cy - S / 2], [cx + h, cy + S / 2],
    [cx, cy + S], [cx - h, cy + S / 2], [cx - h, cy - S / 2],
  ];
}

// p = 0 -> punta N ; p = 1 -> esquina NO
function puntoVertice(clave: string): [number, number] {
  const [q, r, p] = clave.split(',').map(Number);
  return esquinas(q, r)[p === 0 ? 0 : 5];
}

// p = 0 -> lado N-NE ; p = 1 -> lado NO-N ; p = 2 -> lado SO-NO
const LADO = [0, 5, 4];
function segmentoArista(clave: string): [[number, number], [number, number]] {
  const [q, r, p] = clave.split(',').map(Number);
  const e = esquinas(q, r);
  const i = LADO[p];
  return [e[i], e[(i + 1) % 6]];
}

// El recuadro visible. Es fijo porque el tablero siempre mide lo mismo.
const VB = `${-5.7 * S} ${-5.5 * S} ${11.4 * S} ${11 * S}`;

interface Props {
  datos: DatosTablero;
}

// Tablero de Catan dibujado en un solo SVG
function Tablero({ datos }: Props) {
  return (
  // Ningun color se escribe aqui. En SVG, fill y stroke son propiedades
  // normales de CSS, asi que el componente solo pone clases.
    <svg className="tbSvg" viewBox={VB} role="img" aria-label="Tablero de Catan">
      <TexturasTablero />

      {/* puertos primero, para que el muelle quede por detrás del hexágono */}
      {Object.entries(datos.puertos).map(([id, [tipo, va, vb]]) => {
        const a = puntoVertice(va);
        const b = puntoVertice(vb);
        const mx = (a[0] + b[0]) / 2;
        const my = (a[1] + b[1]) / 2;
        const largo = Math.hypot(mx, my) || 1;
        const px = mx + (mx / largo) * S * 0.62;
        const py = my + (my / largo) * S * 0.62;
        return (
          <g key={id} className="tbPuerto">
            <line x1={a[0]} y1={a[1]} x2={px} y2={py} className="tbMuelle" />
            <line x1={b[0]} y1={b[1]} x2={px} y2={py} className="tbMuelle" />
            <rect x={px - S * 0.36} y={py - S * 0.19} width={S * 0.72} height={S * 0.38}
                  rx={S * 0.09} className="tbPuertoCaja" />
            <text x={px} y={py} className="tbPuertoTexto">{NOMBRE_PUERTO[tipo]}</text>
          </g>
        );
      })}

      {/* hexágonos */}
      {Object.entries(datos.hexagonos).map(([clave, [terreno]]) => {
        const [q, r] = clave.split(',').map(Number);
        return (
          <polygon
            key={clave}
            className={`tbHex tbTerreno-${terreno}`}
            points={esquinas(q, r).map((p) => p.join(',')).join(' ')}
          />
        );
      })}

      {/* aristas — los caminos */}
      {Object.entries(datos.aristas).map(([clave, dueno]) => {
        const [a, b] = segmentoArista(clave);
        return (
          <line key={clave} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
                className={dueno === '' ? 'tbArista' : 'tbArista tbAristaOcupada'} />
        );
      })}

      {/* fichas de número y ladrón */}
      {Object.entries(datos.hexagonos).map(([clave, [, numero, ladron]]) => {
        const [q, r] = clave.split(',').map(Number);
        const [cx, cy] = centro(q, r);
        const rojo = numero === 6 || numero === 8;
        return (
          <g key={`f${clave}`}>
            {numero > 0 && (
              <g className={rojo ? 'tbFicha tbFichaRoja' : 'tbFicha'}>
                <circle cx={cx} cy={cy} r={S * 0.31} className="tbFichaFondo" />
                <text x={cx} y={cy} className="tbFichaNumero">{numero}</text>
              </g>
            )}
            {ladron === 1 && (
              <g className="tbLadron">
                <ellipse cx={cx} cy={cy + S * 0.18} rx={S * 0.2} ry={S * 0.16} />
                <circle cx={cx} cy={cy - S * 0.1} r={S * 0.13} />
              </g>
            )}
          </g>
        );
      })}

      {/* vértices — poblados y ciudades */}
      {Object.entries(datos.vertices).map(([clave, [construccion]]) => {
        const [x, y] = puntoVertice(clave);
        return (
          <circle key={clave} cx={x} cy={y} r={S * 0.085}
                  className={construccion === 0 ? 'tbVertice' : 'tbVertice tbVerticeOcupado'} />
        );
      })}
    </svg>
  );
}

export default Tablero;