import { Desarrollo } from "../common/enums.js";
import { Banca } from "../schemas/Banca.js";
import { Jugador } from "../schemas/Jugador.js";

export function jugarAbundancia(
    jugador: Jugador,
    banca: Banca,
    recurso1: string,
    recurso2: string
):{
    error: boolean,
    mensaje: string
}{
    //* Verificar que los recursos existan
    if(!banca.recursos.has(recurso1) && !banca.recursos.has(recurso2)){
        return {
            error: true,
            mensaje: "Los recursos no son validos"
        }
    }

    //* Verificar que la banca tenga suficientes recursos
    if(recurso1 == recurso2){
        if(banca.recursos.get(recurso1) < 2){
            return {
                error: true,
                mensaje: "La banca no tiene suficientes recursos"
            }
        }
    }else{
        if(banca.recursos.get(recurso1) < 1 || banca.recursos.get(recurso2) < 1){
            return {
                error: true,
                mensaje: "La banca no tiene suficienter recursos"
            }
        }
    }

    
    return null;
}