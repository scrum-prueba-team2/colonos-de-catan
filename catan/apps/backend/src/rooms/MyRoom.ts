import { Room, Client, CloseCode, Delayed } from "colyseus";
import { MyRoomState, Player } from "./schema/MyRoomState.js";

/** How long a player has to act before their turn is skipped. */
const TURN_DURATION = 15_000;

export class MyRoom extends Room<{ state: MyRoomState }> {
  maxClients = 2;
  state = new MyRoomState();

  private turnTimeout?: Delayed;

  messages = {
    /**
     * Ignored unless it is the sender's turn — turn order is the server's to
     * enforce, never the client's to claim.
     */
    play: (client: Client, message: any) => {
      if (this.state.currentTurn !== client.sessionId) { return; }

      const player = this.state.players.get(client.sessionId);
      if (!player) { return; }

      player.score++;
      this.nextTurn();
    },
  };

  onCreate(options: any) {
  }

  onJoin(client: Client, options: any) {
    console.log(client.sessionId, "joined!");
    this.state.players.set(client.sessionId, new Player());

    if (this.state.players.size === this.maxClients) {
      this.lock(); // full: stop the matchmaker from sending anyone else
      this.nextTurn();
    }
  }

  onLeave(client: Client, code: CloseCode) {
    console.log(client.sessionId, "left!", code);
    const wasTheirTurn = this.state.currentTurn === client.sessionId;

    this.state.players.delete(client.sessionId);
    if (wasTheirTurn) { this.nextTurn(); }
  }

  onDispose() {
    console.log("room", this.roomId, "disposing...");
  }

  /** Hand the turn to the next player and restart the deadline. */
  nextTurn() {
    this.turnTimeout?.clear();

    const sessionIds = [...this.state.players.keys()];
    if (sessionIds.length === 0) {
      this.state.currentTurn = "";
      return;
    }

    // indexOf("") is -1, so the very first turn lands on sessionIds[0].
    const previous = sessionIds.indexOf(this.state.currentTurn);
    this.state.currentTurn = sessionIds[(previous + 1) % sessionIds.length];
    this.state.turnCount++;
    this.state.turnDeadline = this.clock.currentTime + TURN_DURATION;

    this.turnTimeout = this.clock.setTimeout(() => this.nextTurn(), TURN_DURATION);
  }

  /**
   * Called on any disconnection the client did not ask for — a network blip, a
   * suspended tab, a tunnel change. Holding the seat lets the SDK retry into the
   * same session, so the player keeps their entity and their place in the room.
   */
  onDrop(client: Client, code: CloseCode) {
    // Deliberately not awaited: the framework routes the outcome to onReconnect()
    // or onLeave() by itself. The catch is only here because the promise also
    // rejects when the room is already disposing (server shutdown), which would
    // otherwise surface as an unhandled rejection.
    this.allowReconnection(client, 30).catch(() => {});
  }

  onReconnect(client: Client) {
    console.log(client.sessionId, "reconnected!");
  }
}
