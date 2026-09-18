import { useEffect, useState } from "react";
import type { Room } from "@colyseus/sdk";
import { client } from "./pantallas/colyseusClient";
import Home from "./pantallas/Home/Home";
import ElegirModo from "./pantallas/ElegirModo/ElegirModo";
import Lobby from "./pantallas/Lobby/Lobby";
import SalaEspera from "./pantallas/SalaEspera/SalaEspera";
import Partida, { type JugadorVista } from "./pantallas/PartidaCol/Partidacol";
import { guardarSalaReciente } from "./pantallas/salasRecientes";

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

type Vista = "inicio" | "elegir" | "lobby";

function Navegacion() {
  const [vista, setVista] = useState<Vista>("inicio");
  const [room, setRoom] = useState<Room | null>(null);
  const [turnoActual, setTurnoActual] = useState("");
  const [jugadores, setJugadores] = useState<JugadorVista[]>([]);

  // Chat / dado son solo de exhibición: el backend aún no tiene
  // registrados los onMessage correspondientes (ver CatanRoom.ts),
  // así que estos estados se quedan vacíos por ahora.
  const [diceResult] = useState("");
  const [turnHistory] = useState<string[]>([]);
  const [chatMessages] = useState<{ from: string; text: string; isPrivate: boolean }[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [privateMessageInput, setPrivateMessageInput] = useState("");
  const [privateReceiverInput, setPrivateReceiverInput] = useState("");

  const esMiTurno = room !== null && turnoActual === room.sessionId;

  // Regla de negocio del frontend: con 4 jugadores conectados se pasa a
  // PartidaCol, sin depender de que el backend cambie state.partida.fase
  // (por ahora esa fase nunca avanza porque el backend no tiene registrado
  // el handler de iniciar partida).
  const salaCompleta = jugadores.length >= MAX_JUGADORES;

  useEffect(() => {
    if (!room) return;
    const salaActual = room;

    function sincronizarEstado(state: EstadoDeSala) {
      if (!state || !state.jugadores || !state.partida) return;

      setTurnoActual(state.partida.turnoActual);

      const listaJugadores: JugadorVista[] = [];
      state.jugadores.forEach((jugador, sessionId) => {
        listaJugadores.push({
          sessionId,
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
      const nuevaSala = await client.create("catan");
      guardarSalaReciente(nuevaSala.roomId);
      setRoom(nuevaSala);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }

  async function unirseASala(codigo: string) {
    try {
      const nuevaSala = await client.joinById(codigo, {});
      setRoom(nuevaSala);
    } catch (error) {
      console.error("Error connecting to room:", error);
    }
  }

  // Estos handlers están listos para cuando el backend registre los
  // onMessage; por ahora el envío no tendrá efecto visible.
  function pasarTurno() {
    room?.send("pasarTurno");
  }
  function lanzarDado() {
    room?.send("lanzarDados");
  }
  function enviarMensaje() {
    if (!messageInput.trim()) return;
    room?.send("message", messageInput);
    setMessageInput("");
  }
  function enviarMensajePrivado() {
    if (!privateMessageInput.trim() || !privateReceiverInput.trim()) return;
    room?.send("privatemessage", { text: privateMessageInput, to: privateReceiverInput });
    setPrivateMessageInput("");
    setPrivateReceiverInput("");
  }

  if (!room) {
    if (vista === "inicio") {
      return <Home onAbrirMenu={() => setVista("elegir")} />;
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

  return (
    <Partida
      room={room}
      jugadores={jugadores}
      numeroDeTurno={1}
      esMiTurno={esMiTurno}
      diceResult={diceResult}
      turnHistory={turnHistory}
      chatMessages={chatMessages}
      messageInput={messageInput}
      setMessageInput={setMessageInput}
      privateMessageInput={privateMessageInput}
      setPrivateMessageInput={setPrivateMessageInput}
      privateReceiverInput={privateReceiverInput}
      setPrivateReceiverInput={setPrivateReceiverInput}
      onPasarTurno={pasarTurno}
      onLanzarDado={lanzarDado}
      onEnviarMensaje={enviarMensaje}
      onEnviarMensajePrivado={enviarMensajePrivado}
    />
  );
}

export default Navegacion;