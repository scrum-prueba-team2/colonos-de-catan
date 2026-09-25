import { useEffect, useState } from "react";
import type { Room } from "@colyseus/sdk";
import { client } from "./pantallas/colyseusClient";
import Home from "./pantallas/Home/Home";
import ElegirModo from "./pantallas/ElegirModo/ElegirModo";
import Lobby from "./pantallas/Lobby/Lobby";
import IngresarNombre from "./pantallas/IngresarNombre/IngresarNombre";
import SalaEspera from "./pantallas/SalaEspera/SalaEspera";
import Partida, { type JugadorVista } from "./pantallas/PartidaCol/Partidacol";

import PartidaTablero from "./pantallas/Partida";
import { FASE_PARTIDA } from "./common/fases";

// Cupo de la sala. Debe coincidir con maxClients de CatanRoom en el backend.
const MAX_JUGADORES = 4;

// Mínimo para poder iniciar. El backend también lo valida en
// msgIniciarPartida; aquí solo se usa para deshabilitar el botón y evitar
// que el creador reciba un error que ya sabemos que va a ocurrir.
const MIN_JUGADORES_PARA_INICIAR = 2;

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
  const [turnoActual, setTurnoActual] = useState("");
  const [jugadores, setJugadores] = useState<JugadorVista[]>([]);

  // Ambos valores los publica el backend en state.partida:
  // - fase: en qué etapa está la partida (ver common/fases.ts).
  // - creador: sessionId del primer jugador que entró a la sala. Es el único
  //   al que el backend le acepta msgIniciarPartida.
  const [fasePartida, setFasePartida] = useState<number>(FASE_PARTIDA.LOBBY);
  const [creador, setCreador] = useState("");

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

  // El paso de la sala de espera al tablero lo decide el BACKEND, no el
  // cliente. Mientras la fase sea LOBBY mostramos la sala de espera; en
  // cuanto el creador inicia la partida, el backend cambia la fase a
  // PRECONSTRUCCION y, como esa fase se sincroniza con todos los clientes,
  // cada jugador pasa al tablero por su cuenta sin tener que hacer nada.
  // (Antes se contaba jugadores.length >= 4, lo que impedía jugar de 2 o 3
  // y dejaba sin usar el orden de turnos que mezcla el backend.)
  const partidaIniciada = fasePartida !== FASE_PARTIDA.LOBBY;

  // Solo el creador ve el botón de iniciar. Comparamos el creador que
  // publica el backend con nuestra propia sesión.
  const esCreador = room !== null && creador === room.sessionId;

  useEffect(() => {
    if (!room) return;
    const salaActual = room;

    function sincronizarEstado(state: EstadoDeSala) {
      if (!state || !state.jugadores || !state.partida) return;

      setTurnoActual(state.partida.turnoActual);
      setFasePartida(state.partida.fase);
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
    salaActual.onStateChange(sincronizarEstado);

    // Aquí llegan, entre otros, los rechazos de msgIniciarPartida
    // (no ser el creador, menos de 2 jugadores, partida ya iniciada).
    salaActual.onMessage("error", (err: { mensajeError: string }) => {
      alert(err.mensajeError);
    });

    // El backend avisa con "inicio" cuando arranca la partida. No lo usamos
    // para navegar (eso lo decide la fase, ver partidaIniciada), pero lo
    // registramos para que el SDK no muestre el aviso de "mensaje sin handler".
    salaActual.onMessage("inicio", () => {});

    // Al cambiar de sala dejamos de escuchar los cambios de la anterior.
    return () => {
      salaActual.onStateChange.remove(sincronizarEstado);
    };
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

  // Le pide al backend que inicie la partida. No cambiamos de pantalla aquí:
  // si el backend lo acepta cambiará la fase y todos (incluido el creador)
  // avanzarán al tablero; si lo rechaza, llega un mensaje "error".
  function iniciarPartida() {
    room?.send("msgIniciarPartida");
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
        minJugadores={MIN_JUGADORES_PARA_INICIAR}
        esCreador={esCreador}
        onIniciarPartida={iniciarPartida}
      />
    );
  }

  // No entiendo que tanto hay aqui asi que prefiero no tocar nada
  // pero el tablero ya se genera desde el backend
  if (room) return <PartidaTablero sala={room} />;


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