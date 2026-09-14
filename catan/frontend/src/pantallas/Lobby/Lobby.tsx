import { useEffect, useState } from "react";
import "./Lobby.css";
import { leerSalasRecientes, type SalaReciente } from "../salasRecientes";

export type SalaTipo = "publica" | "privada";

export interface SalaDisponible {
  id: string;
  nombre: string;
  tipo: SalaTipo;
  jugadores: number;
  maxJugadores: number;
  anfitrion: string;
  esTuSala?: boolean;
}

// Datos de prueba: mientras el backend no exponga un listado real de salas.
const SALAS_DE_PRUEBA: SalaDisponible[] = [
  { id: "a1B2c3", nombre: "Isla de Catán", tipo: "publica", jugadores: 2, maxJugadores: 4, anfitrion: "gSY1wq" },
  { id: "d4E5f6", nombre: "Partida rápida", tipo: "publica", jugadores: 3, maxJugadores: 4, anfitrion: "kLm9pQ" },
  { id: "g7H8i9", nombre: "Amigos del viernes", tipo: "privada", jugadores: 1, maxJugadores: 4, anfitrion: "aNa22x" },
  { id: "j1K2l3", nombre: "Solo para expertos", tipo: "privada", jugadores: 4, maxJugadores: 4, anfitrion: "trad3r" },
];

function salaDesdeReciente(reciente: SalaReciente): SalaDisponible {
  return {
    id: reciente.id,
    nombre: "Tu sala",
    tipo: "publica",
    jugadores: 1,
    maxJugadores: 4,
    anfitrion: "Tú",
    esTuSala: true,
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
  const [salasRecientes, setSalasRecientes] = useState<SalaReciente[]>([]);

  useEffect(() => {
    function actualizar() {
      setSalasRecientes(leerSalasRecientes());
    }

    actualizar();

    // Si creas una sala en otra pestaña del mismo navegador, esta pantalla
    // se actualiza sola gracias al evento "storage".
    window.addEventListener("storage", actualizar);
    return () => window.removeEventListener("storage", actualizar);
  }, []);

  const salas: SalaDisponible[] = [...salasRecientes.map(salaDesdeReciente), ...SALAS_DE_PRUEBA];

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

        {salas.length === 0 ? (
          <p className="lobby__vacio">No hay salas abiertas. Crea una para empezar a jugar.</p>
        ) : (
          <ul>
            {salas.map((sala) => (
              <li
                key={sala.id}
                className={
                  "lobby__sala" +
                  (sala.tipo === "privada" ? " lobby__sala--privada" : " lobby__sala--publica") +
                  (sala.esTuSala ? " lobby__sala--tuya" : "") +
                  (salaSeleccionada === sala.id ? " lobby__sala--seleccionada" : "")
                }
                onClick={() => seleccionarSala(sala)}
              >
                <div className="lobby__sala-info">
                  <div className="lobby__sala-nombre-fila">
                    <span className="lobby__sala-nombre">{sala.nombre}</span>
                    {sala.esTuSala ? (
                      <span className="lobby__badge lobby__badge--tuya">Tu sala</span>
                    ) : (
                      <span className={"lobby__badge lobby__badge--" + sala.tipo}>
                        {sala.tipo === "publica" ? "Pública" : "Privada"}
                      </span>
                    )}
                  </div>
                  <span className="lobby__sala-detalle">
                    {sala.esTuSala
                      ? "Se acaba de crear, esperando jugadores"
                      : `Anfitrión ${sala.anfitrion}, ${sala.jugadores} de ${sala.maxJugadores} jugadores`}
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