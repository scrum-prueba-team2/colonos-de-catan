import { useEffect, useState } from "react";
import type { Room } from "@colyseus/sdk";
import { client } from "./pantallas/colyseusClient";
import Home from "./pantallas/Home/Home";
import ElegirModo from "./pantallas/ElegirModo/ElegirModo";
import Lobby from "./pantallas/Lobby/Lobby";
import IngresarNombre from "./pantallas/IngresarNombre/IngresarNombre";
import SalaEspera, { type JugadorVista } from "./pantallas/SalaEspera/SalaEspera";
import PartidaTablero from "./pantallas/Partida";
import { FASE_PARTIDA } from "./common/fases";

const MAX_JUGADORES = 4;
// El backend rechaza msgIniciarPartida con menos de 2 jugadores.
const MIN_JUGADORES = 2;

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
  const [fase, setFase] = useState<number>(FASE_PARTIDA.LOBBY);
  const [creador, setCreador] = useState("");

  // La partida empieza cuando el backend deja de estar en LOBBY (lo cambia
  // msgIniciarPartida), así todos los clientes avanzan a la vez.
  const partidaIniciada = fase !== FASE_PARTIDA.LOBBY;
  const esCreador = room !== null && creador === room.sessionId;

  useEffect(() => {
    if (!room) return;
    const salaActual = room;

    function sincronizarEstado(state: EstadoDeSala) {
      if (!state || !state.jugadores || !state.partida) return;

      setFase(state.partida.fase);
      setCreador(state.partida.creador);

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

  if (!partidaIniciada) {
    return (
      <SalaEspera
        room={room}
        jugadores={jugadores}
        maxJugadores={MAX_JUGADORES}
        minJugadores={MIN_JUGADORES}
        esCreador={esCreador}
        onIniciarPartida={() => room.send("msgIniciarPartida")}
      />
    );
  }

  // No entiendo que tanto hay aqui asi que prefiero no tocar nada
  // pero el tablero ya se genera desde el backend
  if (room) return <PartidaTablero sala={room} />;


  
}

export default Navegacion;