import type { Jugadores } from '../common/jugador';
import { colorDeJugador } from '../common/jugador';

interface Props {
  sessionIdTurno: string;
  jugadores: Jugadores;
  ordenJugadores: string[];
}

function InfoTurno({ sessionIdTurno, jugadores, ordenJugadores }: Props) {
  const lista = ordenJugadores.length > 0 ? ordenJugadores : Object.keys(jugadores);
  const nombre = jugadores[sessionIdTurno]?.nombre;
  const color = colorDeJugador(lista, sessionIdTurno);

  return (
    <div
      className="flex-fill w-100 rounded overflow-hidden text-white
                 d-flex flex-column justify-content-center align-items-center"
      style={{ backgroundColor: color }}
      role="status"
      aria-live="polite"
    >
      <span className="small">Turno de</span>
      <span className="fw-bold text-truncate mw-100 px-2">{nombre ?? '—'}</span>
    </div>
  );
}

export default InfoTurno;