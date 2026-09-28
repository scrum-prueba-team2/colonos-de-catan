import "./ElegirModo.css";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

interface ElegirModoProps {
  nombreJugador?: string;
  onCrear: () => void;
  onUnirse: () => void;
  onVolver: () => void;
  onCambiarNombre?: () => void;
}

function ElegirModo({ nombreJugador, onCrear, onUnirse, onVolver, onCambiarNombre }: ElegirModoProps) {
  return (
    <div className="bg-info-subtle min-vh-100 px-3 py-4">
      <div className="mx-auto d-flex flex-column align-items-start elegir__contenido">
        <Button variant="text" onClick={onVolver}>
          ← Volver
        </Button>

        <header className="mt-4 mb-4">
          {nombreJugador && (
            <p className="d-flex flex-wrap align-items-baseline gap-2 mb-1 fs-5">
              <span>
                ¡Hola, <strong>{nombreJugador}</strong>!
              </span>
              {onCambiarNombre && (
                <Link component="button" variant="body2" onClick={onCambiarNombre}>
                  cambiar nombre
                </Link>
              )}
            </p>
          )}
          <Typography variant="h4" component="h1" gutterBottom>
            ¿Qué quieres hacer?
          </Typography>
          <p className="mb-0 text-body-secondary">
            Puedes empezar una partida nueva o entrar a una que ya esté abierta.
          </p>
        </header>

        <div className="elegir__opciones">
          <button className="elegir__opcion elegir__opcion--crear tema-pergamino" onClick={onCrear}>
            <span className="elegir__opcion-icono" aria-hidden="true">
              <img src="/svg/ciudad.svg" alt="" />
            </span>
            <span className="elegir__opcion-titulo">Crear partida</span>
            <span className="elegir__opcion-detalle">
              Abre una sala nueva, pública o privada, y espera a que se unan los demás jugadores.
            </span>
          </button>

          <button className="elegir__opcion elegir__opcion--unirse tema-pergamino" onClick={onUnirse}>
            <span className="elegir__opcion-icono" aria-hidden="true">
              <img src="/svg/carretera.svg" alt="" />
            </span>
            <span className="elegir__opcion-titulo">Unirse a partida</span>
            <span className="elegir__opcion-detalle">
              Mira las salas disponibles o entra con el identificador que te compartieron.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElegirModo;
