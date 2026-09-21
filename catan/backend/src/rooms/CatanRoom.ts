import { Room, Client, CloseCode, Delayed } from "colyseus";
import { CatanState } from "../states/CatanState.js";
import { Jugador } from "../schemas/Jugador.js";
import { Desarrollo, FaseJuego, FasePartida, FasePreconstruccion } from "../common/enums.js";
import { buscarHexagonos } from "../functions/buscarHexagonos.js";
import { darRecursosJugador } from "../functions/darRecursosJugador.js";
import { verticesDelHexagono } from "../functions/verticesDelHexagono.js";
import { lanzarDados } from "../functions/lanzarDados.js";
import { mezclar } from "../common/mezclar.js";
import { siguienteTurno } from "../functions/siguienteTurno.js";
import { construirAsentamiento } from "../functions/construirAsentamiento.js";
import { darMaterialInicial } from "../functions/darMaterialInicial.js";
import { verificarVictoria } from "../functions/verificarVictoria.js";


export class CatanRoom extends Room {
  maxClients = 4;
  state = new CatanState();
  partida = this.state.partida;
  tablero = this.state.tablero;
  banca = this.state.banca;
  jugadores = this.state.jugadores;
  ofertas = new Map<string, unknown>();
  codigoAcceso = "";


  messages = {
    msgIntercambiarBanca:(
      client: Client,
      mensaje: { recursoEntregado: string, recursoRecibido: string}
    ) => {
      //* Verificar que sea el turno del jugador
      if(this.partida.turnoActual !== client.sessionId){
        client.send("error", {
          mensajeError: "No es tu turno"
        })
        return;
      }

      //* Verificar que estemos en la fase de acciones
      if(this.partida.faseJuego !== FaseJuego.ACCIONES){
        client.send("error", {
          mensajeError: "Termian de lanzar los dados primero"
        })
        return;
      }

      //* Intentar realizar el intercambio con la banca
      const resultado = comerciarBanca(
        this.jugadores.get(client.sessionId), this.banca, client.sessionId,
        this.tablero.vertices, this.tablero.puertos,
        mensaje.recursoEntregado, mensaje.recursoRecibido
      );

      //* Si el intercambio fallo, notificar error
      if(resultado.error){
        client.send("error", {
          mensajeError: resultado.mensaje
        })
        return;
      }

    },
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

        //* Limpiar a los jugadors que deben descartar
        this.partida.jugadoresParaDescartar.clear();

        //* Ver el total de cartas de cada jugador
        this.jugadores.forEach((jugador, sessionId)=>{
          let totalRecursos = 0;

          //* contando la cantidad de recursos
          jugador.recursos.forEach(cantidad => {
            totalRecursos += cantidad;
          });

          //* Si tiene mas de 7, debe descartar la mitad
          if(totalRecursos > 7){
            this.partida.jugadoresParaDescartar.set(sessionId, Math.floor(totalRecursos / 2));
          }

        });

        //*Verificar si alguien tiene descarte, para enviarlo a fase de descarte
        if(this.partida.jugadoresParaDescartar.size > 0){
          this.partida.faseJuego = FaseJuego.DESCARTE
        }else{
          this.partida.faseJuego = FaseJuego.LADRON
        }

        return ;

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

    msgColocarCiudad: (
      client: Client,
      mensaje: {h: number, d: number, p:number}
    ) => {
        //* Verificar que la partida siga un curso
        if(this.partida.fase === FasePartida.FINALIZADA){
          client.send("error",{
            mensajeError: "La partida ha finalizado"
          })
          return;
        }

        //*Verificar que sea el turno del jugador
        if(this.partida.turnoActual !== client.sessionId){
          client.send("error", {
            mensajeError: "No es tu turno"
          })
          return;
        }

        //* Verificar que estemos en la fase de juego
        if(this.partida.fase !== FasePartida.JUEGO){
          client.send("error", {
            mensajeError: "No es la fase de juego"
          });
          return;
        }

        //* Verificar que estemos en la fase de acciones
        if(this.partida.faseJuego !== FaseJuego.ACCIONES){
          client.send("error", {
            mensajeError: "Debes lanzar los dados primero"
          })
          return;
        }

        //* Obtener el jugador del state y que exista
        const jugador = this.jugadores.get(client.sessionId);
        if(!jugador) return;
        const {h, d, p} = mensaje;

        //* Intentar construir la ciudad
        const resultado = construirCiudad(
          this.tablero.vertices,
          h, d, p,
          jugador, this.banca, client.sessionId
        )

        //* Si no se pudo construir, se notifica el error
        if(resultado.error){
          client.send("error", {
            mensajeError: resultado.mensaje
          })
          return;
        }

        //* Verificar si el jugador ha ganado
        verificarVictoria(this.partida, jugador, client.sessionId);
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

      this.ofertas.clear();

      /** Activar las cartas compradas del jugador */
      activarCartasCompradas(this.jugadores.get(client.sessionId));

      /** Permitir usar una carta en el siguiente turno */
      this.partida.cartaJugable = true;

      siguienteTurno(this.partida);

    },
    msgColocarAsentamiento: (
      client: Client,
      mensaje: { h: number, d: number, p: number }
    ) => {
      //* Verificar que la partida siga en curso
      if (this.partida.fase === FasePartida.FINALIZADA) {
        client.send("error", {
          mensajeError: "La partida ha finalizado"
        })
        return;
      }

      //*Verificar que el turno sea del jugador 
      if (this.partida.turnoActual !== client.sessionId) {
        client.send("error", {
          mensajeError: "No es tu turno"
        })
        return;
      }

      const jugador = this.jugadores.get(client.sessionId);
      if (!jugador) return;

      const { h, d, p } = mensaje;

      //! FLUJO DE LA FASE PRECONSTRUCCION
      if (this.partida.fase === FasePartida.PRECONSTRUCCION) {
        //* Comprobar que estamos en la fase de colocar asentamiento
        if (this.partida.fasePreconstruccion !== FasePreconstruccion.ASENTAMIENTO) {
          client.send("error", {
            mensajeError: "Debes colocar un camino"
          })
          return;
        }

        //* Intentar construir el asentamiento
        const resultado = construirAsentamiento(
          this.tablero.vertices,
          this.tablero.aristas,
          this.partida,
          h, d, p,
          jugador,
          this.banca,
          client.sessionId)

        if (resultado.error) {
          client.send("error", {
            mensaje: resultado.mensaje
          })
          return;
        }

        //* Si estamos en vuelta de regreso de la preconstruccion
        if (this.partida.direccionPreconstruccion === -1) {
          darMaterialInicial(this.tablero.hexagonos, jugador, h, d, p, this.banca);
        }

        this.partida.fasePreconstruccion = FasePreconstruccion.CAMINO;
        return;

      }

      //!FLUJO EN JUEGO
      if (this.partida.fase == FasePartida.JUEGO) {
        //* Comprobar que estamos en la fase de acciones
        if (this.partida.faseJuego !== FaseJuego.ACCIONES) {
          client.send("error", {
            mensajeError: "Debes lanzar los dados primero"
          })
          return;
        }

        //* Intentar construir asentamiento
        const resultado = construirAsentamiento(
          this.tablero.vertices,
          this.tablero.aristas,
          this.partida,
          h, d, p,
          jugador,
          this.banca,
          client.sessionId
        )

        //* Si algo fallo en la construccion, indicar el error
        if (resultado.error) {
          client.send("error", {
            mensajeError: resultado.mensaje
          })
          return;
        }

        //* Verificar si el jugador ha ganado
        verificarVictoria(this.partida, jugador, client.sessionId);
      }

    },
    msgDescartarRecursos:(
      client: Client,
      mensaje:{recurso: string}
    ) => {
      //* Verificar si estamos en fase de descarte
      if(this.partida.faseJuego !== FaseJuego.DESCARTE){
        client.send("error", {
          mensajeError: "No es la fase de descarte"
        })
        return;
      }

      //* Verificar si el jugador esta en la lista de descarte
      if(!this.partida.jugadoresParaDescartar.has(client.sessionId)){
        client.send("error", {
          mensajeError: "No tienes que descartar"
        })
        return ;
      }

      //* Encontrar al jugador que debe descartar
      let jugadorPorDescartar = "";
      for(const sessionId of this.partida.ordenJugadores){
        if(this.partida.jugadoresParaDescartar.has(sessionId)){
          jugadorPorDescartar = sessionId;
          break;
        }
      
      }

      //* Si no es el turno del jugador que debe descartar, enviar error
      if(client.sessionId !== jugadorPorDescartar){
        client.send("error",{
          mensajeError: "No es tu turno para descartar"
        })
        return;
      }

      //* Intentar descartar
      const resultado = descartarRecurso(
        this.jugadores.get(jugadorPorDescartar),
        this.banca,
        mensaje.recurso
      );


      //*Error en descarte
      if(resultado.error){
        client.send("error", {
          mensajeError: resultado.mensaje
        })
        return;
      }


      //*Actualizar la cantidad de recursos que le faltan por descartar
      this.partida.jugadoresParaDescartar.set(
        jugadorPorDescartar,
        this.partida.jugadoresParaDescartar.get(jugadorPorDescartar) - 1
      );

      //* Eliminarlo de la lista si ya no tiene que descartar
      if(this.partida.jugadoresParaDescartar.get(jugadorPorDescartar) === 0){
        this.partida.jugadoresParaDescartar.delete(jugadorPorDescartar);
      }

      //* Verificar si ya no hay jugadores que deben descartar, para pasar a fase de ladron
      if(this.partida.jugadoresParaDescartar.size == 0){
        this.partida.faseJuego = FaseJuego.LADRON;
      }
    },
    msgMoverLadron: (
      client: Client,
      mensaje: {h:number, d:number}
    ) => {
      //* Verificar que sea el turno del jugador
      if(this.partida.turnoActual !== client.sessionId){
        client.send("error", {
          mensajeError: "No es tu turno"
        })
        return;
      }

      //*Verificar que estemos en la fase de juego
      if(this.partida.fase !== FasePartida.JUEGO){
        client.send("error", {
          mensajeError: "No es la fase de juego"
        })
        return;
      }

      //* Verificar que estemos en la fase de mover al ladron
      if(this.partida.faseJuego !== FaseJuego.LADRON){
        client.send("error", {
          mensajeError: "No es la fase de mover al ladron"
        })
        return;
      }


      //* Mover al ladron y obtener los jugadores involucrados
      const {h, d} = mensaje;
      const resultado = moverLadron(
        this.tablero,
        this.jugadores,
        client.sessionId,
        h, d
      );

      if(resultado.error){
        client.send("error", {
          mensajeError: resultado.mensaje
        })
        return;
      }


      //*Extraemos los jugadores involucrados en el robo
      const jugadoresinvolucrados = resultado.jugadoresInvolucrados;

      //* Si no hay jugadores pasamos a las acciones
      if(jugadoresinvolucrados.length === 0){
        this.partida.faseJuego = FaseJuego.ACCIONES;
        return;
      }

      //*Si solo hubo un jugador, se le roba automaticamente
      if(jugadoresinvolucrados.length === 1){
        robarJugador(
          this.jugadores.get(client.sessionId),
          this.jugadores.get(jugadoresinvolucrados[0])
        )
        this.partida.faseJuego = FaseJuego.ACCIONES;
        return;
      }

      //* Si hay 2 o mas jugadores involucrados, se pasa la lista de jugadores
      this.partida.jugadoresParaRobar.clear();
      this.partida.jugadoresParaRobar.push(...jugadoresinvolucrados);


      this.partida.faseJuego = FaseJuego.ROBO
    },
    msgCartaCaballero: (
      client: Client,
      mensaje: {h: number, d:number}
    ) => {
      //* Verificar que la partida siga en curso
      if(this.partida.fase === FasePartida.FINALIZADA){
        client.send("error", {
          mensajeError: "La partida ha finalizado"
        })
        return;
      }

      //* Verificar que sea el turno del jugador
      if(this.partida.turnoActual !== client.sessionId){
        client.send("error", {
          mensajeError: "No es tu turno"
        })
        return;
      }

      //* Verificar si estamos en la fase de acciones
      if(this.partida.faseJuego !== FaseJuego.ACCIONES){
        client.send("error", {
          mensajeError: "Termina de lanzar los dados primero"
        })
        return;
      }


      //* Verificar que se permita usar carta
      if(!this.partida.cartaJugable){
        client.send("error", {
          mensajeError: "Solo una carta por turno"
        })
        return;
      }


      //* Verificar que el jugador tenga la carta de caballero
      const jugador = this.jugadores.get(client.sessionId);
      if(jugador.cartas_usables.get(`${Desarrollo.CABALLERO}`) < 1){
        client.send("error", {
          mensajeError: "No tienes la carta de caballero"
        })
        return;
      }

      //* Mover al ladron y obtener los jugadores involucrados
      const {h, d} = mensaje;
      const resultado = moverLadron(
        this.tablero,
        this.jugadores,
        client.sessionId,
        h, d);


        //* Si no se puede mover el ladron, notificar error
        if(resultado.error){
          client.send("error", {
            mensajeError: resultado.mensaje
          })
          return;
        }

        //* Eliminar la carta de caballero del jugador
        jugarCaballero(this.jugadores, client.sessionId, this.partida);

        //* Extraemos los jugadores involucrados en el robo
        const jugadoresInvolucrados = resultado.jugadoresInvolucrados;

        //* Si no hay jugadores, pasamos a las ACCIONES
        if(jugadoresInvolucrados.length == 0){
          this.partida.faseJuego = FaseJuego.ACCIONES;
          return;
        }

        //* Si solo hubo un jugador, se le roba automaticamente
        if(jugadoresInvolucrados.length === 1){
          robarJugador(
            this.jugadores.get(client.sessionId),
            this.jugadores.get(jugadoresInvolucrados[0])
          )
          this.partida.faseJuego = FaseJuego.ACCIONES;
          return;
        }

        //* Si hay 2 o mas jugadores involucrados, se pasa la lista de jugadores
        this.partida.jugadoresParaRobar.clear();
        this.partida.jugadoresParaRobar.push(...jugadoresInvolucrados);


        //* Deshabilitar el uso de otra carta este turno
        this.partida.cartaJugable = false;

        //? Entramos a fase especial para decidir a quien robar

        this.partida.faseJuego = FaseJuego.ROBO;

    }
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
