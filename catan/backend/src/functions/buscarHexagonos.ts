import { MapSchema } from "@colyseus/schema";
import { Hexagono } from "../schemas/Hexagono.js";


export function buscarHexagonos(
    hexagonos: MapSchema<Hexagono>,
    numero: number
): Hexagono[] {
    //* Lista de hexagonos encontrados
    const hexagonosEncontrados: Hexagono[] = [];

    //* Al salir un 7 no hay nada que buscar
    if(numero === 7){
        return hexagonosEncontrados;
    }

    //* Por defecto hay 2 hexagonos con el mismo numero, pero con 2 y 12 solo hay uno
    let repeticiones = 2;
    if( numero === 2 ||  numero === 12 ) repeticiones--;

    //* Para cada hexagono del tablero, ver si su numero es el buscado
    hexagonos.forEach((hexagono) => {
        if(repeticiones === 0) return;

        //* Agregar el hexagono a la lista
        if(hexagono.numero === numero){
            hexagonosEncontrados.push(hexagono)
            repeticiones--;
        }
    })

    return hexagonosEncontrados;
}