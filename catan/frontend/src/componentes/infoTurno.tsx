import type { CSSProperties } from "@mui/material";
import type { Jugadores } from "../common/jugador";

interface Props {
  sessionIdTurno: string;
  jugadores: Jugadores  
}

function getNombreTurno(sessionId:string, jugadores:Jugadores){

  return jugadores[sessionId].nombre;
}

function InfoTurno({sessionIdTurno, jugadores}: Props){
  const estilo = { "--color-jugador": '#f2e7d5' } as CSSProperties;
  return (
    <div className="ijFicha ijTurno" style={estilo} role="status" aria-live="polite">
      {/* Cabecera: nombre y puntuación. */}
      <div className="ijCabecera">
        <span className="ijNombre" style={{ color: '#000000' }}>Turno de: {getNombreTurno(sessionIdTurno, jugadores)}</span>
      </div>
    </div>
  );
}
export default InfoTurno