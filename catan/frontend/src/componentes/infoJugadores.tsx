import type { Jugadores } from '../common/jugador';
import { totalEnMano, totalRecursos, enRiesgoDeDescarte, colorDeJugador } from '../common/jugador';

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
            style={turno
              ? { backgroundColor: color, borderColor: color, borderLeft: `0.5rem solid ${color}` }
              : { borderLeft: `0.5rem solid ${color}` }}
            className={`flex-fill min-w-0 overflow-hidden rounded border py-1 px-2
                        d-flex flex-column justify-content-center small
                        ${turno ? 'text-white' : ''}`}
          >
            <div className="d-flex align-items-center gap-1 min-w-0">
              <span className={`flex-grow-1 text-truncate fw-semibold ${yo ? 'fw-bold' : ''}`}>
                {yo && '(Yo)'}{j.nombre}
              </span>
              <span className="fw-bold flex-shrink-0">
                {j.puntuacion}/{j.puntosParaGanar}
              </span>
            </div>
            <div className={`d-flex justify-content-between ${turno ? 'text-white-50' : 'text-muted'}`}>
              <span title="Cartas en la mano">{totalEnMano(j)} cartas</span>
              <span
                title="De esas, cuántas son de recurso"
                className={enRiesgoDeDescarte(j) ? 'text-warning fw-bold' : ''}
              >
                {totalRecursos(j)} rec.
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InfoJugadores;