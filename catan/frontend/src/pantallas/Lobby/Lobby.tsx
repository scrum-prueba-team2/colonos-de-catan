import { useEffect, useState, type FormEvent } from "react";
import type { RoomAvailable } from "@colyseus/sdk";
import "./Lobby.css";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { client } from "../colyseusClient";
import type { InfoSala } from "../sesionGuardada";
import { ERROR_CODIGO_INCORRECTO, LARGO_MAXIMO_CODIGO, validarCodigoAcceso } from "../validacionSala";

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

// Sala a la que se le está pidiendo el código de acceso.
interface SalaPorCodigo {
  id: string;
  nombre: string;
}

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
  // Devuelve null si se entró a la sala, o el mensaje de error a mostrar.
  onUnirseASala: (id: string, info: InfoSala) => Promise<string | null>;
  onVolver?: () => void;
}

function Lobby({ onCrearSala, onUnirseASala, onVolver }: LobbyProps) {
  const [idInput, setIdInput] = useState("");
  const [salaSeleccionada, setSalaSeleccionada] = useState<string | null>(null);
  const [listado, setListado] = useState<RoomAvailable<MetadataSala>[]>([]);
  const [conexion, setConexion] = useState<EstadoConexion>("conectando");
  // id de la sala a la que se está entrando, para bloquear clics repetidos.
  const [uniendo, setUniendo] = useState<string | null>(null);
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);

  // Diálogo del código de acceso.
  const [salaPorCodigo, setSalaPorCodigo] = useState<SalaPorCodigo | null>(null);
  const [codigoAcceso, setCodigoAcceso] = useState("");
  const [errorCodigo, setErrorCodigo] = useState<string | null>(null);

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

  // Escape cierra el diálogo del código.
  useEffect(() => {
    if (!salaPorCodigo) return;
    function alPresionarTecla(e: KeyboardEvent) {
      if (e.key === "Escape") cerrarDialogo();
    }
    window.addEventListener("keydown", alPresionarTecla);
    return () => window.removeEventListener("keydown", alPresionarTecla);
  }, [salaPorCodigo]);

  const todasLasSalas = listado.map(salaDesdeListado);

  // Solo mostramos salas que todavía esperan jugadores.
  const salas: SalaDisponible[] = listado
    .filter((sala) => sala.metadata?.estado === "EN LOBBY" && sala.clients < sala.maxClients)
    .map(salaDesdeListado);

  function seleccionarSala(sala: SalaDisponible) {
    setSalaSeleccionada(sala.id);
    setIdInput(sala.id);
  }

  function abrirDialogo(sala: SalaPorCodigo, error: string | null = null) {
    setSalaPorCodigo(sala);
    setCodigoAcceso("");
    setErrorCodigo(error);
  }

  function cerrarDialogo() {
    setSalaPorCodigo(null);
    setCodigoAcceso("");
    setErrorCodigo(null);
  }

  async function intentarUnirse(id: string) {
    if (uniendo) return;
    const sala = todasLasSalas.find((s) => s.id === id);

    // Las privadas piden el código antes de intentar entrar.
    if (sala?.tipo === "privada") {
      abrirDialogo({ id, nombre: sala.nombre });
      return;
    }

    setUniendo(id);
    setErrorGeneral(null);
    const error = await onUnirseASala(id, { alias: sala?.nombre ?? "", privada: false });
    // Sin error Navegacion ya cambió de pantalla y este componente no existe.
    if (!error) return;
    setUniendo(null);

    // Una sala escrita a mano que no está en el listado puede ser privada:
    // el backend la rechaza y entonces sí pedimos el código.
    if (error === ERROR_CODIGO_INCORRECTO) {
      abrirDialogo({ id, nombre: sala?.nombre ?? "" }, "Esta sala es privada: escribe su código de acceso.");
    } else {
      setErrorGeneral(error);
    }
  }

  async function enviarCodigo(e: FormEvent) {
    e.preventDefault();
    if (!salaPorCodigo || uniendo) return;

    const errorFormato = validarCodigoAcceso(codigoAcceso);
    if (errorFormato) {
      setErrorCodigo(errorFormato);
      return;
    }

    setUniendo(salaPorCodigo.id);
    setErrorCodigo(null);
    const error = await onUnirseASala(salaPorCodigo.id, {
      alias: salaPorCodigo.nombre,
      privada: true,
      codigoAcceso,
    });
    if (!error) return;
    setUniendo(null);
    setErrorCodigo(error);
  }

  function unirseManual() {
    const id = idInput.trim();
    if (id) intentarUnirse(id);
  }

  return (
    <div className="bg-info-subtle min-vh-100 px-3 py-4">
      <div className="mx-auto d-flex flex-column align-items-start lobby__contenido">
        {onVolver && (
          <Button variant="text" onClick={onVolver}>
            ← Volver
          </Button>
        )}

        <header className="mt-4 mb-4">
          <Typography variant="h4" component="h1" gutterBottom>
            Puerto de partidas
          </Typography>
          <p className="mb-0 text-body-secondary">Elige una sala para zarpar, o funda la tuya.</p>
        </header>

        <form
          className="lobby__manual tema-pergamino"
          onSubmit={(e) => {
            e.preventDefault();
            unirseManual();
          }}
        >
          <label className="tema-etiqueta lobby__manual-etiqueta" htmlFor="id-sala">
            ¿Te pasaron el identificador de una sala?
          </label>
          <div className="lobby__manual-fila">
            <input
              id="id-sala"
              className="tema-input lobby__manual-input"
              type="text"
              placeholder="Identificador de sala"
              value={idInput}
              autoComplete="off"
              spellCheck={false}
              onChange={(e) => {
                setIdInput(e.target.value);
                setSalaSeleccionada(null);
              }}
            />
            <button type="submit" className="tema-btn" disabled={!idInput.trim() || uniendo !== null}>
              Unirse
            </button>
          </div>
        </form>

        {errorGeneral && (
          <p className="tema-aviso lobby__aviso" role="alert">
            ⚠️ {errorGeneral}
          </p>
        )}

        <section className="lobby__lista">
          <div className="lobby__lista-cabecera">
            <h2>Salas disponibles</h2>
            {conexion === "conectado" && (
              <span className="lobby__en-vivo">
                <span className="lobby__en-vivo-punto" aria-hidden="true" /> En vivo
              </span>
            )}
          </div>

          {conexion === "conectando" ? (
            <p className="lobby__vacio tema-pergamino">⛵ Buscando salas…</p>
          ) : conexion === "error" ? (
            <p className="lobby__vacio tema-pergamino">
              🌊 No se pudo conectar con el servidor. Revisa que el backend esté encendido.
            </p>
          ) : salas.length === 0 ? (
            <p className="lobby__vacio tema-pergamino">🏝️ No hay salas abiertas. ¡Crea una para empezar a jugar!</p>
          ) : (
            <ul>
              {salas.map((sala, i) => (
                <li
                  key={sala.id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                  className={
                    "lobby__sala tema-pergamino lobby__sala--" +
                    sala.tipo +
                    (salaSeleccionada === sala.id ? " lobby__sala--seleccionada" : "")
                  }
                  onClick={() => seleccionarSala(sala)}
                >
                  <div className="lobby__sala-info">
                    <div className="lobby__sala-nombre-fila">
                      <span className="lobby__sala-nombre">{sala.nombre}</span>
                      <span className={"tema-insignia tema-insignia--" + sala.tipo}>
                        {sala.tipo === "publica" ? "🌍 Pública" : "🔒 Privada"}
                      </span>
                    </div>
                    <span className="lobby__sala-detalle">
                      {sala.anfitrion ? `Anfitrión: ${sala.anfitrion}` : "Sin anfitrión"}
                    </span>
                    <span
                      className="lobby__cupos"
                      aria-label={`${sala.jugadores} de ${sala.maxJugadores} jugadores`}
                    >
                      {Array.from({ length: sala.maxJugadores }, (_, n) => (
                        <span
                          key={n}
                          className={"lobby__cupo" + (n < sala.jugadores ? " lobby__cupo--lleno" : "")}
                          aria-hidden="true"
                        />
                      ))}
                      <span className="lobby__cupos-texto" aria-hidden="true">
                        {sala.jugadores}/{sala.maxJugadores}
                      </span>
                    </span>
                  </div>

                  <button
                    className={"tema-btn tema-btn--chico" + (sala.tipo === "privada" ? " tema-btn--ladrillo" : "")}
                    disabled={uniendo !== null}
                    onClick={(e) => {
                      e.stopPropagation();
                      intentarUnirse(sala.id);
                    }}
                  >
                    {uniendo === sala.id ? "Entrando…" : sala.tipo === "privada" ? "🔑 Unirse" : "Unirse"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <button className="lobby__btn-crear tema-btn tema-btn--ladrillo tema-btn--ancho" onClick={onCrearSala}>
          🏗️ Crear nueva sala
        </button>
      </div>

      {salaPorCodigo && (
        <div className="lobby__dialogo-fondo" onClick={cerrarDialogo}>
          <form
            className="lobby__dialogo tema-pergamino"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialogo-codigo-titulo"
            onClick={(e) => e.stopPropagation()}
            onSubmit={enviarCodigo}
            noValidate
          >
            <span className="lobby__dialogo-candado" aria-hidden="true">
              🔒
            </span>
            <h2 id="dialogo-codigo-titulo">Sala privada</h2>
            <p>
              {salaPorCodigo.nombre ? (
                <>
                  Para entrar a <strong>{salaPorCodigo.nombre}</strong> necesitas su código de acceso.
                </>
              ) : (
                "Para entrar a esta sala necesitas su código de acceso."
              )}
            </p>

            <label className="tema-etiqueta" htmlFor="codigo-acceso">
              Código de acceso
            </label>
            <input
              id="codigo-acceso"
              className={"tema-input lobby__dialogo-codigo" + (errorCodigo ? " tema-input--error" : "")}
              type="text"
              placeholder="Ej. OVEJA7"
              value={codigoAcceso}
              maxLength={LARGO_MAXIMO_CODIGO}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              aria-invalid={Boolean(errorCodigo)}
              aria-describedby="codigo-acceso-ayuda"
              onChange={(e) => {
                setCodigoAcceso(e.target.value.replace(/\s/g, ""));
                setErrorCodigo(null);
              }}
            />
            <span className="tema-ayuda" id="codigo-acceso-ayuda">
              <span className={errorCodigo ? "tema-error" : ""}>
                {errorCodigo ?? "Pídeselo al anfitrión. Distingue mayúsculas."}
              </span>
            </span>

            <div className="lobby__dialogo-acciones">
              <button type="button" className="tema-btn tema-btn--pergamino" onClick={cerrarDialogo}>
                Cancelar
              </button>
              <button type="submit" className="tema-btn tema-btn--ladrillo" disabled={!codigoAcceso || uniendo !== null}>
                {uniendo ? "Entrando…" : "Entrar"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Lobby;
