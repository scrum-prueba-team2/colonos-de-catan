import { useEffect, useState } from 'react';

import './ventana.css';
import './infoCarRecursos.css';
import './infoCarEspeciales.css';

// Cuando llegue el backend esto sera probablemente quien la tiene (un texto
// con el nombre del dueno) en vez de si yo la tengo. Cambia el tipo y ya.
export interface Especiales {
  rutaComercial: boolean;
  ejercito: boolean;
}

// keyof saca los nombres de las propiedades del tipo de arriba. Asi no hay
// forma de que las dos listas se desincronicen.
type ClaveEspecial = keyof Especiales;

const ESPECIALES: {
  clave: ClaveEspecial;
  etiqueta: string;
  corta: string;
  puntos: number;
  comoSeObtiene: string;
}[] = [
  {
    clave: 'rutaComercial',
    etiqueta: 'Mayor Ruta Comercial',
    corta: 'Ruta comercial',
    puntos: 2,
    comoSeObtiene:
      'Ten la cadena continua de caminos más larga del tablero, con 5 caminos como mínimo. Si otro jugador te supera, la carta pasa a él.',
  },
  {
    clave: 'ejercito',
    etiqueta: 'Mayor Ejército',
    corta: 'Mayor ejército',
    puntos: 2,
    comoSeObtiene:
      'Juega 3 cartas de Caballero, más que cualquier otro jugador. Si otro te supera, la carta pasa a él.',
  },
];

interface Props {
  especiales: Especiales;
}

// Caja de cartas especiales: mayor ruta comercial y mayor ejercito.
// No son cantidades sino estados: la tienes o no la tienes.
function InfoCarEspeciales({ especiales }: Props) {
  const [abierta, setAbierta] = useState(false);

  // filter deja las que si tienes y length las cuenta. Siempre sale de la
  // verdad, nunca de una variable que haya que acordarse de actualizar.
  const cuantas = ESPECIALES.filter((e) => especiales[e.clave]).length;

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
      {/* título + botón */}
      <div className="crCabecera">
        <span className="ceTitulo">Cartas especiales</span>
        <button className="btnDetallesRecursos" onClick={() => setAbierta(true)}>
          Ver
        </button>
      </div>

      {/* el espacio restante, partido en dos */}
      <div className="ceRanuras">
        {ESPECIALES.map((e) => {
          const tiene = especiales[e.clave];
          return (
            <div key={e.clave} className={`ceRanura ce-${e.clave} ${tiene ? 'ceTiene' : ''}`}>
              <span className="ceCorta">{e.corta}</span>
              <span className="cePuntos">{tiene ? `+${e.puntos}` : ''}</span>
            </div>
          );
        })}
      </div>

      {abierta && (
        <div className="vdFondo" onClick={() => setAbierta(false)}>
          <div className="vdVentana vdAngosta" onClick={(e) => e.stopPropagation()}>
            <div className="vdCabecera">
              <h2 className="vdTitulo">Cartas especiales</h2>
              <button className="vdCerrar" onClick={() => setAbierta(false)}>×</button>
            </div>

            <div className="ceLista">
              {ESPECIALES.map((e) => {
                const tiene = especiales[e.clave];
                return (
                  <div key={e.clave} className={`ceFicha ce-${e.clave} ${tiene ? 'ceFichaTiene' : ''}`}>
                    <div className="ceFichaCabecera">
                      <h3 className="ceFichaTitulo">{e.etiqueta}</h3>
                      <span className="ceValor">+{e.puntos} pts</span>
                    </div>
                    <p className="ceComo">{e.comoSeObtiene}</p>
                    <span className={tiene ? 'ceEstado ceEstadoSi' : 'ceEstado'}>
                      {tiene ? 'La tienes' : 'No la tienes'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="vdPie">
              {cuantas === 0 ? (
                'No tienes ninguna carta especial.'
              ) : (
                <>
                  Tienes <b>{cuantas}</b> de 2 · <b>+{cuantas * 2}</b> puntos
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InfoCarEspeciales;