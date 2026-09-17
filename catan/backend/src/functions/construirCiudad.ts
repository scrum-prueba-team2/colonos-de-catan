import { MapSchema } from "@colyseus/schema";
import { Vertice } from "../schemas/Vertices.js";
import { Jugador } from "../schemas/Jugador.js";
import { Banca } from "../schemas/Banca.js";
import { Construccion } from "../common/enums.js";

export function construirCiudad(
    vertices: MapSchema<Vertice>,
    h: number,
    d: number,
    p: number,
    jugador: Jugador,
    banca: Banca,
    sessionId: string
):{
    error: boolean,
    mensaje: string
}{
    //* Validar existencia del vertice
    const vertice = vertices.get(`${h},${d},${p}`);
    if(!vertice){
        return{
            error: true,
            mensaje: "El lugar seleccionado no es valido"
        };
    }

    //* Validar que tenga ciudades disponibles
    if(jugador.construccionesDisponibles.get(`${Construccion.CIUDAD}`) <= 0){
        return{
            error: true,
            mensaje: "No tienes ciudades disponibles"
        };
    }
}