import { Badge, Button, Card, ListGroup } from 'react-bootstrap';
import type { Cartas, Jugador } from '../common/jugador';
import { CARTA, NOMBRE_CARTA } from '../common/jugador';

const CARTAS: { clave: keyof Cartas; icono: string }[] = [
  { clave: CARTA.CABALLERO,       icono: '/svg/caballero.svg' },
  { clave: CARTA.PUNTOS_VICTORIA, icono: '/svg/puntosVictoria.svg' },
  { clave: CARTA.CARRETERAS,      icono: '/svg/carreteras.svg' },
  { clave: CARTA.ABUNDANCIA,      icono: '/svg/abundancia.svg' },
  { clave: CARTA.MONOPOLIO,       icono: '/svg/monopolio.svg' },
];

interface Props {
  miJugador?: Jugador;
}

function CarDesarrollo({ miJugador }: Props) {
  return (
    <Card className="h-100 w-100 overflow-y-auto overflow-x-hidden d-flex flex-column">
      <h3 className="text-center fs-6 fw-bold border-bottom mb-0 py-1">Mis cartas</h3>
      {miJugador ? (
        <>
          <ListGroup variant="flush" className="flex-fill">
            {CARTAS.map(({ clave, icono }) => {
              const usables = miJugador.cartas_usables[clave];
              const nuevas = miJugador.cartas_inusables[clave];
              return (
                <ListGroup.Item
                  key={clave}
                  title={NOMBRE_CARTA[clave]}
                  className="d-flex align-items-center gap-2 py-0"
                >
                  <img src={icono} alt={NOMBRE_CARTA[clave]} width={24} height={24} />
                  <span className="flex-grow-1 text-truncate">{NOMBRE_CARTA[clave]}</span>
                  {nuevas > 0 && (
                    <Badge
                      bg="secondary"
                      title="Compradas este turno: se podrán usar hasta tu siguiente turno"
                    >
                      +{nuevas}
                    </Badge>
                  )}
                  <span className="fw-bold">{usables}</span>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <Button variant="outline-secondary" size="sm" disabled className="m-0 flex-shrink-0">
            {/* usar este botón para desplegar la descripción y uso de las cartas de desarrollo */}
            Usar carta
          </Button>
        </>
      ) : (
        <p className="text-muted text-center my-auto">sin jugador</p>
      )}
    </Card>
  );
}

export default CarDesarrollo;