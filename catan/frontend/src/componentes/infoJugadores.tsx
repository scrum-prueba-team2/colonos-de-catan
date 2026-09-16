import type { CSSProperties } from 'react';
import type { Jugadores } from '../datos/jugadoresPrueba';
import { totalEnMano, totalRecursos, enRiesgoDeDescarte } from '../datos/jugadoresPrueba';
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

        // El color del jugador viaja como variable CSS.
        const estilo = { '--color-jugador': jugador.color } as CSSProperties;

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