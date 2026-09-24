import type { Recursos } from '../datos/jugador';
import './construir.css';

// Estos nombres se envían al backend. No usamos las etiquetas visibles para
// evitar que un cambio de texto rompa el protocolo entre cliente y servidor.
export type TipoConstruccion = 'camino' | 'poblado' | 'ciudad';

export interface ObjetivoConstruccion {
  h: number;
  d: number;
  p: number;
}

export interface SolicitudConstruccion {
  tipo: TipoConstruccion;
  objetivo: ObjetivoConstruccion;
}

interface OpcionConstruccion {
  tipo: TipoConstruccion;
  etiqueta: string;
  ayuda: string;
  costo: Partial<Recursos>;
}

const OPCIONES: OpcionConstruccion[] = [
  { tipo: 'camino', etiqueta: 'Camino', ayuda: 'Selecciona una arista del tablero', costo: { madera: 1, ladrillo: 1 } },
  { tipo: 'poblado', etiqueta: 'Poblado', ayuda: 'Selecciona un vértice vacío del tablero', costo: { madera: 1, ladrillo: 1, lana: 1, trigo: 1 } },
  { tipo: 'ciudad', etiqueta: 'Ciudad', ayuda: 'Selecciona uno de tus poblados', costo: { trigo: 2, mineral: 3 } },
];

interface Props {
  recursos: Recursos;
  esMiTurno: boolean;
  seleccion: TipoConstruccion | null;
  onSeleccionar: (tipo: TipoConstruccion | null) => void;
}

// El botón se desactiva antes de seleccionar, pero el servidor vuelve a
// comprobar los recursos para evitar que el cliente pueda falsificarlos.
function puedePagar(recursos: Recursos, costo: Partial<Recursos>) {
  return Object.entries(costo).every(([recurso, cantidad]) => {
    const clave = recurso as keyof Recursos;
    return recursos[clave] >= cantidad;
  });
}

function Construir({ recursos, esMiTurno, seleccion, onSeleccionar }: Props) {
  return (
    <section className="cnMarco" aria-labelledby="construir-titulo">
      <div className="cnCabecera">
        <h2 id="construir-titulo" className="cnTitulo">Construir</h2>
        <span className="cnEstado">{esMiTurno ? 'Tu turno' : 'Espera tu turno'}</span>
      </div>

      <div className="cnRejilla">
        {OPCIONES.map((opcion) => {
          const habilitada = esMiTurno && puedePagar(recursos, opcion.costo);
          const activa = seleccion === opcion.tipo;

          return (
            <button
              key={opcion.tipo}
              type="button"
              className={activa ? 'cnOpcion cnActiva' : 'cnOpcion'}
              disabled={!habilitada}
              aria-pressed={activa}
              onClick={() => onSeleccionar(activa ? null : opcion.tipo)}
            >
              <span className={`cnIcono cnIcono-${opcion.tipo}`} aria-hidden="true" />
              <span className="cnNombre">{opcion.etiqueta}</span>
              <span className="cnAyuda">{habilitada ? opcion.ayuda : 'Recursos insuficientes'}</span>
            </button>
          );
        })}
      </div>

      {seleccion && (
        <p className="cnInstruccion" role="status">
          Seleccionaste <b>{OPCIONES.find((opcion) => opcion.tipo === seleccion)?.etiqueta}</b>.
          Ahora elige el lugar en el tablero.
        </p>
      )}
    </section>
  );
}

export default Construir;