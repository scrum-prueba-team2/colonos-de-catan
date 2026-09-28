import { Card, ListGroup } from 'react-bootstrap';

type Recurso = { img: string; cantidad?: number };
type Fila = { icono: string; nombre: string; recursos: Recurso[] };

const RECURSOS = {
  madera:   '/svg/madera.svg',
  ladrillo: '/svg/ladrillo.svg',
  trigo:    '/svg/trigo.svg',
  lana:     '/svg/lana.svg',
  piedra:   '/svg/piedra.svg',
} as const;

const FILAS: Fila[] = [
  { icono: '/svg/carretera.svg', nombre: 'Carretera',
    recursos: [{ img: RECURSOS.madera }, { img: RECURSOS.ladrillo }] },
  { icono: '/svg/poblado.svg', nombre: 'Poblado',
    recursos: [{ img: RECURSOS.madera }, { img: RECURSOS.ladrillo }, { img: RECURSOS.trigo }, { img: RECURSOS.lana }] },
  { icono: '/svg/ciudad.svg', nombre: 'Ciudad',
    recursos: [{ img: RECURSOS.trigo, cantidad: 2 }, { img: RECURSOS.piedra, cantidad: 3 }] },
  { icono: '/svg/desarrollo.svg', nombre: 'Carta de desarrollo',
    recursos: [{ img: RECURSOS.trigo }, { img: RECURSOS.lana }, { img: RECURSOS.piedra }] },
];

function TablaCostes() {
  return (
    <Card className="h-100 w-100 overflow-hidden d-flex flex-column">
      <Card.Header as="h2" className="text-center fs-5 shrink-0 py-1">
        Tabla de costes
      </Card.Header>
      <ListGroup variant="flush" className="flex-fill overflow-hidden d-flex flex-column">
        {FILAS.map(({ icono, nombre, recursos }) => (
          <ListGroup.Item
            key={nombre}
            className="d-flex align-items-center flex-fill overflow-hidden min-w-0 py-0 px-1">
            <img src={icono} alt={nombre} width={32} height={32} />
            <span className="flex-grow-1 text-truncate ms-1">{nombre}</span>
            {recursos.map(({ img, cantidad }) => (
              <span key={img} className="d-flex align-items-center">
                {cantidad && <span className="ms-1">{cantidad}</span>}
                <img src={img} alt="" width={32} height={32} />
              </span>
            ))}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
}

export default TablaCostes;