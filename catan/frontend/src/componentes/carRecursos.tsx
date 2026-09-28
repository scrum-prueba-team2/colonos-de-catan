import { Card, ListGroup } from 'react-bootstrap';
import type { Jugador, Recurso } from '../common/jugador';
import { RECURSOS } from '../common/jugador';

const ICONO: Record<Recurso, string> = {
  madera:   '/svg/madera.svg',
  trigo:    '/svg/trigo.svg',
  lana:     '/svg/lana.svg',
  ladrillo: '/svg/ladrillo.svg',
  mineral:  '/svg/piedra.svg',
};

interface Props {
  miJugador?: Jugador;
}

function CarRecursos({ miJugador }: Props) {
  return (
    <Card className="h-100 w-100 overflow-y-auto overflow-x-hidden d-flex flex-column">
      <h3 className="text-center fs-6 fw-bold border-bottom mb-0 py-1">Mis recursos</h3>

      {miJugador ? (
        <ListGroup variant="flush" className="flex-fill">
          {RECURSOS.map((recurso) => (
            <ListGroup.Item
              key={recurso}
              title={recurso}
              className="d-flex align-items-center gap-2 py-0 text-capitalize"
            >
              <img src={ICONO[recurso]} alt={recurso} width={30} height={30} />
              <span className="flex-grow-1 text-truncate">{recurso}</span>
              <span className="fw-bold">{miJugador.recursos[recurso]}</span>
            </ListGroup.Item>
          ))}
        </ListGroup>
      ) : (
        <p className="text-muted text-center my-auto">sin jugador</p>
      )}
    </Card>
  );
}

export default CarRecursos;