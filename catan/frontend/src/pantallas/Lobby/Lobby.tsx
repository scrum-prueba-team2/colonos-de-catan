import { useEffect, useState } from "react";
import type { RoomAvailable } from "@colyseus/sdk";
import "./Lobby.css";
import { client } from "../colyseusClient";

export type SalaTipo = "publica" | "privada";

export interface SalaDisponible {
  id: string;
  nombre: string;
  tipo: SalaTipo;
  jugadores: number;
  maxJugadores: number;
  anfitrion: string;
}

// Metadata que CatanRoom publica con setMetadata (ver onCreate en el backend).
interface MetadataSala {
  alias?: string;
  estado?: string;
  privada?: boolean;
  anfitrion?: string;
}

type EstadoConexion = "conectando" | "conectado" | "error";

function salaDesdeListado(sala: RoomAvailable<MetadataSala>): SalaDisponible {
  return {
    id: sala.roomId,
    nombre: sala.metadata?.alias || "Catan Room",
    tipo: sala.metadata?.privada ? "privada" : "publica",
    jugadores: sala.clients,
    maxJugadores: sala.maxClients,
    anfitrion: sala.metadata?.anfitrion || "",
  };
}

interface LobbyProps {
  onCrearSala: () => void;
  onUnirseASala: (codigo: string) => void;
  onVolver?: () => void;
}

function Lobby({ onCrearSala, onUnirseASala, onVolver }: LobbyProps) {
  const [codigoInput, setCodigoInput] = useState("");
  const [salaSeleccionada, setSalaSeleccionada] = useState<string | null>(null);
  const [listado, setListado] = useState<RoomAvailable<MetadataSala>[]>([]);
  const [conexion, setConexion] = useState<EstadoConexion>("conectando");

  useEffect(() => {
    // Nos unimos a la LobbyRoom del backend, que envía el listado completo al
    // entrar ("rooms") y luego avisa cada vez que una sala aparece o cambia
    // ("+") o se elimina ("-").
    // Ojo: no filtramos por metadata en el servidor porque, al cambiar el
    // estado a "EN JUEGO", la LobbyRoom no envía "-" (compara la sala con
    // ella misma). Sí envía "+" con los datos nuevos, así que filtramos aquí.
    let cancelado = false;
    let salaLobby: Awaited<ReturnType<typeof client.joinOrCreate>> | null = null;

    client
      .joinOrCreate("lobby", { filter: { name: "catan" } })
      .then((sala) => {
        // En modo estricto React monta, desmonta y vuelve a montar el
        // componente; si ya nos desmontaron, salimos de inmediato.
        if (cancelado) {
          sala.leave();
          return;
        }
        salaLobby = sala;
        setConexion("conectado");

        sala.onMessage("rooms", (salas: RoomAvailable<MetadataSala>[]) => setListado(salas));

        sala.onMessage("+", ([roomId, datos]: [string, RoomAvailable<MetadataSala>]) => {
          setListado((prev) => {
            const indice = prev.findIndex((s) => s.roomId === roomId);
            if (indice === -1) return [...prev, datos];
            const copia = [...prev];
            copia[indice] = datos;
            return copia;
          });
        });

        sala.onMessage("-", (roomId: string) => {
          setListado((prev) => prev.filter((s) => s.roomId !== roomId));
        });
      })
      .catch((error) => {
        console.error("Error conectando al lobby:", error);
        if (!cancelado) setConexion("error");
      });

    return () => {
      cancelado = true;
      salaLobby?.leave();
    };
  }, []);

  // Solo mostramos salas que todavía esperan jugadores.
  const salas: SalaDisponible[] = listado
    .filter((sala) => sala.metadata?.estado === "EN LOBBY" && sala.clients < sala.maxClients)
    .map(salaDesdeListado);

  function seleccionarSala(sala: SalaDisponible) {
    setSalaSeleccionada(sala.id);
    setCodigoInput(sala.id);
  }

  function unirse() {
    const codigo = codigoInput.trim();
    if (codigo) onUnirseASala(codigo);
  }

  return (
    <div className="lobby">
      {onVolver && (
        <button className="lobby__volver" onClick={onVolver}>
          ← Volver
        </button>
      )}

      <header className="lobby__header">
        <h1>Lobby de partidas</h1>
        <p>Elige una sala para unirte, o crea la tuya.</p>
      </header>

      <div className="lobby__manual">
        <input
          type="text"
          placeholder="Código de sala"
          value={codigoInput}
          onChange={(e) => {
            setCodigoInput(e.target.value);
            setSalaSeleccionada(null);
          }}
        />
        <button className="lobby__btn-secondary" onClick={unirse} disabled={!codigoInput.trim()}>
          Unirse
        </button>
      </div>

      <section className="lobby__lista">
        <h2>Salas disponibles</h2>

        {conexion === "conectando" ? (
          <p className="lobby__vacio">Buscando salas...</p>
        ) : conexion === "error" ? (
          <p className="lobby__vacio">No se pudo conectar con el servidor. Revisa que el backend esté encendido.</p>
        ) : salas.length === 0 ? (
          <p className="lobby__vacio">No hay salas abiertas. Crea una para empezar a jugar.</p>
        ) : (
          <ul>
            {salas.map((sala) => (
              <li
                key={sala.id}
                className={
                  "lobby__sala" +
                  (sala.tipo === "privada" ? " lobby__sala--privada" : " lobby__sala--publica") +
                  (salaSeleccionada === sala.id ? " lobby__sala--seleccionada" : "")
                }
                onClick={() => seleccionarSala(sala)}
              >
                <div className="lobby__sala-info">
                  <div className="lobby__sala-nombre-fila">
                    <span className="lobby__sala-nombre">{sala.nombre}</span>
                    <span className={"lobby__badge lobby__badge--" + sala.tipo}>
                      {sala.tipo === "publica" ? "Pública" : "Privada"}
                    </span>
                  </div>
                  <span className="lobby__sala-detalle">
                    {sala.anfitrion ? `Anfitrión ${sala.anfitrion}, ` : ""}
                    {sala.jugadores} de {sala.maxJugadores} jugadores
                  </span>
                </div>

                <button
                  className="lobby__btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnirseASala(sala.id);
                  }}
                >
                  Unirse
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button className="lobby__btn-crear" onClick={onCrearSala}>
        Crear nueva sala
      </button>
    </div>
  );
}

export default Lobby;