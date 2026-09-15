import "./tablero.css"

export interface HexagonoDato { 
  h: number; 
  d: number; 
  terreno: number; 
  numero: number; 
  esLadron: boolean 
}
export interface VerticeDato { 
  h: number; 
  d: number; 
  p: number; 
  constuccion: number; 
  propietario: string 
}
export interface AristaDato { 
  h: number; 
  d: number; 
  p: number; 
  propietario: string 
}
export interface PuertoDato { 
  id: number; 
  tipo: number; 
  vertice1: string; 
  vertice2: string 
}

export interface DatosTablero {
  hexagonos: Record<string, HexagonoDato>;
  vertices: Record<string, VerticeDato>;
  aristas: Record<string, AristaDato>;
  puertos: Record<string, PuertoDato>;
}

// Lado del hexagono.
const S = 60;

// Numeros del TipoPuerto
const NOMBRE_PUERTO: Record<number, string> = {
  0: '3:1', 
  1: '2 Madera:1', 
  2: '2 Trigo:1', 
  3: '2 Lana:1', 
  4: '2 Ladrillo:1', 
  5: '2 Piedra:1',
};

//* Funcion para transoformar una coordenada axial a un punto cartesiano
function centro(h: number, d: number): [number, number] {
  return [
    S * Math.sqrt(3) * (h + d / 2),   //* => Coordenada X 
    -S * 1.5 * d];                    //* => Coordenada Y
}

// Devuelve las 6 esquinas en orden: 0 N, 1 NE, 2 SE, 3 S, 4 SO, 5 NO 
function esquinas(h: number, d: number): [number, number][] {
  const [cx, cy] = centro(h, d);
  const m = (S * Math.sqrt(3)) / 2;
  return [
    [cx, cy - S], 
    [cx + m, cy - S / 2], 
    [cx + m, cy + S / 2],
    [cx, cy + S], 
    [cx - m, cy + S / 2], 
    [cx - m, cy - S / 2],
  ];
}

// Cada hexagono es dueño de 2 esquinas: p = 0 la del sur, p = 1 la del suroeste.
function puntoVertice(h: number, d: number, p: number): [number, number] {
  return esquinas(h, d)[p === 0 ? 3 : 4];
}

/* Cada hexagono es dueño de 3 lados: p = 0 el SE-S, p = 1 el S-SO, p = 2 el SO-NO.
   Que son las esquinas 2-3, 3-4 y 4-5, o sea p+2 y p+3. */
function segmentoArista(h: number, d: number, p: number): [number, number][] {
  const e = esquinas(h, d);
  return [e[p + 2], e[p + 3]];
}

// Los puertos referencian a sus vertices por la clave del mapa ("-3,3,0").
function puntoDeClave(clave: string): [number, number] {
  const [h, d, p] = clave.split(',').map(Number);
  return puntoVertice(h, d, p);
}

function Tablero({ datos }: { datos: DatosTablero }) {
  
  return (
    <svg
      className="tbSvg"
      viewBox={`${-5.7 * S} ${-5.5 * S} ${11.4 * S} ${11 * S}`}
    >

      {/* puertos primero, para que el muelle quede por detras del hexagono */}
      {Object.entries(datos.puertos).map(([clave, puerto]) => {
        const a = puntoDeClave(puerto.vertice1);
        const b = puntoDeClave(puerto.vertice2);
        // El cartel se separa del centro del tablero, hacia afuera.
        const mx = (a[0] + b[0]) / 2;
        const my = (a[1] + b[1]) / 2;
        const largo = Math.hypot(mx, my) || 1;
        const px = mx + (mx / largo) * S * 0.8;
        const py = my + (my / largo) * S * 0.62;
        return (
          <g key={clave} className="tbPuerto">
            <line x1={a[0]} y1={a[1]} x2={px} y2={py} className="tbMuelle" />
            <line x1={b[0]} y1={b[1]} x2={px} y2={py} className="tbMuelle" />
            <rect x={px - S * 0.5} y={py - S * 0.19} width={S * 1} height={S * 0.38}
                  rx={S * 0.09} className="tbPuertoCaja" />
            <text x={px} y={py} className="tbPuertoTexto">{NOMBRE_PUERTO[puerto.tipo]}</text>
          </g>
        );
      })}

      {/* hexagonos */}
      {Object.entries(datos.hexagonos).map(([clave, hex]) => (
        <polygon
          key={clave}
          className={`tbHex tbTerreno-${hex.terreno}`}
          points={esquinas(hex.h, hex.d).join(' ')}
        />
      ))}

      {/* aristas: los caminos */}
      {Object.entries(datos.aristas).map(([clave, arista]) => {
        const [a, b] = segmentoArista(arista.h, arista.d, arista.p);
        return (
          <line
            key={clave}
            className={arista.propietario === '' ? 'tbArista' : 'tbArista tbAristaOcupada'}
            x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]}
          />
        );
      })}

      {/* fichas de numero y ladron */}
      {Object.entries(datos.hexagonos).map(([clave, hex]) => {
        const [cx, cy] = centro(hex.h, hex.d);
        const rojo = hex.numero === 6 || hex.numero === 8;
        return (
          <g key={`f${clave}`}>
            {hex.numero > 0 && (
              <g className={rojo ? 'tbFicha tbFichaRoja' : 'tbFicha'}>
                <circle cx={cx} cy={cy} r={S * 0.31} className="tbFichaFondo" />
                <text x={cx} y={cy} className="tbFichaNumero">{hex.numero}</text>
              </g>
            )}
            {hex.esLadron && (
              <g className="tbLadron">
                <ellipse cx={cx} cy={cy + S * 0.18} rx={S * 0.2} ry={S * 0.16} />
                <circle cx={cx} cy={cy - S * 0.1} r={S * 0.13} />
              </g>
            )}
          </g>
        );
      })}

      {Object.entries(datos.vertices).map(([clave, vertice]) => {
        const [x, y] = puntoVertice(vertice.h, vertice.d, vertice.p);
        return (
          <circle
            key={clave}
            className={vertice.constuccion === 0 ? 'tbVertice' : 'tbVertice tbVerticeOcupado'}
            cx={x} cy={y} r={S * 0.085}
          />
        );
      })}
    </svg>
  );
}
export default Tablero;
