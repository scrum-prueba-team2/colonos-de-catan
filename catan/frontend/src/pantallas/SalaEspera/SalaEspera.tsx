import { useState } from "react";
import type { Room } from "@colyseus/sdk";
import "./SalaEspera.css";

export interface JugadorVista {
  sessionId: string;
  nombre: string;
  score: number;
  esUsuarioActual: boolean;
  esSuTurno: boolean;
}

interface SalaEsperaProps {
  room: Room;
  jugadores: JugadorVista[];
  maxJugadores: number;
  minJugadores: number;
  esCreador: boolean;
  onIniciarPartida: () => void;
}

function iniciales(texto: string): string {
  return texto.slice(0, 2).toUpperCase();
}

function SalaEspera({
  room,
  jugadores,
  maxJugadores,
  minJugadores,
  esCreador,
  onIniciarPartida,
}: SalaEsperaProps) {
  const [codigoCopiado, setCodigoCopiado] = useState(false);
  const puedeIniciar = jugadores.length >= minJugadores;

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(room.roomId);
      setCodigoCopiado(true);
      setTimeout(() => setCodigoCopiado(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, no pasa nada grave.
    }
  }

  // Un "asiento" por cada cupo de la sala: si hay jugador lo mostramos,
  // si no, un espacio vacío pulsando para dar la sensación de que se está
  // esperando activamente.
  const asientos = Array.from({ length: maxJugadores }, (_, i) => jugadores[i] ?? null);

  return (
    <div className="sala-espera">
      <div className="sala-espera__card">
        <span className="sala-espera__estado">Sala de espera</span>
        <h1>Esperando jugadores</h1>
        <p className="sala-espera__contador">
          {jugadores.length} de {maxJugadores} jugadores conectados
        </p>

        <div className="sala-espera__barra">
          <div
            className="sala-espera__barra-relleno"
            style={{ width: `${(jugadores.length / maxJugadores) * 100}%` }}
          />
        </div>

        <ul className="sala-espera__asientos">
          {asientos.map((jugador, i) =>
            jugador ? (
              <li key={jugador.sessionId} className="sala-espera__asiento sala-espera__asiento--ocupado">
                <span className="sala-espera__avatar">{iniciales(jugador.nombre || jugador.sessionId)}</span>
                <span className="sala-espera__asiento-nombre">
                  {jugador.esUsuarioActual ? `${jugador.nombre} (Tú)` : jugador.nombre}
                </span>
              </li>
            ) : (
              <li key={`vacio-${i}`} className="sala-espera__asiento sala-espera__asiento--vacio">
                <span className="sala-espera__avatar sala-espera__avatar--vacio" />
                <span className="sala-espera__asiento-nombre">Esperando...</span>
              </li>
            )
          )}
        </ul>

        <button className="sala-espera__codigo" onClick={copiarCodigo}>
          Código de sala: <strong>{room.roomId}</strong>
          <span className="sala-espera__codigo-hint">
            {codigoCopiado ? "¡Copiado!" : "Copiar y compartir"}
          </span>
        </button>

        {esCreador ? (
          <>
            <button className="sala-espera__iniciar" onClick={onIniciarPartida} disabled={!puedeIniciar}>
              Iniciar partida
            </button>
            <p className="sala-espera__nota">
              {puedeIniciar
                ? "Puedes iniciar ahora o esperar a que se unan más jugadores."
                : `Se necesitan al menos ${minJugadores} jugadores para iniciar.`}
            </p>
          </>
        ) : (
          <p className="sala-espera__nota">Esperando a que el anfitrión inicie la partida.</p>
        )}
      </div>
    </div>
  );
}

export default SalaEspera;