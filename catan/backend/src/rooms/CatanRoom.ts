import { Room, Client, CloseCode, Delayed } from "colyseus";
import { CatanState } from "../states/CatanState.js";
import { Jugador } from "../schemas/Jugador.js";

//* Cuanto tiempo tendra un jugador (en ms) para realizar su turno
const TURN_DURATION = 15_000;

export class CatanRoom extends Room{
  maxClients = 4;
  state = new CatanState();
  Partida = this.state.partida;
  Jugadores = this.state.jugadores;
  codigoAcceso = "";

  //? Delayed
  //* Tipo de dato temporizador que permite programar una funcion en el tiempo
  private turnTimeout?: Delayed;

  messages = {
    play: (client: Client, message: any) => {
      if (this.Partida.turnoActual !== client.sessionId) { return; }

      const player = this.Jugadores.get(client.sessionId);
      if (!player) { return; }

      player.puntuacion++;
      this.nextTurn();
    },
    
    message: (client: Client, message: any) => {
      console.log("message received from", client.sessionId, ":", message);
      //* enviamos el mensaje a todos los clientes conectados a la sala, incluyendo el remitente.
      this.broadcast("message", {
        text: message,
        from: client.sessionId
      });
    },

    privatemessage: (client: Client, message: any) => {
      console.log("private message received from", client.sessionId, ":", message);

      //* extraemos el sessionId del destinatario del mensaje
      const targetSessionId = message.to;
      //* si no existe el sessionId o no hay texto ignora
      if (!targetSessionId || !message.text) return; 

      //* buscamos el cliente con el sessionId especificado
      const targetClient = this.clients.find(c => c.sessionId === targetSessionId);

      //* si no se encuentra el cliente enviarle un mensaje al cliente
      if (!targetClient) {
        client.send("error", { 
          message: "Ese jugador ya no está en la sala"
        });
        return; 
      }

      //* enviamos el mensaje solo a ese cliente
      targetClient.send("privatemessage", {
        text: message.text,
        from: client.sessionId
      });

    },

    rollDice: (client: Client, message: any) => {
      if (this.Partida.turnoActual !== client.sessionId) { return; }

      //* Se calcula un dado aleatorio entre 1 y 6
      const diceRoll = Math.floor(Math.random() * 6) + 1; 
      console.log("dice rolled by", client.sessionId, ":", diceRoll);

      //* Le mostramos el resultado a todos los jugadores.
      this.broadcast("diceRolled", {
        result: diceRoll,
        from: client.sessionId
      });

      this.nextTurn();
    }
    
  };

  onCreate(options: any) {
    console.log("room created!", this.roomId);
    //si se ingresa codigo de acceso, se setea al atributo de codigo de acceso a la sala
    this.codigoAcceso = options.codigoAcceso || ""

    //seteamos la data de la sala
    this.setMetadata({
      alias:options.alias || "Catan Room",
      estado: "EN LOBBY",
      privada:options.privada || false
    })
  }

  onJoin(client: Client, options: any) {
    //en dado caso que la sala tuviera clave, entra a este if
    if(this.codigoAcceso != ""){
      //si el codigo es incorrecto
      if(options.codigoAcceso !== this.codigoAcceso){
        throw new Error("Codigo de acceso incorrecto!!");
      }
    }
    console.log(client.sessionId, "joined!");
    //* Crear y setear un nuevo jugador en el estado de la sala cuando un cliente se une
    this.Jugadores.set(client.sessionId, new Jugador());

    //* Si la sala ya esta llena, se bloquea para no ser visible en el matchmaker
    if (this.Jugadores
      .size === this.maxClients) {
      this.lock();
      this.nextTurn();
      this.Partida.fase = "playing"; //* fase a "playing"
      this.setMetadata({ estado: "EN JUEGO" }); //* refleja el cambio de fase en el listado del lobby
    }
  }

  onLeave(client: Client, code: CloseCode) {
    console.log(client.sessionId, "left!", code);
    const wasTheirTurn = this.Partida.turnoActual === client.sessionId;

    this.Jugadores.delete(client.sessionId);  //* Eliminar al jugador del state
    if (wasTheirTurn) this.nextTurn();
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  //* Controla a que jugador le toca el turno
  nextTurn() {
    this.turnTimeout?.clear();  //! Limpia el temporizador anterior si existe

    //* Obtiene todos los sessionIds de los jugadores en la sala
    const sessionIds = [...this.Jugadores.keys()];
    if (sessionIds.length === 0) {
      this.Partida.turnoActual = "";
      return;
    }

    //* indexOf() si recibe vacio retorna -1, que al inicio asi sera por eso
    const previous = sessionIds.indexOf(this.Partida.turnoActual);

    //* Al turno actual se considera el siguiente jugador en una lista circular de sessionIds
    this.Partida.turnoActual = sessionIds[(previous + 1) % sessionIds.length];

    //? Se programa un temporizador para la misma funcion nextTurn()
    this.turnTimeout = this.clock.setTimeout(() => this.nextTurn(), TURN_DURATION);
  }

  //* Si un cliente se desconecta tiene 30 segundos para reconectarse
  onDrop(client: Client, code: CloseCode) {
    this.allowReconnection(client, 30).catch(() => {});
  }

  onReconnect(client: Client) {
    console.log(client.sessionId, "reconnected!");
  }
}
