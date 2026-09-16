import "./ElegirModo.css";

interface ElegirModoProps {
  onCrear: () => void;
  onUnirse: () => void;
  onVolver: () => void;
}

function ElegirModo({ onCrear, onUnirse, onVolver }: ElegirModoProps) {
  return (
    <div className="elegir">
      <button className="elegir__volver" onClick={onVolver}>
        ← Volver
      </button>

      <h1>¿Qué quieres hacer?</h1>
      <p>Puedes empezar una partida nueva o entrar a una que ya esté abierta.</p>

      <div className="elegir__opciones">
        <button className="elegir__opcion" onClick={onCrear}>
          <span className="elegir__opcion-titulo">Crear partida</span>
          <span className="elegir__opcion-detalle">
            Abre una sala nueva y espera a que se unan los demás jugadores.
          </span>
        </button>

        <button className="elegir__opcion" onClick={onUnirse}>
          <span className="elegir__opcion-titulo">Unirse a partida</span>
          <span className="elegir__opcion-detalle">
            Mira las salas públicas disponibles o ingresa un código.
          </span>
        </button>
      </div>
    </div>
  );
}

export default ElegirModo;