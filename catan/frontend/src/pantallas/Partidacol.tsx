import { useState } from "react";
import type { Room } from "@colyseus/sdk";
import "./Partida.css";

export interface JugadorVista {
  sessionId: string;
  score: number;
  esUsuarioActual: boolean;
  esSuTurno: boolean;
}

interface ChatMessageVista {
  from: string;
  text: string;
  isPrivate: boolean;
}

interface PartidaProps {
  room: Room;
  jugadores: JugadorVista[];
  numeroDeTurno: number;
  esMiTurno: boolean;
  diceResult: string;
  turnHistory: string[];
  chatMessages: ChatMessageVista[];
  messageInput: string;
  setMessageInput: (valor: string) => void;
  privateMessageInput: string;
  setPrivateMessageInput: (valor: string) => void;
  privateReceiverInput: string;
  setPrivateReceiverInput: (valor: string) => void;
  onPasarTurno: () => void;
  onLanzarDado: () => void;
  onEnviarMensaje: () => void;
  onEnviarMensajePrivado: () => void;
}

function Partida({
  room,
  jugadores,
  numeroDeTurno,
  esMiTurno,
  diceResult,
  turnHistory,
  chatMessages,
  messageInput,
  setMessageInput,
  privateMessageInput,
  setPrivateMessageInput,
  privateReceiverInput,
  setPrivateReceiverInput,
  onPasarTurno,
  onLanzarDado,
  onEnviarMensaje,
  onEnviarMensajePrivado,
}: PartidaProps) {
  const [codigoCopiado, setCodigoCopiado] = useState(false);

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(room.roomId);
      setCodigoCopiado(true);
      setTimeout(() => setCodigoCopiado(false), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, no pasa nada grave.
    }
  }

  return (
    <div className="partida">
      <header className="partida__header">
        <h1>Catan Online</h1>
        <button className="partida__codigo" onClick={copiarCodigo}>
          Código de sala: <strong>{room.roomId}</strong>
          <span className="partida__codigo-hint">{codigoCopiado ? "¡Copiado!" : "Copiar"}</span>
        </button>
      </header>

      <div className="partida__grid">
        <div className="partida__columna">
          <section className="partida__card partida__card--turno">
            <span className="partida__turno-numero">Turno #{numeroDeTurno}</span>
            <p className="partida__turno-estado">
              {esMiTurno ? "Es tu turno" : "Esperando turno del otro jugador"}
            </p>

            <ul className="partida__jugadores">
              {jugadores.map((jugador) => (
                <li
                  key={jugador.sessionId}
                  className={"partida__jugador" + (jugador.esSuTurno ? " partida__jugador--activo" : "")}
                >
                  <span className="partida__jugador-nombre">
                    {jugador.esUsuarioActual ? "Tú" : jugador.sessionId}
                  </span>
                  <span className="partida__jugador-score">{jugador.score} pts</span>
                </li>
              ))}
            </ul>

            <button className="partida__btn-primario" onClick={onPasarTurno} disabled={!esMiTurno}>
              Jugar (+1 punto)
            </button>
          </section>

          <section className="partida__card">
            <h2>Lanzar dado</h2>
            <button className="partida__btn-secundario" onClick={onLanzarDado} disabled={!esMiTurno}>
              Lanzar dado
            </button>
            {diceResult && <p className="partida__dado-resultado">{diceResult}</p>}

            {turnHistory.length > 0 && (
              <ul className="partida__historial">
                {turnHistory
                  .slice()
                  .reverse()
                  .map((linea, i) => (
                    <li key={i}>{linea}</li>
                  ))}
              </ul>
            )}
          </section>
        </div>

        <div className="partida__columna">
          <section className="partida__card partida__card--chat">
            <h2>Chat</h2>
            <ul className="partida__mensajes">
              {chatMessages.length === 0 && (
                <li className="partida__mensajes-vacio">Aún no hay mensajes.</li>
              )}
              {chatMessages.map((m, i) => (
                <li key={i} className={m.isPrivate ? "partida__mensaje--privado" : ""}>
                  <strong>
                    {m.isPrivate ? "Privado de " : ""}
                    {m.from}:
                  </strong>{" "}
                  {m.text}
                </li>
              ))}
            </ul>
            <div className="partida__chat-input">
              <input
                type="text"
                placeholder="Escribe tu mensaje"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onEnviarMensaje()}
              />
              <button className="partida__btn-secundario" onClick={onEnviarMensaje}>
                Enviar
              </button>
            </div>
          </section>

          <section className="partida__card">
            <h2>Mensaje privado</h2>
            <div className="partida__privado-inputs">
              <input
                type="text"
                placeholder="Mensaje"
                value={privateMessageInput}
                onChange={(e) => setPrivateMessageInput(e.target.value)}
              />
              <input
                type="text"
                placeholder="ID del jugador"
                value={privateReceiverInput}
                onChange={(e) => setPrivateReceiverInput(e.target.value)}
              />
            </div>
            <button className="partida__btn-secundario" onClick={onEnviarMensajePrivado}>
              Enviar mensaje privado
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Partida;