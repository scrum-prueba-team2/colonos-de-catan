import type { Jugadores } from '../common/jugador';
import { totalCartas, totalRecursos, enRiesgoDeDescarte, colorDeJugador } from '../common/jugador';

interface Props {
  jugadores: Jugadores;
  ordenJugadores: string[];
  turnoActual: string;
  miSessionId: string;
}

function InfoJugadores({ jugadores, ordenJugadores, turnoActual, miSessionId }: Props) {
  const lista = ordenJugadores.length > 0 ? ordenJugadores : Object.keys(jugadores);

  return (
    <div className="d-flex gap-1 w-100 h-100">
      {lista.map((id) => {
        const j = jugadores[id];
        if (!j) return null;

        const color = colorDeJugador(lista, id);
        const turno = id === turnoActual;
        const yo = id === miSessionId;

        return (
          <div
            key={id}
            style={{
              backgroundColor: color,
              borderStyle: 'solid',
              borderWidth: 3,
              borderColor: turno ? '#fefefe' : 'transparent',
              borderRadius: 12,
            }}
            className="flex-fill min-w-0 overflow-hidden py-1 px-2
                       d-flex flex-column justify-content-center small text-dark"
          >
            <div className="d-flex align-items-center gap-1 min-w-0">
              <span className={`flex-grow-1 text-truncate fw-semibold ${yo ? 'fw-bold' : ''}`}>
                {yo && '(Yo)'}{j.nombre}
              </span>
              <span className="fw-bold flex-shrink-0">
                {j.puntuacion}/10
              </span>
            </div>
            <div className="d-flex justify-content-between text-muted">
              <span title="Cartas de desarrollo en la mano, usables mas inusables">
                {totalCartas(j)} cartas
              </span>
              <span title="Caballeros jugados. Decide el ejercito mas grande">
                {j.caballerosJugados} caballeros
              </span>
              <span
                title="Cartas de recurso en la mano"
                className={enRiesgoDeDescarte(j) ? 'text-warning fw-bold' : ''}
              >
                {totalRecursos(j)} recursos
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InfoJugadores;