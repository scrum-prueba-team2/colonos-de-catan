import { useEffect, useState } from 'react';

import './ventana.css';
import './infoCarRecursos.css';

export type TipoRecurso = 'madera' | 'ladrillo' | 'lana' | 'trigo' | 'piedra';

// Record obliga a que el objeto tenga los cinco recursos
export type Recursos = Record<TipoRecurso, number>;

const RECURSOS: { tipo: TipoRecurso; etiqueta: string }[] = [
  { tipo: 'madera',   etiqueta: 'Madera'   },
  { tipo: 'ladrillo', etiqueta: 'Ladrillo' },
  { tipo: 'lana',     etiqueta: 'Lana'     },
  { tipo: 'trigo',    etiqueta: 'Trigo'    },
  { tipo: 'piedra',   etiqueta: 'Piedra'   },
];

interface Props {
  recursos: Recursos;
}

/* Caja de cartas de recursos y las cantidades que posee el cliente.*/
function InfoCarRecursos({ recursos }: Props) {
  const [abierta, setAbierta] = useState(false);

  const total = RECURSOS.reduce((suma, r) => suma + recursos[r.tipo], 0);

  // cerrar con Escape
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
      {/* cantidad total + botón */}
      <div className="crCabecera">
        <span className="crTotal">{total}</span>
        <span className="crTitulo">recursos</span>
        <button className="btnDetallesRecursos" onClick={() => setAbierta(true)}>
          Ver
        </button>
      </div>

      {/* lista de recursos con su cantidad */}
      <ul className="listRecursos">
        {RECURSOS.map((r) => (
          <li key={r.tipo} className={recursos[r.tipo] === 0 ? 'lrItem lrVacio' : 'lrItem'}>
            <span className="lrNombre">{r.etiqueta}</span>
            <span className="lrCantidad">{recursos[r.tipo]}</span>
          </li>
        ))}
      </ul>

      {/* ventana emergente */}
      {abierta && (
        // Clic en el fondo oscuro cierra
        <div className="vdFondo" onClick={() => setAbierta(false)}>
          {/* stopPropagation corta el viaje del clic hacia arriba, para que
              tocar algo dentro de la ventana no la cierre */}
          <div className="vdVentana" onClick={(e) => e.stopPropagation()}>
            <div className="vdCabecera">
              <h2 className="vdTitulo">Tus recursos</h2>
              <button className="vdCerrar" onClick={() => setAbierta(false)}>×</button>
            </div>

            <div className="vdRejilla">
              {RECURSOS.map((r) => (
                <div
                  key={r.tipo}
                  className={recursos[r.tipo] === 0 ? 'vdCarta vdCartaVacia' : 'vdCarta'}
                >
                  <span className="vdCantidad">{recursos[r.tipo]}</span>
                  <span className="vdNombre">{r.etiqueta}</span>
                </div>
              ))}
            </div>

            <div className="vdPie">Total: <b>{total}</b> cartas</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoCarRecursos;