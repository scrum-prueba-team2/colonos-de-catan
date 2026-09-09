import { MapSchema } from "@colyseus/schema";
import { Terreno } from "../common/enums.js";
import { coordenadasHexagono } from "../common/tablero.js";
import { mezclar } from "../common/mezclar.js";
import { Hexagono } from "../schemas/Hexagono.js";
import { CatanState } from "../states/CatanState.js";

export function generarHexagonos(hexagonos: MapSchema<Hexagono>){
    const terrenos = mezclar([
        Terreno.MADERA,Terreno.MADERA,Terreno.MADERA,Terreno.MADERA,
        Terreno.TRIGO,Terreno.TRIGO,Terreno.TRIGO,Terreno.TRIGO,
        Terreno.LANA, Terreno.LANA, Terreno.LANA, Terreno.LANA,
        Terreno.LADRILLO, Terreno.LADRILLO, Terreno.LADRILLO,
        Terreno. MINERAL, Terreno. MINERAL, Terreno. MINERAL,
        Terreno.DESIERTO
    ])
    const nums = mezclar([2,3,3,4,4,5,5,6,6,8,8,9,9,10,10,11,11,12]);
    let indiceNums = 0;
    let hex;
    coordenadasHexagono.forEach((item, index) =>{
        if(terrenos[index] === Terreno.DESIERTO){
            hex = new Hexagono( item[0], item[1], terrenos[index], 0);
        }else{
            hex = new Hexagono( item[0], item[1], terrenos[index], nums[indiceNums]);
            indiceNums ++;
        }
        hexagonos.set(`${item[0]},${item[1]}`, hex );
    });
}
