import { MapSchema } from "@colyseus/schema";
import { Jugador } from "../schemas/Jugador.js";
import { OfertaIntercambio } from "../schemas/OfertaIntercambio.js";

export function intercambiarRecursos(
    jugadorOferente: string,
    jugadorAceptante: string,
    jugadores: MapSchema<Jugador>,
    oferta: OfertaIntercambio
) {
    const oferente = jugadores.get(jugadorOferente);
    const aceptante = jugadores.get(jugadorAceptante);

    oferente.recursos.set(
        oferta.recursoOfrecido,
        oferente.recursos.get(oferta.recursoOfrecido) - oferta.cantidadOfrecida
    );

    aceptante.recursos.set(
        oferta.recursoOfrecido,
        aceptante.recursos.get(oferta.recursoSolicitado) - oferta.cantidadSolicitada
    );

    oferente.recursos.set(
        oferta.recursoSolicitado,
        oferente.recursos.get(oferta.recursoSolicitado) + oferta.cantidadSolicitada
    );

    aceptante.recursos.set(
        oferta.recursoOfrecido,
        aceptante.recursos.get(oferta.recursoOfrecido) + oferta.cantidadOfrecida
    );
}