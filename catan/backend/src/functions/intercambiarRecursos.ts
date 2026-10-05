import { MapSchema } from "@colyseus/schema";
import { Jugador } from "../schemas/Jugador.js";
import { OfertaIntercambio } from "../schemas/OfertaIntercambio.js";

export function intercambiarRecursos(
    jugadorOferente: string,
    jugadorAceptante: string,
    jugadores: MapSchema<Jugador>,
    oferta: OfertaIntercambio
){
    const oferente = jugadores.get(jugadorOferente);
    const aceptante = jugadores.get(jugadorAceptante);

    //* Restar los recursos ofrecidos al que ofrece
    oferente.recursos.set(
        oferta.recursoOfrecido,
        oferente.recursos.get(oferta.recursoOfrecido) - oferta.cantidadOfrecida   
    );

    //* Restar los recursos solicitados al que acepta
    aceptante.recursos.set(
        oferta.recursoSolicitado,
        aceptante.recursos.get(oferta.recursoSolicitado) - oferta.cantidadSolicitada
    );

    //* Sumar los recursos solicitados al que ofrece
    oferente.recursos.set(
        oferta.recursoSolicitado,
        oferente.recursos.get(oferta.recursoSolicitado) + oferta.cantidadSolicitada
    );

    //* Sumar los recursos ofrecidos al que acepta
    aceptante.recursos.set(
        oferta.recursoOfrecido,
        aceptante.recursos.get(oferta.recursoOfrecido) + oferta.cantidadOfrecida
    );
}