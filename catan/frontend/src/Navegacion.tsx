import { useEffect, useState } from "react";
import type { Room } from "@colyseus/sdk";
import { client } from "./pantallas/colyseusClient";
import Home from "./pantallas/Home/Home";
import ElegirModo from "./pantallas/ElegirModo/ElegirModo";
import Lobby from "./pantallas/Lobby/Lobby";
import IngresarNombre from "./pantallas/IngresarNombre/IngresarNombre";
import SalaEspera, { type JugadorVista } from "./pantallas/SalaEspera/SalaEspera";
import PartidaTablero from "./pantallas/Partida";

const MAX_JUGADORES = 4;

interface JugadorEstado {
  nombre: string;
  puntuacion: number;
}

interface EstadoDeSala {
  partida: {
    fase: number;
    turnoActual: string;
    creador: string;
  };
  jugadores: {
    forEach: (callback: (jugador: JugadorEstado, sessionId: string) => void) => void;
  };
}

type Vista = "inicio" | "nombre" | "elegir" | "lobby";

function Navegacion() {
  const [vista, setVista] = useState<Vista>("inicio");
  // El nombre vive solo en memoria: al recargar la página se vuelve a pedir.
  const [nombreJugador, setNombreJugador] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [jugadores, setJugadores] = useState<JugadorVista[]>([]);

  // Regla de negocio del frontend: con 4 jugadores conectados se pasa a
  // la partida, sin depender de que el backend cambie state.partida.fase
  // (por ahora esa fase nunca avanza porque el backend no tiene registrado
  // el handler de iniciar partida).
  const salaCompleta = jugadores.length >= MAX_JUGADORES;

  useEffect(() => {
    if (!room) return;
    const salaActual = room;

    function sincronizarEstado(state: EstadoDeSala) {
      if (!state || !state.jugadores || !state.partida) return;


      const listaJugadores: JugadorVista[] = [];
      state.jugadores.forEach((jugador, sessionId) => {
        listaJugadores.push({
          sessionId,
          nombre: jugador.nombre,
          score: jugador.puntuacion,
          esUsuarioActual: sessionId === salaActual.sessionId,
          esSuTurno: sessionId === state.partida.turnoActual,
        });
      });
      setJugadores(listaJugadores);
    }

    sincronizarEstado(salaActual.state as unknown as EstadoDeSala);
    salaActual.onStateChange((state: EstadoDeSala) => sincronizarEstado(state));

    salaActual.onMessage("error", (err: { mensajeError: string }) => {
      alert(err.mensajeError);
    });
  }, [room]);

  async function crearSala() {
    try {
      const nuevaSala = await client.create("catan", { nombre: nombreJugador });
      setRoom(nuevaSala);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }

  async function unirseASala(codigo: string) {
    try {
      const nuevaSala = await client.joinById(codigo, { nombre: nombreJugador });
      setRoom(nuevaSala);
    } catch (error) {
      console.error("Error connecting to room:", error);
    }
  }

 

  if (!room) {
    if (vista === "inicio") {
      return <Home onAbrirMenu={() => setVista(nombreJugador ? "elegir" : "nombre")} />;
    }

    if (vista === "nombre") {
      return (
        <IngresarNombre
          nombreInicial={nombreJugador}
          onConfirmar={(nombre) => {
            setNombreJugador(nombre);
            setVista("elegir");
          }}
        />
      );
    }

    if (vista === "elegir") {
      return (
        <ElegirModo onCrear={crearSala} onUnirse={() => setVista("lobby")} onVolver={() => setVista("inicio")} />
      );
    }

    return <Lobby onCrearSala={crearSala} onUnirseASala={unirseASala} onVolver={() => setVista("elegir")} />;
  }

  if (!salaCompleta) {
    return <SalaEspera room={room} jugadores={jugadores} maxJugadores={MAX_JUGADORES} />;
  }

  // No entiendo que tanto hay aqui asi que prefiero no tocar nada
  // pero el tablero ya se genera desde el backend
  if (room) return <PartidaTablero sala={room} />;


  
}

export default Navegacion;