import { Card, ListGroup } from 'react-bootstrap';
import type { Banca } from '../common/banca';
import type { Jugador } from '../common/jugador';
import { RECURSOS, PIEZA, NOMBRE_PIEZA } from '../common/jugador';

interface Props {
  banca: Banca;
  miJugador?: Jugador;
}

function Existencias({ banca, miJugador }: Props) {
  return (
    <Card className="h-100 w-100 overflow-y-auto overflow-x-hidden d-flex flex-column">
      <div className="d-flex flex-column flex-grow-1">
        <h3 className="text-center fs-6 fw-bold border-bottom mb-0 py-1">Banca</h3>
        <ListGroup variant="flush" className="flex-fill">
          {RECURSOS.map((r) => (
            <ListGroup.Item
              key={r}
              className="d-flex justify-content-between align-items-center py-0 text-capitalize"
            >
              <span className="text-truncate">{r}</span>
              <span className="fw-bold">{banca.recursos[r]}</span>
            </ListGroup.Item>
          ))}
          <ListGroup.Item
            className="d-flex justify-content-between align-items-center py-0"
            title="Cartas de desarrollo que quedan en el mazo"
          >
            <span className="text-truncate">Desarrollo</span>
            <span className="fw-bold">{banca.cartas.length}</span>
          </ListGroup.Item>
        </ListGroup>
      </div>

      <div className="d-flex flex-column">
        <h3 className="text-center fs-6 fw-bold border-bottom mb-0 py-1">
          Piezas disponibles
        </h3>
        {miJugador ? (
          <ListGroup variant="flush">
            {[PIEZA.ASENTAMIENTO, PIEZA.CIUDAD, PIEZA.CAMINO].map((pieza) => (
              <ListGroup.Item
                key={pieza}
                className="d-flex justify-content-between align-items-center py-0"
              >
                <span className="text-truncate">{NOMBRE_PIEZA[pieza]}</span>
                <span className="fw-bold">
                  {miJugador.construccionesDisponibles[pieza]}
                </span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : (
          <p className="text-muted text-center my-auto">sin jugador</p>
        )}
      </div>
    </Card>
  );
}

export default Existencias;