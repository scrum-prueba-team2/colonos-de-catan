import { useEffect, useState } from "react";
import type { Room } from "@colyseus/sdk";

import { NavigationProvider } from "./context/navegacion";
import { useNavigation } from "./context/useNavigation";

import { client } from "./colyseusClient";

import Home from "./pantallas/Home/Home";
import ElegirModo from "./pantallas/ElegirModo/ElegirModo";
import Lobby from "./pantallas/Lobby/Lobby";
import SalaEspera from "./pantallas/salaEspera/SalaEspera";
import Partida, { type JugadorVista } from "./pantallas/Partidacol";

import { guardarSalaReciente } from "./pantallas/salasRecientes";

const MAX_JUGADORES = 4;

interface JugadorEstado {
  score: number;
}

interface EstadoDeSala {
  partida: {
    turnoActual: string;
    fase: string;
  };

  jugadores: {
    forEach: (
      callback: (
        jugador: JugadorEstado,
        sessionId: string
      ) => void
    ) => void;
  };
}

interface MensajeChat {
  from: string;
  text: string;
}

interface ResultadoDado {
  from: string;
  result: number;
}

interface ErrorPayload {
  message: string;
}

interface ChatMessage {
  from: string;
  text: string;
  isPrivate: boolean;
}

function AppContent() {
  const { pantallaActual, navegarA } = useNavigation();

  const [room, setRoom] = useState<Room | null>(null);

  //const [phase, setPhase] = useState("lobby");
  const [turnoActual, setTurnoActual] = useState("");
  //const [numeroDeTurno, setNumeroDeTurno] = useState(0);

  const [jugadores, setJugadores] = useState<JugadorVista[]>([]);

  const [messageInput, setMessageInput] = useState("");
  const [privateMessageInput, setPrivateMessageInput] = useState("");
  const [privateReceiverInput, setPrivateReceiverInput] = useState("");

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [turnHistory, setTurnHistory] = useState<string[]>([]);
  const [diceResult, setDiceResult] = useState("");

  const esMiTurno =
    room !== null && turnoActual === room.sessionId;

  /*
   * ============================================================
   * SINCRONIZACIÓN CON COLYSEUS
   * ============================================================
   */

  useEffect(() => {
    if (!room) return;

    const salaActual = room;

    function sincronizarEstado(state: EstadoDeSala) {
      // Guard: en el primer instante el schema puede llegar incompleto
      // (todavía sin "partida" o "jugadores" poblados). Si pasa, ignoramos
      // esta actualización y esperamos a la siguiente.
      if (!state?.partida || !state?.jugadores) return;

      setTurnoActual(state.partida.turnoActual);

      const listaJugadores: JugadorVista[] = [];

      state.jugadores.forEach((jugador, sessionId) => {
        listaJugadores.push({
          sessionId,
          score: jugador.score,
          esUsuarioActual:
            sessionId === salaActual.sessionId,
          esSuTurno:
            sessionId === state.partida.turnoActual,
        });
      });

      setJugadores(listaJugadores);

      /*
      * La fase del servidor decide cuándo pasamos
      * de sala de espera a partida.
      */
      if (state.partida.fase === "lobby") {
        navegarA("salaEspera");
      } else {
        navegarA("partida");
      }
    }

    // Nos suscribimos a los cambios de estado. onStateChange ya dispara
    // la sincronización inicial en cuanto el primer estado completo llega
    // del servidor, así que no hace falta (ni conviene) llamarlo a mano.
    salaActual.onStateChange((state: EstadoDeSala) => {
      sincronizarEstado(state);
    });

    salaActual.onMessage(
      "message",
      (message: MensajeChat) => {
        setChatMessages((prev) => [
          ...prev,
          {
            from: message.from,
            text: message.text,
            isPrivate: false,
          },
        ]);
      }
    );

    salaActual.onMessage(
      "privatemessage",
      (message: MensajeChat) => {
        setChatMessages((prev) => [
          ...prev,
          {
            from: message.from,
            text: message.text,
            isPrivate: true,
          },
        ]);
      }
    );

    salaActual.onMessage(
      "diceRolled",
      (result: ResultadoDado) => {
        if (result.from === salaActual.sessionId) {
          setDiceResult(
            `Resultado del dado: ${result.result}`
          );
        }

        setTurnHistory((prev) => [
          ...prev,
          `El jugador ${result.from} ha lanzado el dado y obtuvo: ${result.result}`,
        ]);
      }
    );

    salaActual.onMessage(
      "error",
      (err: ErrorPayload) => {
        alert(err.message);
      }
    );
  }, [room, navegarA]);

  /*
   * ============================================================
   * CREAR SALA
   * ============================================================
   */

  async function crearSala() {
    try {
      const nuevaSala = await client.create("catan");

      guardarSalaReciente(nuevaSala.roomId);

      setRoom(nuevaSala);

      // La sala acaba de crearse.
      // Mostramos la sala de espera.
      navegarA("salaEspera");

    } catch (error) {
      console.error(
        "Error creating room:",
        error
      );
    }
  }

  /*
   * ============================================================
   * UNIRSE A SALA
   * ============================================================
   */

  async function unirseASala(codigo: string) {
    try {
      const nuevaSala = await client.joinById(codigo, {});

      setRoom(nuevaSala);
      navegarA("salaEspera");
    } catch (error) {
      console.error("Error connecting to room:", error);
    }
  }

  /*
   * ============================================================
   * ACCIONES DE PARTIDA
   * ============================================================
   */

  function pasarTurno() {
    if (!room) return;

    room.send("play");
  }

  function enviarMensaje() {
    if (!room) return;

    const texto = messageInput.trim();

    if (texto) {
      room.send("message", texto);
      setMessageInput("");
    }
  }

  function enviarMensajePrivado() {
    if (!room) return;

    const texto =
      privateMessageInput.trim();

    const destinatario =
      privateReceiverInput.trim();

    if (texto && destinatario) {
      room.send("privatemessage", {
        text: texto,
        to: destinatario,
      });

      setPrivateMessageInput("");
      setPrivateReceiverInput("");
    }
  }

  function lanzarDado() {
    if (!room) return;

    room.send("rollDice");
  }

  /*
   * ============================================================
   * NAVEGACIÓN
   * ============================================================
   */

  switch (pantallaActual) {
    /*
     * HOME
     */
    case "home":
      return (
        <Home
          onAbrirMenu={() =>
            navegarA("elegirModo")
          }
        />
      );

    /*
     * ELEGIR MODO
     */
    case "elegirModo":
      return (
        <ElegirModo
          onCrear={crearSala}
          onUnirse={() =>
            navegarA("lobby")
          }
          onVolver={() =>
            navegarA("home")
          }
        />
      );

    /*
     * LOBBY
     */
    case "lobby":
      return (
        <Lobby
          onCrearSala={crearSala}
          onUnirseASala={unirseASala}
          onVolver={() =>
            navegarA("elegirModo")
          }
        />
      );

    /*
     * SALA DE ESPERA
     */
    case "salaEspera":
      if (!room) {
        navegarA("home");
        return null;
      }

      return (
        <SalaEspera
          room={room}
          jugadores={jugadores}
          maxJugadores={MAX_JUGADORES}
        />
      );

    /*
     * PARTIDA
     */
    case "partida":
      if (!room) {
        navegarA("home");
        return null;
      }

      return (
        <Partida
          room={room}
          jugadores={jugadores}
          numeroDeTurno={2}
          esMiTurno={esMiTurno}
          diceResult={diceResult}
          turnHistory={turnHistory}
          chatMessages={chatMessages}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          privateMessageInput={
            privateMessageInput
          }
          setPrivateMessageInput={
            setPrivateMessageInput
          }
          privateReceiverInput={
            privateReceiverInput
          }
          setPrivateReceiverInput={
            setPrivateReceiverInput
          }
          onPasarTurno={pasarTurno}
          onLanzarDado={lanzarDado}
          onEnviarMensaje={enviarMensaje}
          onEnviarMensajePrivado={
            enviarMensajePrivado
          }
        />
      );

    default:
      return null;
  }
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  );
import "./App.css";
import Navegacion from "./Navegacion";

function App() {
  return <Navegacion />;
}

export default App;