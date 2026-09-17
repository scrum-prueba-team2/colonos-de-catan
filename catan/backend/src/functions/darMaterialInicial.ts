import { MapSchema } from "@colyseus/schema";
import { Hexagono } from "../schemas/Hexagono.js";
import { Jugador } from "../schemas/Jugador.js";
import { Banca } from "../schemas/Banca.js";
import { Terreno } from "../common/enums.js";
import { recursoTexto } from "../common/recursoTexto.js";

export function darMaterialInicial(
    hexagonos: MapSchema<Hexagono>,
    jugador: Jugador,
    h: number,
    d: number,
    p: number,
    banca: Banca
){
    let h1, h2, h3;

    //* Obtener hexagonos que colisionan con el vertice, en base a su posicion
    if(p == 0){
        h1 = hexagonos.get(`${h},${d}`);
        h2 = hexagonos.get(`${h + 1},${d - 1}`);
        h3 = hexagonos.get(`${h},${d - 1}`);
    }else{
        h1 = hexagonos.get(`${h},${d}`);
        h2 = hexagonos.get(`${h - 1},${d}`);
        h3 = hexagonos.get(`${h},${d - 1}`);
    }

    //* Si el hexagono existe y no es desierto, darle el recurso al jugador y quitarlo de la banca
    if(h1 && h1.terreno !== Terreno.DESIERTO){
        const recurso = recursoTexto(h1.terreno);
        jugador.recursos.set(recurso, jugador.recursos.get(recurso) + 1)
        banca.recursos.set(recurso, banca.recursos.get(recurso) - 1)
    }

    if(h2 && h2.terreno !== Terreno.DESIERTO){
        const recurso = recursoTexto(h2.terreno);
        jugador.recursos.set(recurso, jugador.recursos.get(recurso) + 1)
        banca.recursos.set(recurso, banca.recursos.get(recurso) - 1)
    }

    if(h3 && h3.terreno !== Terreno.DESIERTO){
        const recurso = recursoTexto(h3.terreno);
        jugador.recursos.set(recurso, jugador.recursos.get(recurso) + 1)
        banca.recursos.set(recurso, banca.recursos.get(recurso) - 1)
    }

}