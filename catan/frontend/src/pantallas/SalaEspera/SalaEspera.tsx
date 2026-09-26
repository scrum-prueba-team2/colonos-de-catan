import { useEffect, useRef, useState } from "react";
import type { Room } from "@colyseus/sdk";
import "./SalaEspera.css";
import Decoracion from "../Decoracion/Decoracion";
import { COLORES } from "../../common/jugador";
import type { InfoSala } from "../sesionGuardada";

export interface JugadorVista {
  sessionId: string;
  nombre: string;
  score: number;
  esUsuarioActual: boolean;
  esSuTurno: boolean;
}

interface SalaEsperaProps {
  room: Room;
  // Alias, privacidad y código: el cliente no los recibe en el estado, así
  // que Navegacion los guarda al crear o entrar. Puede ser null si faltan.
  infoSala: InfoSala | null;
  jugadores: JugadorVista[];
  maxJugadores: number;
  minJugadores: number;
  esCreador: boolean;
  onIniciarPartida: () => void;
  onSalir: () => void;
}

function iniciales(texto: string): string {
  return texto.slice(0, 2).toUpperCase();
}

type Copiado = "id" | "codigo" | null;

function SalaEspera({
  room,
  infoSala,
  jugadores,
  maxJugadores,
  minJugadores,
  esCreador,
  onIniciarPartida,
  onSalir,
}: SalaEsperaProps) {
  const [copiado, setCopiado] = useState<Copiado>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const puedeIniciar = jugadores.length >= minJugadores;

  useEffect(() => () => {
    if (temporizador.current) clearTimeout(temporizador.current);
  }, []);

  async function copiar(texto: string, cual: Exclude<Copiado, null>) {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(cual);
      if (temporizador.current) clearTimeout(temporizador.current);
      temporizador.current = setTimeout(() => setCopiado(null), 2000);
    } catch {
      // Si el navegador bloquea el portapapeles, el texto sigue visible
      // y se puede copiar a mano.
    }
  }

  // Un "asiento" por cada cupo de la sala: si hay jugador lo mostramos,
  // si no, un espacio vacío pulsando para dar la sensación de que se está
  // esperando activamente.
  const asientos = Array.from({ length: maxJugadores }, (_, i) => jugadores[i] ?? null);

  return (
    <div className="sala-espera tema-fondo">
      <Decoracion />

      <div className="sala-espera__card tema-pergamino tema-aparecer">
        <div className="sala-espera__superior">
          <span className="tema-insignia tema-insignia--marca">⏳ Sala de espera</span>
          {infoSala && (
            <span className={"tema-insignia tema-insignia--" + (infoSala.privada ? "privada" : "publica")}>
              {infoSala.privada ? "🔒 Privada" : "🌍 Pública"}
            </span>
          )}
        </div>

        <h1>{infoSala?.alias || "Esperando jugadores"}</h1>
        <p className="sala-espera__contador">
          <strong>{jugadores.length}</strong> de {maxJugadores} colonos en la isla
        </p>

        {/* Barra de progreso hecha de tramos de camino, uno por asiento. */}
        <div className="sala-espera__barra" aria-hidden="true">
          {asientos.map((jugador, i) => (
            <span
              key={i}
              className={"sala-espera__tramo" + (jugador ? " sala-espera__tramo--lleno" : "")}
              style={jugador ? { background: COLORES[i % COLORES.length] } : undefined}
            />
          ))}
        </div>

        <ul className="sala-espera__asientos">
          {asientos.map((jugador, i) =>
            jugador ? (
              <li key={jugador.sessionId} className="sala-espera__asiento sala-espera__asiento--ocupado">
                <span
                  className="tema-hex sala-espera__avatar"
                  style={{ background: COLORES[i % COLORES.length] }}
                >
                  {iniciales(jugador.nombre || jugador.sessionId)}
                </span>
                <span className="sala-espera__asiento-nombre" title={jugador.nombre}>
                  {jugador.nombre}
                </span>
                {jugador.esUsuarioActual && <span className="sala-espera__tu">Tú</span>}
              </li>
            ) : (
              <li key={`vacio-${i}`} className="sala-espera__asiento sala-espera__asiento--vacio">
                <span className="tema-hex sala-espera__avatar sala-espera__avatar--vacio">?</span>
                <span className="sala-espera__asiento-nombre">Esperando…</span>
              </li>
            )
          )}
        </ul>

        <div className="sala-espera__compartir">
          <div className="sala-espera__dato">
            <span className="sala-espera__dato-etiqueta">Identificador de sala</span>
            <code className="sala-espera__dato-valor">{room.roomId}</code>
            <button
              className="tema-btn tema-btn--chico tema-btn--pergamino sala-espera__copiar"
              onClick={() => copiar(room.roomId, "id")}
              aria-label="Copiar identificador de sala"
            >
              {copiado === "id" ? "✔ ¡Copiado!" : "📋 Copiar"}
            </button>
          </div>

          {/* El código solo lo conoce quien lo escribió (creador o quien entró con él). */}
          {infoSala?.privada && infoSala.codigoAcceso && (
            <div className="sala-espera__dato sala-espera__dato--codigo">
              <span className="sala-espera__dato-etiqueta">Código de acceso</span>
              <code className="sala-espera__dato-valor">{infoSala.codigoAcceso}</code>
              <button
                className="tema-btn tema-btn--chico tema-btn--pergamino sala-espera__copiar"
                onClick={() => copiar(infoSala.codigoAcceso ?? "", "codigo")}
                aria-label="Copiar código de acceso"
              >
                {copiado === "codigo" ? "✔ ¡Copiado!" : "📋 Copiar"}
              </button>
            </div>
          )}
        </div>

        {esCreador ? (
          <>
            <button
              className="sala-espera__iniciar tema-btn tema-btn--bosque tema-btn--ancho"
              onClick={onIniciarPartida}
              disabled={!puedeIniciar}
            >
              🎲 Iniciar partida
            </button>
            <p className="sala-espera__nota">
              {puedeIniciar
                ? "Puedes iniciar ahora o esperar a que se unan más jugadores."
                : `Se necesitan al menos ${minJugadores} jugadores para iniciar.`}
            </p>
          </>
        ) : (
          <p className="sala-espera__nota sala-espera__nota--espera">Esperando a que el anfitrión inicie la partida…</p>
        )}

        <button className="sala-espera__salir" onClick={onSalir}>
          Salir de la sala
        </button>
      </div>
    </div>
  );
}

export default SalaEspera;
