// Boton de tirar el dado. Solo aparece si es tu turno; si no, se ve nada mas
// el ultimo numero que salio.

import { useEffect, useState } from 'react';

import './tirarDado.css';

// Duracion real del gif public/gif/Dados.gif, medida fotograma a fotograma.
const DURACION_GIF = 2900;   // medido: el gif dura 2.9 s exactos

interface Props {
  esMiTurno: boolean;
  ultimoDado: number | null;
  onTirar?: () => void;
}

function TirarDado({ esMiTurno, ultimoDado, onTirar }: Props) {
  const [girando, setGirando] = useState(false);
  // Este contador no se muestra en ningun lado. Existe solo para cambiar el
  // key del <img> y forzar que el gif vuelva a empezar desde el fotograma 0.
  const [tirada, setTirada] = useState(0);

  // Cuando pasa la duracion del gif, deja de girar y aparece el numero.
  useEffect(() => {
    if (!girando) return;
    const id = setTimeout(() => setGirando(false), DURACION_GIF);
    return () => clearTimeout(id);
  }, [girando]);

  // setTirada con una funcion porque el valor nuevo depende del anterior.
  function tirar() {
    setTirada((n) => n + 1);
    setGirando(true);
    onTirar?.();
  }

  return (
    <div className="tdMarco">
      <span className="tdEtiqueta">{esMiTurno ? 'Tu turno' : 'Último dado'}</span>

      {/* El gif y el numero comparten este hueco para que el panel no brinque */}
      <div className="tdCaja">
        {girando ? (
          <img key={tirada} className="tdGif" src="/gif/Dados.gif" alt="Dados girando" />
        ) : (
          <span className="tdNumero">{ultimoDado ?? '.'}</span>
        )}
      </div>

      {esMiTurno && (
        <button className="tdBoton" onClick={tirar} disabled={girando}>
          {girando ? 'Tirando…' : 'Tirar dado'}
        </button>
      )}
    </div>
  );
}

export default TirarDado;