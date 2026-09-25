import type { CSSProperties } from 'react';
import type { Jugadores } from '../common/jugador';
import { totalEnMano, totalRecursos, enRiesgoDeDescarte, colorDeJugador } from '../common/jugador';
import './infoJugadores.css';

interface Props {
  jugadores: Jugadores;
  ordenJugadores: string[];
  turnoActual: string;
  miSessionId: string;
}

function InfoJugadores({ jugadores, ordenJugadores, turnoActual, miSessionId }: Props) {
  // Si aún no hay orden, se usan los jugadores del mapa.
  const lista = ordenJugadores.length > 0 ? ordenJugadores : Object.keys(jugadores);

  return (
    <div className="ijLista">
      {lista.map((sessionId) => {
        const jugador = jugadores[sessionId];
        if (!jugador) return null;

                /* El backend no manda color: se asigna por la posicion en el orden de
           turnos, asi todos ven el mismo color para la misma persona. */
        const estilo = { '--color-jugador': colorDeJugador(lista, sessionId) } as CSSProperties;

        const clases = ['ijFicha'];
        if (sessionId === turnoActual) clases.push('ijTurno');
        if (sessionId === miSessionId) clases.push('ijYo');

        return (
          <div key={sessionId} className={clases.join(' ')} style={estilo}>
            {/* Cabecera: nombre y puntuación. */}
            <div className="ijCabecera">
              <span className="ijNombre">{sessionId === miSessionId && '(Yo)'}{jugador.nombre}</span>
              <span className="ijPuntos">{jugador.puntuacion}/{jugador.puntosParaGanar} pts.</span>
            </div>

            {/* Fila de números: total de cartas y recursos. */}
            <div className="ijMano">
              <span title="Cartas en la mano: recursos mas desarrollo">
                {totalEnMano(jugador)} cartas
              </span>
              <span
                title="De esas cartas, cuantas son de recurso"
                className={enRiesgoDeDescarte(jugador) ? 'ijRiesgo' : undefined}
              >
                {totalRecursos(jugador)} recursos
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default InfoJugadores;