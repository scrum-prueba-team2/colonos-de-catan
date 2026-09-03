# Welcome to Colyseus!

This project was created with [⚔️ `create-colyseus-app`](https://github.com/colyseus/create-colyseus-app/).

[Documentation](https://docs.colyseus.io/)

## :crossed_swords: Usage

```
npm start
```

Then open http://localhost:2567 for the playground, or /monitor for the monitor.

## Structure

- `apps/backend/src/index.ts`: entry point — leave it alone if you plan to deploy to Colyseus Cloud
- `apps/backend/src/app.config.ts`: server configuration — rooms, HTTP routes, express middleware
- `apps/backend/src/rooms/MyRoom.ts`: your room handler
- `apps/backend/src/rooms/schema/MyRoomState.ts`: the state synchronized to every client in the room
- `apps/backend/test/MyRoom.test.ts`: boots the real server and connects a real client
- `apps/backend/loadtest/example.ts`: scriptable client for `npm run loadtest`
- `apps/backend/ecosystem.config.cjs`: pm2 configuration, used when deploying to Colyseus Cloud

## Scripts

- `npm start`: run the server in watch mode (`tsx watch src/index.ts`)
- `npm test`: run the mocha test suite
- `npm run build`: compile to `build/`
- `npm run loadtest`: connect N simulated clients with [`@colyseus/loadtest`](https://github.com/colyseus/colyseus-loadtest/)

## What's included

### Monorepo

Two packages that deploy independently: `apps/backend` (the Colyseus server) and
`apps/frontend` (a Vite app). The frontend imports the backend's *types* — not
its code — so `client.joinOrCreate("my_room")` is checked against the real room
definitions while the two still ship separately.

```bash
npm start                      # backend, on :2567
npm run dev -w apps/frontend   # frontend, on :3000 (second terminal)
```

`workspaces` is declared with plain `*` ranges, so npm, pnpm and yarn all
install it; `pnpm-workspace.yaml` is there for pnpm's own resolver.

Pick this over the single Vite project when the two halves have different deploy
targets or release cadences. If they don't, the Vite layout is less to run.

### Turn-based

`MyRoom` owns the turn order: `state.currentTurn` names whose turn it is, and a
`play` message from anyone else is ignored. The room locks once it is full, and
each turn carries a deadline — a `clock.setTimeout` skips a player who runs out
the clock, so one idle client cannot stall the match.

`state.turnDeadline` is stamped from `this.clock.currentTime`, the room's own
clock, so a reconnecting client can render the remaining time without the server
sending a countdown.

- https://docs.colyseus.io/room/timing-events

### Reconnection

`MyRoom.onDrop()` holds a dropped client's seat for 30 seconds via
`allowReconnection()`. The SDK retries automatically with exponential backoff;
`onReconnect()` fires if it gets back in time, `onLeave()` if it does not.

- https://docs.colyseus.io/room/reconnection
