import type { Banca } from '../datos/bancaPruebas';
import type { Jugador } from '../datos/jugadoresPrueba';
import { RECURSOS, PIEZA, NOMBRE_PIEZA } from '../datos/jugadoresPrueba';
import './existencias.css';

interface Props {
  banca: Banca;
  miJugador?: Jugador;
}

function Existencias({ banca, miJugador }: Props) {
  return (
    <div className="exMarco">
      {/*lo que le queda a la banca, igual para todos*/}
      <div className="exBloque">
        <h3 className="exTitulo">Banca</h3>
        <ul className="exLista">
          {RECURSOS.map((recurso) => (
            <li key={recurso} className="exFila">
              <span className="exNombre">{recurso}</span>
              <span className="exCantidad">{banca.recursos[recurso]}</span>
            </li>
          ))}
          <li className="exFila exCartas" title="Cartas de desarrollo que quedan en el mazo">
            <span className="exNombre">Desarrollo</span>
            <span className="exCantidad">{banca.cartas.length}</span>
          </li>
        </ul>
      </div>

      {/*las piezas que le quedan al jugador, solo las suyas*/}
      <div className="exBloque">
        <h3 className="exTitulo">Piezas disponibles</h3>
        {miJugador ? (
          <ul className="exLista">
            {[PIEZA.ASENTAMIENTO, PIEZA.CIUDAD, PIEZA.CAMINO].map((pieza) => (
              <li key={pieza} className="exFila">
                <span className="exNombre">{NOMBRE_PIEZA[pieza]}</span>
                <span className="exCantidad">
                  {miJugador.construccionesDisponibles[pieza]}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="exVacio">sin jugador</p>
        )}
      </div>
    </div>
  );
}

export default Existencias;