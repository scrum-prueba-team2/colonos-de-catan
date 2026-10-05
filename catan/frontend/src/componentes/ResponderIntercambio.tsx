import { Button, Stack, Typography } from "@mui/material";
import type { Recurso, Recursos } from "../common/jugador";
import type { Oferta } from "../common/partida";

// Lo que espera msgResponderIntercambio en CatanRoom: 1 acepta, -1 rechaza.
export type Respuesta = 1 | -1;

interface Props {
    oferta: Oferta;
    nombreOferente: string;
    misRecursos?: Recursos;
    enviando: boolean;
    onResponder: (respuesta: Respuesta) => void;
}

//* Se muestra a los jugadores que todavia no respondieron la propuesta activa

function ResponderIntercambio({ oferta, nombreOferente, misRecursos, enviando, onResponder }: Props) {
    /* Sin lo que se pide, aceptar no sirve: el backend lo cambia a "no". Por eso
       en ese caso solo se deja rechazar. */
    const tengo = misRecursos?.[oferta.recursoSolicitado as Recurso] ?? 0;
    const alcanza = tengo >= oferta.cantidadSolicitada;

    return (
        <div className="h-100 w-100 d-flex flex-column border rounded bg-white overflow-hidden">
            <h3 className="text-center fs-6 fw-bold border-bottom mb-0 py-1">Negociar</h3>

            <div className="flex-fill d-flex flex-column justify-content-center gap-2 p-2 text-center">
                <Typography variant="body2">
                    <strong>{nombreOferente}</strong> te ofrece{' '}
                    <strong>{oferta.cantidadOfrecida} {oferta.recursoOfrecido}</strong> a cambio de{' '}
                    <strong>{oferta.cantidadSolicitada} {oferta.recursoSolicitado}</strong>.
                </Typography>
                {!alcanza && (
                    <small className="text-danger">
                        Tienes {tengo} {oferta.recursoSolicitado}: no te alcanza para aceptar.
                    </small>
                )}

                <Stack direction="row" spacing={1} sx={{ justifyContent: 'center' }}>
                    <Button
                        variant="outlined" color="error" size="small"
                        disabled={enviando}
                        onClick={() => onResponder(-1)}
                        aria-label="Rechazar la propuesta"
                    >
                        ❌ Rechazar
                    </Button>
                    <Button
                        variant="contained" color="success" size="small"
                        disabled={enviando || !alcanza}
                        onClick={() => onResponder(1)}
                        aria-label="Aceptar la propuesta"
                    >
                        ✅ Aceptar
                    </Button>
                </Stack>
            </div>
        </div>
    );
}

export default ResponderIntercambio;
