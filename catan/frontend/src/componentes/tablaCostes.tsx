import type { TipoRecurso } from './infoCarRecursos';

import './tablaCostes.css';

interface Costo {
  pieza: string;
  nombre: string;
  paga: { tipo: TipoRecurso; n: number }[];
  activo: boolean;
}

// Los nombres visibles, aparte de los datos: el backend manda cantidades,
const NOMBRE: Record<TipoRecurso, string> = {
  madera: 'madera', ladrillo: 'ladrillo', lana: 'lana', trigo: 'trigo', piedra: 'piedra',
};

// Las reglas de costes. Editar aqui cambia lo que se ve en pantalla.
const COSTES: Costo[] = [
  {
    pieza: 'camino', nombre: 'Camino', activo: true,
    paga: [{ tipo: 'madera', n: 1 }, { tipo: 'ladrillo', n: 1 }],
  },
  {
    pieza: 'poblado', nombre: 'Poblado', activo: true,
    paga: [{ tipo: 'madera', n: 1 }, { tipo: 'ladrillo', n: 1 },
           { tipo: 'trigo', n: 1 }, { tipo: 'lana', n: 1 }],
  },
  {
    pieza: 'ciudad', nombre: 'Ciudad', activo: true,
    paga: [{ tipo: 'trigo', n: 2 }, { tipo: 'piedra', n: 3 }],
  },
  {
    pieza: 'desarrollo', nombre: 'Desarrollo', activo: false,
    paga: [{ tipo: 'trigo', n: 1 }, { tipo: 'lana', n: 1 }, { tipo: 'piedra', n: 1 }],
  },
];

// para los lectores de pantalla.
function enPalabras(c: Costo): string {
  return `${c.nombre}: ` + c.paga.map((p) => `${p.n} ${NOMBRE[p.tipo]}`).join(' + ');
}

function TablaCostes() {
  return (
    <div className="tcMarco">
      <span className="tcTitulo">Costes</span>

      <ul className="tcLista">
        {COSTES.map((c) => (
          <li key={c.pieza} className={c.activo ? 'tcFila' : 'tcFila tcInactiva'} title={enPalabras(c)}>
            <span className="tcPieza">
              <svg className="tcIconoPieza" aria-hidden="true">
                <use href={`/svg/piezas.svg#${c.pieza}`} />
              </svg>
              <span className="tcNombre">{c.nombre}</span>
            </span>
            <span className="tcPaga">
              {c.paga.map((p) => (
                <span key={p.tipo} className="tcCosto">
                  <svg className={`tcRecurso tcRec-${p.tipo}`} aria-hidden="true">
                    <use href={`/svg/piezas.svg#${p.tipo}`} />
                  </svg>
                  {/* Cuando se paga mas de uno del mismo recurso, se muestra el
                    icono una vez con el numero al lado, no repetido */}
                  {p.n > 1 && <b className="tcCantidad">{p.n}</b>}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TablaCostes;
