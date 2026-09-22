import { MapSchema, Schema, type } from "@colyseus/schema";
import { Jugador } from "./Jugador.js";

export class OfertaIntercambio extends Schema {

    @type("string") jugador: string;
    @type("string") recursoOfrecido: string;
    @type("uint8") cantidadOfrecida: number;
    @type("string") recursoSolicitado: string;
    @type("uint8") cantidadSolicitada: number;

    @type({ map: "int8" })
    respuestas = new MapSchema<number>();

    constructor(){
        super();
        this.jugador = "";
        this.recursoOfrecido = "";
        this.cantidadOfrecida = 0;
        this.recursoSolicitado = "";
        this.cantidadSolicitada = 0;
    }

    setOferta(
        jugador: string,
        jugadores: MapSchema<Jugador>,
        recursoOfrecido: string,
        cantidadOfrecida: number,
        recursoSolicitado: string,
        cantidadSolicitada: number
    ){
        this.jugador = jugador;
        this.recursoOfrecido = recursoOfrecido;
        this.cantidadOfrecida = cantidadOfrecida;
        this.recursoSolicitado = recursoSolicitado;
        this.cantidadSolicitada = cantidadSolicitada;

        this.respuestas.clear();
        for (const [sessionId] of jugadores) {
            if(sessionId !== jugador) this.respuestas.set(sessionId, 0);
        }
    }

    registrarRespuesta(jugador: string, respuesta: number){
        this.respuestas.set(jugador, respuesta);
    }

    todosRechazaron(){
        for (const respuesta of this.respuestas.values()){
            if(respuesta !== -1) return false;
        }
        return true;
    }

    limpiarOferta(){
        this.jugador = "";
        this.recursoOfrecido = "";
        this.cantidadOfrecida = 0;
        this.recursoSolicitado = "";
        this.cantidadSolicitada = 0;
        this.respuestas.clear();
    }

}