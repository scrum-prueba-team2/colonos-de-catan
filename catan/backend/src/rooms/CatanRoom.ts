import { Room, Client, CloseCode, Delayed } from "colyseus";
import { CatanState } from "../states/CatanState.js";
import { Jugador } from "../schemas/Jugador.js";
import { FaseJuego, FasePartida } from "../common/enums.js";
import { buscarHexagonos } from "../functions/buscarHexagonos.js";
import { darRecursosJugador } from "../functions/darRecursosJugador.js";
import { verticesDelHexagono } from "../functions/verticesDelHexagono.js";
import { lanzarDados } from "../functions/lanzarDados.js";
import { mezclar } from "../common/mezclar.js";
import { siguienteTurno } from "../functions/siguienteTruno.js";


export class CatanRoom extends Room {
  maxClients = 4;
  state = new CatanState();
  partida = this.state.partida;
  tablero = this.state.tablero;
  banca = this.state.banca;
  jugadores = this.state.jugadores;
  codigoAcceso = "";


  messages = {
    msgLanzarDados: (client: Client) => {
      //* Verificar que la partida siga en curso
      if (this.partida.fase === FasePartida.FINALIZADA) {
        client.send("error", {
          mensajeError: "La partida ha finalizado"
        })
        return;
      }

      //* Verificar que sea el turno del jugador
      if (this.partida.turnoActual !== client.sessionId) {
        client.send("error", {
          mensajeError: "No es tu turno"
        })
        return;
      }

      //* Verificar que estemos en la fase de juego
      if (this.partida.fase !== FasePartida.JUEGO) {
        client.send("error", {
          mensajeError: "No es la fase de juego"
        })
        return;
      }

      //* Verificar que estemos en la fase de lanzar dados
      if (this.partida.faseJuego !== FaseJuego.DADOS) {
        client.send("error", {
          mensajeError: "Ya lanzaste los dados"
        })
        return;
      }

      //* Lanzamiento de dados
      const { dado1, dado2, suma } = lanzarDados();

      //? Notificar a todos los jugadores el resultado de los dados
      this.broadcast("dados", {
        dado1,
        dado2,
        suma
      })

      //! Si sale 7 toda la logica cambia, entramos a fase de robo y/o ladron
      if (suma === 7) {

        // todo: logica para descarte de jugadores
        this.partida.faseJuego = FaseJuego.LADRON;
        return;
      }

      //* Buscar los hexagonos con dicho numero resultado de la suma de los dados
      const hexagonosEncontrados = buscarHexagonos(this.tablero.hexagonos, suma);

      //* Traer los vertices adyacentes para cada hexagono encontrado
      hexagonosEncontrados.forEach((hexagono) => {
        const vertices = verticesDelHexagono(this.tablero.vertices, hexagono);

        //* Dar los recursos correspondientes en cada vertice encontrado
        vertices.forEach((vertice) => {
          darRecursosJugador(
            hexagono,
            vertice,
            this.jugadores,
            this.banca,
            this.tablero.ladron);
        })
      })
      this.partida.faseJuego = FaseJuego.ACCIONES;
    },

    msgIniciarPartida: (client: Client) => {

      //* Verificar que sea el creador de la sala
      if (this.partida.creador !== client.sessionId) {
        client.send("error", {
          mensajeError: "Solo el creador puede iniciar la partida"
        });
        return;
      }

      //* Solo se puede iniciar si estamos en la fase de lobby
      if (this.partida.fase !== FasePartida.LOBBY) {
        client.send("error", {
          mensajeError: "La partida ya ha comenzado"
        });
        return;
      }

      //* Verificar que al menos hayan 2 jugadores
      if (this.jugadores.size < 2) {
        client.send("error", {
          mensajeError: "Se necesitan al menos 2 jugadores para iniciar la partida"
        });
        return;
      }

      //* Mezclamos el orden de los jugadores en la partida
      mezclar(this.partida.ordenJugadores);

      //* Le damos el turno al primer jugador en la lista
      this.partida.turnoActual = this.partida.ordenJugadores[0];

      //* Enviar un mensaje a todos que la partida comenzó
      this.broadcast("inicio", {
        mensaje: "La partida ha comenzado",
      });

      //* Cambiamos el estado de la partida a preconstruccion
      this.partida.fase = FasePartida.PRECONSTRUCCION;

      //* Actualización de metadata para mostrar en la Lobby
      this.setMetadata({
        estado: "EN JUEGO"
      });
    },

    msgPasarTurno: (client: Client) => {

      //* Verificar que la partida siga en curso
      if (this.partida.fase === FasePartida.FINALIZADA) {
        client.send("error", {
          mensajeError: "La partida ha finalizado"
        });

        return;
      }

      //* Verificar que sea tu turno
      if (this.partida.turnoActual !== client.sessionId) {
        client.send("error", {
          mensajeError: "No es tu turno"
        });

        return;
      }

      //* Solo se puede pasar turno en fase de acciones
      if (this.partida.faseJuego !== FaseJuego.ACCIONES) {
        client.send("error", {
          mensajeError: "Termina de lanzar los dados primero"
        });

        return;
      }

      siguienteTurno(this.partida);
    },
  };

  onCreate(options: any) {
    console.log("room created!", this.roomId);
    //* si se ingresa codigo de acceso, se setea al atributo de codigo de acceso a la sala
    this.codigoAcceso = options.codigoAcceso || ""

    //* seteamos la data de la sala
    this.setMetadata({
      alias: options.alias || "Catan Room",
      estado: "EN LOBBY",
      privada: options.privada || false
    })
  }

  onJoin(client: Client, options: any) {
    //* todo: issue fase del juego
    if (this.codigoAcceso !== "") {
      if (options.codigoAcceso !== this.codigoAcceso) {
        throw new Error("Codigo de acceso incorrecto");
      }
    }
    console.log(`${client.sessionId} joined the room`);

    this.partida.ordenJugadores.push(client.sessionId);

    this.jugadores.set(client.sessionId, new Jugador(options.nombre));

    if (this.partida.creador == "") {
      this.partida.creador = client.sessionId;
    }
  }

  onLeave(client: Client, code: CloseCode) {
    //* todo: issue fase del juego
    console.log(`${client.sessionId} left the room`);
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  //* Si un cliente se desconecta tiene 30 segundos para reconectarse
  onDrop(client: Client, code: CloseCode) {
    //* todo: issue fase del juego
    console.log(`${client.sessionId} droppef with code ${code}`);
    this.allowReconnection(client, 30);
  }

  onReconnect(client: Client) {
    console.log(`${client.sessionId} reconnected`);
  }
}
