import { Client } from "@colyseus/sdk";

// Si tu backend corre en otro host o puerto, cambia esta URL.
// Nota: en producción normalmente usarás "wss://" en vez de "ws://"
export const client = new Client("ws://localhost:2567");



//SE NECESITA INSTALARLO, solamente abran terminal en la carpeta del frontend y ejecuten:
//npm install @colyseus/sdk