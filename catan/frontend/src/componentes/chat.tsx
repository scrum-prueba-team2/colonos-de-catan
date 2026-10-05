import { useEffect, useRef, useState } from 'react';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

// "chat" y "log", broadcast("chat", ...) y broadcast("log", ...). 
export type MensajeRegistro = { jugador: string; mensaje: string };

type Props = {
  /* Ya convertidos a texto plano: esta lista es lo unico que se pinta. */
  registro: string[];
  /* Sin sala no hay a donde enviar, asi que la caja se deshabilita. */
  onEnviar?: (texto: string) => void;
};

function Chat({ registro, onEnviar }: Props) {
  const [texto, setTexto] = useState('');
  const finDeLista = useRef<HTMLDivElement>(null);

  /* Sin esto la lista crece hacia abajo y lo ultimo queda fuera de vista. */
  useEffect(() => { finDeLista.current?.scrollIntoView(); }, [registro]);

  const enviar = (evento: React.FormEvent) => {
    evento.preventDefault();
    const limpio = texto.trim();
    if (!limpio || !onEnviar) return;
    onEnviar(limpio);
    setTexto('');
  };

  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column p-2 overflow-hidden">
        <div className="flex-grow-1 overflow-auto small" role="log">
          {registro.map((linea, i) => <div key={i}>{linea}</div>)}
          <div ref={finDeLista} />
        </div>
        <Form onSubmit={enviar} className="mt-2">
          <InputGroup size="sm">
            <Form.Control
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Mensaje"
              disabled={!onEnviar}
              aria-label="Mensaje de chat"
            />
            <Button type="submit" disabled={!onEnviar || texto.trim() === ''}>
              Enviar
            </Button>
          </InputGroup>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default Chat;