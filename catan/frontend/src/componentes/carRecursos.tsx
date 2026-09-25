import type { Jugador, Recurso } from '../common/jugador';
import { RECURSOS } from '../common/jugador';
import './carRecursos.css';

const ICONO: Record<Recurso, string> = {
  madera: '/svg/madera.svg',
  trigo: '/svg/trigo.svg',
  lana: '/svg/lana.svg',
  ladrillo: '/svg/ladrillo.svg',
  mineral: '/svg/piedra.svg',
};

interface Props {
  // Opcional: si todavia no hay jugador se avisa, en vez de fallar.
  miJugador?: Jugador;
}

function CarRecursos({ miJugador }: Props) {
  return (
    <div className="crMarco">
      <h3 className="crTitulo">Mis recursos</h3>
      {miJugador ? (
        <ul className="crLista">
          {RECURSOS.map((recurso) => {
            const cantidad = miJugador.recursos[recurso];
            return (
              <li
                key={recurso}
                className="crFila"
                title={recurso}
              >
                <img className="crIcono" src={ICONO[recurso]} alt={recurso} />
                <span className="crNombre">{recurso}</span>
                <span className="crCantidad">{cantidad}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="crAviso">sin jugador</p>
      )}
    </div>
  );
}

export default CarRecursos;