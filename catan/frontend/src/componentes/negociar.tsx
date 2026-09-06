// Panel y ventana de negociar. Solo se puede negociar si es tu turno y ya
// tiraste los dados. La ventana reutiliza el MISMO componente Chat de la
// columna lateral, y como los mensajes viven en Partida.tsx los dos muestran
// lo mismo y se actualizan juntos.

import { useEffect, useState } from 'react';
import Chat, { type Mensaje } from './chat';
import type { Jugador } from './InfoJugador';
import type { Recursos, TipoRecurso } from './infoCarRecursos';

import './ventana.css';
import './negociar.css';

// Lo que se le manda al servidor cuando se propone un trato.
export interface Oferta {
  para: string;
  ofrezco: Recursos;
  pido: Recursos;
}

const RECURSOS: { tipo: TipoRecurso; etiqueta: string }[] = [
  { tipo: 'madera',   etiqueta: 'Madera'   },
  { tipo: 'ladrillo', etiqueta: 'Ladrillo' },
  { tipo: 'lana',     etiqueta: 'Lana'     },
  { tipo: 'trigo',    etiqueta: 'Trigo'    },
  { tipo: 'piedra',   etiqueta: 'Piedra'   },
];

// Punto de partida de los contadores, y a lo que se vuelve al abrir.
const VACIO: Recursos = { madera: 0, ladrillo: 0, lana: 0, trigo: 0, piedra: 0 };

// Cuantas cartas hay en total en un lado del trato.
function suma(r: Recursos): number {
  return RECURSOS.reduce((t, x) => t + r[x.tipo], 0);
}

interface Props {
  jugadores: Jugador[];
  yoSoy: string;
  misRecursos: Recursos;
  esMiTurno: boolean;
  yaTiroDados: boolean;
  mensajes: Mensaje[];
  onEnviarMensaje?: (texto: string) => void;
  onOfertar?: (oferta: Oferta) => void;
}

function Negociar({
  jugadores, yoSoy, misRecursos, esMiTurno, yaTiroDados,
  mensajes, onEnviarMensaje, onOfertar,
}: Props) {
  const [abierta, setAbierta] = useState(false);
  const [con, setCon] = useState<string | null>(null);
  const [ofrezco, setOfrezco] = useState<Recursos>(VACIO);
  const [pido, setPido] = useState<Recursos>(VACIO);

  // Las dos condiciones que pediste. yaTiroDados sale de que ultimoDado ya
  // no sea null, asi que no hizo falta estado nuevo.
  const puedeNegociar = esMiTurno && yaTiroDados;

  let motivo = 'Proponer un intercambio';
  if (!esMiTurno) motivo = 'No es tu turno';
  else if (!yaTiroDados) motivo = 'Primero tira los dados';

  // No te puedes negociar a ti mismo.
  const otros = jugadores.filter((j) => j.nombre !== yoSoy);
  const listo = con !== null && (suma(ofrezco) > 0 || suma(pido) > 0);

  useEffect(() => {
    if (!abierta) return;
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierta(false);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [abierta]);

  // Cada vez que se abre, el trato empieza en blanco.
  function abrir() {
    setCon(null);
    setOfrezco(VACIO);
    setPido(VACIO);
    setAbierta(true);
  }

  // Una sola funcion para los diez contadores. Los topes son distintos:
  // no puedes ofrecer lo que no tienes, pero si pedir hasta 19 del banco.
  function ajustar(lado: 'ofrezco' | 'pido', tipo: TipoRecurso, paso: number) {
    const poner = lado === 'ofrezco' ? setOfrezco : setPido;
    const tope = lado === 'ofrezco' ? misRecursos[tipo] : 19;
    poner((previo) => {
      const valor = Math.max(0, Math.min(tope, previo[tipo] + paso));
      // Los corchetes de [tipo] son una llave calculada: usan el CONTENIDO de
      // la variable como nombre de la propiedad, no la palabra tipo.
      return { ...previo, [tipo]: valor };
    });
  }

  function proponer() {
    if (con === null) return;
    onOfertar?.({ para: con, ofrezco, pido });
    setAbierta(false);
  }

  return (
    <div className="ngMarco">
      <span className="ngTitulo">Negociar</span>

      <button
        type="button"
        className={`ngBoton ${puedeNegociar ? 'ngPuede' : ''}`}
        disabled={!puedeNegociar}
        title={motivo}
        onClick={abrir}
      >
        <svg className="ngIcono" aria-hidden="true">
          <use href={puedeNegociar ? '/svg/piezas.svg#negociar' : '/svg/piezas.svg#negociar-gris'} />
        </svg>
      </button>

      {abierta && (
        <div className="vdFondo" onClick={() => setAbierta(false)}>
          <div className="ngVentana" onClick={(e) => e.stopPropagation()}>
            <div className="vdCabecera">
              <h2 className="vdTitulo">Negociar</h2>
              <button className="vdCerrar" onClick={() => setAbierta(false)}>×</button>
            </div>

            <div className="ngCuerpo">
              <div className="ngTrato">
                <span className="ngPaso">1 · ¿Con quién?</span>
                <div className="ngJugadores">
                  {otros.map((j) => (
                    <button
                      key={j.nombre}
                      type="button"
                      className={con === j.nombre ? 'ngJugador ngElegido' : 'ngJugador'}
                      onClick={() => setCon(j.nombre)}
                    >
                      {j.nombre}
                    </button>
                  ))}
                </div>

                <span className="ngPaso">2 · El trato</span>
                <div className="ngTabla">
                  <span className="ngEncabezado"></span>
                  <span className="ngEncabezado">Ofreces</span>
                  <span className="ngEncabezado">Pides</span>

                  {RECURSOS.map((r) => (
                    <div key={r.tipo} className="ngFila">
                      <span className="ngRecurso">
                        {r.etiqueta}
                        <span className="ngTengo">tienes {misRecursos[r.tipo]}</span>
                      </span>

                      <span className="ngContador">
                        <button type="button" onClick={() => ajustar('ofrezco', r.tipo, -1)}
                                disabled={ofrezco[r.tipo] === 0}>−</button>
                        <b>{ofrezco[r.tipo]}</b>
                        <button type="button" onClick={() => ajustar('ofrezco', r.tipo, 1)}
                                disabled={ofrezco[r.tipo] >= misRecursos[r.tipo]}>+</button>
                      </span>

                      <span className="ngContador">
                        <button type="button" onClick={() => ajustar('pido', r.tipo, -1)}
                                disabled={pido[r.tipo] === 0}>−</button>
                        <b>{pido[r.tipo]}</b>
                        <button type="button" onClick={() => ajustar('pido', r.tipo, 1)}>+</button>
                      </span>
                    </div>
                  ))}
                </div>

                <div className="ngPie">
                  <span className="ngResumen">
                    Das <b>{suma(ofrezco)}</b> · Recibes <b>{suma(pido)}</b>
                    {con !== null && <> · con <b>{con}</b></>}
                  </span>
                  <button type="button" className="ngProponer" disabled={!listo} onClick={proponer}>
                    Proponer
                  </button>
                </div>
              </div>

              {/* El mismo Chat de la columna lateral, sin una linea nueva */}
              <div className="ngChat">
                <Chat mensajes={mensajes} yoSoy={yoSoy} onEnviar={onEnviarMensaje} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Negociar;