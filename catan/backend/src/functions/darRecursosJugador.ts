import { MapSchema } from "@colyseus/schema";
import { Hexagono } from "../schemas/Hexagono.js";
import { Vertice } from "../schemas/Vertices.js";
import { Jugador } from "../schemas/Jugador.js";
import { Banca } from "../schemas/Banca.js";
import { Coordenada } from "../schemas/Coordenada.js";
import { recursoTexto } from "../common/recursoTexto.js";
import { Construccion } from "../common/enums.js";


export function darRecursosJugador(
    hexagono: Hexagono,
    vertice: Vertice,
    jugadores: MapSchema<Jugador>,
    banca: Banca,
    ladron: Coordenada
){
    //* Obtener el jugador propietario del vertice
    const jugador = jugadores.get(vertice.propietario);
    if(!jugador) return;

    //* Si el hexagono tiene el ladron encima no da nada
    if(hexagono.h === ladron.h && hexagono.d === ladron.d) return;

    //* Obtener el recurso de dicho hexagono
    const recurso = recursoTexto(hexagono.terreno);

    //* Dar recursos de la banca al jugador segun sea el tipo
    let cantidad = 1;
    if(vertice.constuccion === Construccion.CIUDAD) cantidad++;

    //* Siempre y cuando haya disponibilidad 
    if(banca.recursos.get(recurso) === 0) return;
    if(banca.recursos.get(recurso) < cantidad) cantidad = banca.recursos.get(recurso);

    jugador.recursos.set(recurso, jugador.recursos.get(recurso) + cantidad);
    banca.recursos.set(recurso, banca.recursos.get(recurso) - cantidad);
}
