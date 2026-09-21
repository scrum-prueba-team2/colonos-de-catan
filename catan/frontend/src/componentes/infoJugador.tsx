import './infoJugador.css';

export interface Jugador {
  nombre: string;
  color: string;
  puntos: number;
  cartas: number;
  recursos: number;
}

interface Props {
  jugador: Jugador;
}

// Ficha de un jugador.
// Muestra nombre, color, puntos, cartas en la mano y recursos.
function InfoJugador({ jugador }: Props) {
  return (
    <div className="infoJugador">
      <div className="ijNombre">
        <strong>{jugador.nombre}</strong>
        <span><b>{jugador.color}</b></span>
      </div>
      <div className="ijDatos">
        <span><b>{jugador.puntos}</b> pts</span>
        <span><b>{jugador.cartas}</b> cartas</span>
        <span><b>{jugador.recursos}</b> recursos</span>
      </div>
    </div>
  );
}

export default InfoJugador;