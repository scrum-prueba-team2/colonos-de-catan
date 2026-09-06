import { schema, t, type SchemaType } from "@colyseus/schema";

export const Player = schema({
  score: t.uint16().default(0),
});
export type Player = SchemaType<typeof Player>;

export const MyRoomState = schema({

  players: t.map(Player),

  /** sessionId of whoever may act right now; empty before the match starts. */
  currentTurn: t.string().default(""),

  /** Room-clock time (ms) the current turn expires at. */
  turnDeadline: t.number().default(0),

  turnCount: t.uint16().default(0),

  phase: t.string().default("lobby"), // Estado por defecto de la sala

});
export type MyRoomState = SchemaType<typeof MyRoomState>;
