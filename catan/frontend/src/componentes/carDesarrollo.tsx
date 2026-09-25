import type { Cartas, Jugador } from '../common/jugador';
import { CARTA, NOMBRE_CARTA } from '../common/jugador';
import './carDesarrollo.css';

const CARTAS: { clave: keyof Cartas; icono: string }[] = [
  { clave: CARTA.CABALLERO, icono: '/svg/caballero.svg' },
  { clave: CARTA.PUNTOS_VICTORIA, icono: '/svg/puntosVictoria.svg' },
  { clave: CARTA.CARRETERAS, icono: '/svg/carreteras.svg' },
  { clave: CARTA.ABUNDANCIA, icono: '/svg/abundancia.svg' },
  { clave: CARTA.MONOPOLIO, icono: '/svg/monopolio.svg' },
];

interface Props {
  miJugador?: Jugador;
}

function CarDesarrollo({ miJugador }: Props) {
  return (
    <div className="cdMarco">
      <h3 className="cdTitulo">Mis cartas</h3>
      {miJugador ? (
        <>
          <ul className="cdLista">
              {CARTAS.map(({ clave, icono }) => {
              /* La cantidad grande es lo que se puede jugar AHORA. Las compradas
                 este turno no cuentan ahi: salen aparte como +n, porque no se
                 pueden usar hasta el siguiente turno. */
              const usables = miJugador.cartas_usables[clave];
              const nuevas = miJugador.cartas_inusables[clave];
              return (
                <li
                  key={clave}
                  className="cdFila"
                  title={NOMBRE_CARTA[clave]}
                >
                  <img className="cdIcono" src={icono} alt={NOMBRE_CARTA[clave]} />
                  <span className="cdNombre">{NOMBRE_CARTA[clave]}</span>
                  {nuevas > 0 && (
                    <span className="cdNuevas" title="Compradas este turno: se podran usar hasta tu siguiente turno">
                      +{nuevas}
                    </span>
                  )}
                  <span className="cdCantidad">{usables}</span>
                </li>
              );
            })}
          </ul>
          <button className="cdBoton" disabled>
            {/*usar este boton para desplegar la descripcion y uso de las cartas de desarollo */}
            Usar carta
          </button>
        </>
      ) : (
        <p className="cdAviso">sin jugador</p>
      )}
    </div>
  );
}

export default CarDesarrollo;