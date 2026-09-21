// Chat de la partida. Los mensajes NO viven aqui: llegan por props desde
// Partida.tsx. Por eso el mismo componente puede estar en la columna lateral
// y dentro de la ventana de negociar mostrando exactamente lo mismo.

import { useEffect, useRef, useState, type FormEvent } from 'react';

import './chat.css';

// hora se guarda aunque ya no se muestre: sirve para ordenar los mensajes
export interface Mensaje {
  id: string;
  autor: string;
  texto: string;
  hora: number;
}

interface Props {
  mensajes: Mensaje[];
  yoSoy: string;
  onEnviar?: (texto: string) => void;
}

// Tope de caracteres por mensaje.
const LARGO_MAXIMO = 200;

/*Chat de la partida*/
function Chat({ mensajes, yoSoy, onEnviar }: Props) {
  // Lo unico que este componente recuerda es lo que el jugador esta escribiendo.
  const [borrador, setBorrador] = useState('');
  // useRef guarda una referencia al div real del DOM. que es justo lo que
  // se necesita para mover el scroll.
  const listaRef = useRef<HTMLDivElement>(null);

  // bajar el scroll cuando llega un mensaje
  useEffect(() => {
    const el = listaRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [mensajes.length]);

  function enviar(e: FormEvent) {
    // preventDefault es obligatorio para que el <form> no recargue la pagina al enviar.
    e.preventDefault();
    const texto = borrador.trim();
    if (texto === '') return;
    onEnviar?.(texto);
    setBorrador('');
  }

  return (
    <div className="chMarco">
      <span className="chTitulo">Chat</span>

      <div className="chLista" ref={listaRef}>
        {mensajes.length === 0 ? (
          <p className="chVacio">Todavía no hay mensajes.</p>
        ) : (
          mensajes.map((m) => (
            <div key={m.id} className={m.autor === yoSoy ? 'chMensaje chMio' : 'chMensaje'}>
              <div className="chCabecera">
                <span className="chAutor">{m.autor}</span>
              </div>
              <p className="chTexto">{m.texto}</p>
            </div>
          ))
        )}
      </div>

      {/* Con <form> el Enter envia solo, sin escribir codigo para ello */}
      <form className="chForma" onSubmit={enviar}>
        <input
          className="chEntrada"
          type="text"
          // Campo controlado: el <input> no guarda su propio texto, muestra lo
          // que dice borrador. Por eso setBorrador('') lo vacia al enviar.
          value={borrador}
          onChange={(e) => setBorrador(e.target.value)}
          placeholder="Escribe un mensaje…"
          maxLength={LARGO_MAXIMO}
        />
        <button className="chEnviar" type="submit" disabled={borrador.trim() === ''}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default Chat;