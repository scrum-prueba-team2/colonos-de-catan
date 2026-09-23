// Datos de la partida: turnos jugados, tiempo total, ronda y el reloj de
// decision del turno actual. Los dos relojes se mueven con un solo temporizador.

import { useEffect, useState } from 'react';

import './infoPartida.css';

// inicio y finTurno son instantes, no contadores. Guardando CUANDO empezo,
// el tiempo transcurrido siempre es ahora - inicio, y el navegador lo calcula
// solo sin pedirle nada al servidor.
export interface DatosPartida {
  turno: number;      // turnos transcurridos
  ronda: number;      // ronda actual
  inicio: number;     // instante en que arrancó la partida
  finTurno: number;   // instante en que se vence el turno actual
}

interface Props {
  partida: DatosPartida;
}

// Convierte milisegundos a formato m:ss. Esta fuera del componente porque no
// usa ningun dato de el: entra un numero y sale un texto.
function reloj(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const min = Math.floor(total / 60);
  const seg = total % 60;
  return `${min}:${String(seg).padStart(2, '0')}`;
}

function InfoPartida({ partida }: Props) {
  // La flecha es obligatoria: sin ella, Date.now() se ejecutaria en cada
  // render aunque React tire el resultado, y ESLint lo marca como error.
  const [ahora, setAhora] = useState(() => Date.now());

  // Un solo setInterval mueve los dos relojes. No cuenta nada: solo actualiza
  // ahora una vez por segundo, y los dos valores son restas contra el.
  // El return es la limpieza: si no, el temporizador seguiria corriendo
  // para siempre despues de salir de la partida.
  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // El de partida sube (ahora - inicio) y el de decision baja (finTurno - ahora).
  // Cuando el servidor mande un finTurno nuevo, el contador se reinicia solo.
  const restante = partida.finTurno - ahora;
  const apurado = restante <= 10000;

  return (
    <div className="ipMarco">
      <div className="ipCelda">
        <span className="ipEtiqueta">Turnos</span>
        <span className="ipValor">{partida.turno}</span>
      </div>
      <div className="ipCelda">
        <span className="ipEtiqueta">Partida</span>
        <span className="ipValor ipReloj">{reloj(ahora - partida.inicio)}</span>
      </div>
      <div className="ipCelda">
        <span className="ipEtiqueta">Ronda</span>
        <span className="ipValor">{partida.ronda}</span>
      </div>
      <div className="ipCelda">
        <span className="ipEtiqueta">Decisión</span>
        <span className={apurado ? 'ipValor ipReloj ipApurado' : 'ipValor ipReloj'}>
          {reloj(restante)}
        </span>
      </div>
    </div>
  );
}

export default InfoPartida;