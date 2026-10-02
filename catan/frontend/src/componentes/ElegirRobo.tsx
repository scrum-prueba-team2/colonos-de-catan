import { Button, Dialog, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import type { Jugadores } from "../common/jugador";

interface Props{
    abierto: boolean;
    jugadoresParaRobar: string[];
    jugadores: Jugadores;
    enviando: boolean;
    onRobar: (sessionId: string) => void;
}

//* Backend llena jugadoresParaRobar al mover al ladron cuando hay 2 o mas jugadores

function ElegirRobo({abierto, jugadoresParaRobar, jugadores, enviando, onRobar}: Props){
    return (
        <Dialog open={abierto} fullWidth maxWidth="xs" aria-labelledby="robar-titulo">
            {/*Titulo del modal*/}
            <DialogTitle id="robar-titulo">¿A quién quieres robar?</DialogTitle>

            {/*Cuerpo del modal*/}
            <DialogContent>
                <Typography color="text.secondary">
                    Se le quitará un recurso al azar.
                </Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                    {jugadoresParaRobar.map((id) => (
                        <Button
                            key={id}
                            variant="outlined"
                            disabled={enviando}
                            onClick={() => onRobar(id)}
                        >
                            {jugadores[id]?.nombre ?? id}
                        </Button>
                    ))}
                </Stack>
            </DialogContent>
        </Dialog>
    )
}

export default ElegirRobo;
