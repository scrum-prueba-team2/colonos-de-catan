// Panel de construir. Cuatro botones con los iconos de las piezas.
// Los iconos vienen del sprite public/svg/piezas.svg.

// Los cuatro textos son el tipo completo: si escribes mal uno, TypeScript
// lo marca al instante.

import './construir.css';
export type TipoConstruccion = 'camino' | 'poblado' | 'ciudad' | 'desarrollo';

export type Construibles = Record<TipoConstruccion, boolean>;

// activo en false deja el hueco reservado en el diseno sin que se pueda usar.
// El dia que se implementen las cartas de desarrollo se cambia esa palabra.
const PIEZAS: {
  tipo: TipoConstruccion;
  etiqueta: string;
  activo: boolean;
}[] = [
  { tipo: 'camino',     etiqueta: 'Camino',     activo: true  },
  { tipo: 'poblado',    etiqueta: 'Poblado',    activo: true  },
  { tipo: 'ciudad',     etiqueta: 'Ciudad',     activo: true  },
  { tipo: 'desarrollo', etiqueta: 'Desarrollo', activo: false },   // sprint futuro
];

// construibles lo calcula el SERVIDOR, no el front. Si lo decidiera el
// navegador, un jugador podria trucarlo y construir sin recursos.
interface Props {
  construibles: Construibles;
  esMiTurno: boolean;
  onConstruir?: (tipo: TipoConstruccion) => void;
}

/*Panel de construir. Cuatro botones con los iconos de las piezas */
function Construir({ construibles, esMiTurno, onConstruir }: Props) {
  return (
    <div className="cnMarco">
      <span className="cnTitulo">Construir</span>

      <div className="cnRejilla">
        {PIEZAS.map((p) => {
          const puede = p.activo && esMiTurno && construibles[p.tipo];
          let motivo = 'Construir ' + p.etiqueta.toLowerCase();
          {/*if (!p.activo) motivo = 'Todavía no disponible';
          else if (!esMiTurno) motivo = 'No es tu turno';
          else if (!construibles[p.tipo]) motivo = 'No te alcanzan los recursos';*/}
          return (
            <button
              key={p.tipo}
              type="button"
              className={`cnBoton ${puede ? 'cnPuede' : ''}`}
              disabled={!puede}
              title={motivo}
              onClick={() => onConstruir?.(p.tipo)}
            >
              <svg className="cnIcono" aria-hidden="true">
                <use href={`/svg/piezas.svg#${p.tipo}`} />
              </svg>
              <span className="cnNombre">{p.etiqueta}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Construir;