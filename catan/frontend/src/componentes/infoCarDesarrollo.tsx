import { useEffect, useState } from 'react';

import './ventana.css';
import './infoCarRecursos.css';
import './infoCarDesarrollo.css';

export type TipoDesarrollo =
  | 'caballero'
  | 'monopolio'
  | 'carreteras'
  | 'invento'
  | 'puntoVictoria';

export type Desarrollo = Record<TipoDesarrollo, number>;

// Las cinco cartas, con su descripcion y si se pueden jugar. Los puntos de
// victoria no se juegan, se acumulan: por eso jugable en false.
const DESARROLLO: {
  tipo: TipoDesarrollo;
  etiqueta: string;
  descripcion: string;
  jugable: boolean;
}[] = [
  { tipo: 'caballero',     etiqueta: 'Caballero',  descripcion: 'Mueve el ladrón y roba una carta a un vecino.',   jugable: true  },
  { tipo: 'monopolio',     etiqueta: 'Monopolio',  descripcion: 'Nombra un recurso: todos te entregan los suyos.', jugable: true  },
  { tipo: 'carreteras',    etiqueta: 'Carreteras', descripcion: 'Construye 2 caminos gratis.',                     jugable: true  },
  { tipo: 'invento',       etiqueta: 'Invento',    descripcion: 'Toma 2 recursos cualesquiera del banco.',         jugable: true  },
  { tipo: 'puntoVictoria', etiqueta: 'Punto',      descripcion: 'Vale 1 punto de victoria. No se juega.',          jugable: false },
];

// onUsar es como el componente le AVISA a la pantalla que se apreto el boton.
// Los datos bajan por props y los avisos suben por funciones.
interface Props {
  desarrollo: Desarrollo;
  onUsar?: (tipo: TipoDesarrollo) => void;
}


// Caja de cartas de desarrollo. 
function InfoCarDesarrollo({ desarrollo, onUsar }: Props) {
  const [abierta, setAbierta] = useState(false);

  const total = DESARROLLO.reduce((suma, c) => suma + desarrollo[c.tipo], 0);

  useEffect(() => {
    if (!abierta) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(false);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [abierta]);

  return (
    <div className="crMarco">
      <div className="crCabecera">
        <span className="crTotal">{total}</span>
        <span className="crTitulo">desarrollo</span>
        <button className="btnDetallesRecursos" onClick={() => setAbierta(true)}>
          Ver
        </button>
      </div>

      <ul className="listRecursos">
        {DESARROLLO.map((c) => (
          <li key={c.tipo} className={desarrollo[c.tipo] === 0 ? 'lrItem lrVacio' : 'lrItem'}>
            <span className="lrNombre">{c.etiqueta}</span>
            <span className="lrCantidad">{desarrollo[c.tipo]}</span>
          </li>
        ))}
      </ul>

      {abierta && (
        <div className="vdFondo" onClick={() => setAbierta(false)}>
          <div className="vdVentana" onClick={(e) => e.stopPropagation()}>
            <div className="vdCabecera">
              <h2 className="vdTitulo">Cartas de desarrollo</h2>
              <button className="vdCerrar" onClick={() => setAbierta(false)}>×</button>
            </div>

            <div className="vdRejilla vdAncha">
              {DESARROLLO.map((c) => {
                const cantidad = desarrollo[c.tipo];
                return (
                  <div
                    key={c.tipo}
                    className={cantidad === 0 ? 'vdCarta vdCartaVacia' : 'vdCarta'}
                  >
                    <span className="vdCantidad">{cantidad}</span>
                    <span className="vdNombre">{c.etiqueta}</span>
                    <span className="vdDescripcion">{c.descripcion}</span>

                    {c.jugable && (
                      <button
                        className="vdUsar"
                        disabled={cantidad === 0}
                        // El ?. evita reventar si no se paso la prop
                        onClick={() => onUsar?.(c.tipo)}
                      >
                        Usar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="vdPie">Total: <b>{total}</b> cartas</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoCarDesarrollo;