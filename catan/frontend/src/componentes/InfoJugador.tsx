import type { CSSProperties } from 'react';

import './InfoJugador.css';

// La forma de un jugador. Cuando el backend defina la suya, este tipo se
// muda a packages/shared y aqui solo queda el import.
export interface Jugador {
  nombre: string;
  color: string;
  puntos: number;
  cartas: number;
}

// enTurno lleva ? porque es opcional: si no se pasa, vale false.
interface Props {
  jugador: Jugador;
  enTurno?: boolean;   
}

// Ficha de un jugador.
// Muestra nombre, color, puntos y cuantas cartas tiene en la mano.
function InfoJugador({ jugador, enTurno = false }: Props) {
  const estilo = { '--color-jugador': jugador.color } as CSSProperties;

  return (
    <div className={enTurno ? 'infoJugador ijTurno' : 'infoJugador'} style={estilo}>
      <div className="ijNombre">
        <span className="ijPunto"></span>
        <strong>{jugador.nombre}</strong>
      </div>
      <div className="ijDatos">
        <span><b>{jugador.puntos}</b> pts</span>
        <span><b>{jugador.cartas}</b> cartas</span>
      </div>
    </div>
  );
}

export default InfoJugador;