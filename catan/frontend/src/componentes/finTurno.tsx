import './finTurno.css';

// Recibe el nombre, no el jugador completo: el color ya se ve en la barra
// de arriba y aqui solo hace falta saber de quien es el turno.
interface Props {
  turnoDe: string;
  esMiTurno: boolean;
  onFinalizar?: () => void;
}


// Panel de fin de turno. Dice de quien es el turno, y si es el tuyo muestra
// el boton para terminarlo. 
function FinTurno({ turnoDe, esMiTurno, onFinalizar }: Props) {
  return (
    <div className={esMiTurno ? 'ftMarco ftMio' : 'ftMarco'}>
      {esMiTurno ? (
        <>
          <span className="ftEtiqueta">Es tu turno</span>
          <button className="ftBoton" onClick={onFinalizar}>
            Finalizar turno
          </button>
        </>
      ) : (
        <>
          <span className="ftEtiqueta">Turno de</span>
          <span className="ftNombre">{turnoDe}</span>
          <span className="ftEspera">esperando…</span>
        </>
      )}
    </div>
  );
}

export default FinTurno;