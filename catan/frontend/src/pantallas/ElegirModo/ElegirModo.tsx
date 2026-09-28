import "./ElegirModo.css";

interface ElegirModoProps {
  nombreJugador?: string;
  onCrear: () => void;
  onUnirse: () => void;
  onVolver: () => void;
  onCambiarNombre?: () => void;
}

function ElegirModo({ nombreJugador, onCrear, onUnirse, onVolver, onCambiarNombre }: ElegirModoProps) {
  return (
    <div className="bg-info-subtle min-vh-100 px-3 py-4">
      <div className="mx-auto d-flex flex-column align-items-start elegir__contenido">
        <button className="tema-volver" onClick={onVolver}>
          ← Volver
        </button>

        <header className="elegir__header tema-aparecer">
          {nombreJugador && (
            <p className="elegir__saludo">
              <span>
                ¡Hola, <strong>{nombreJugador}</strong>!
              </span>
              {onCambiarNombre && (
                <button className="elegir__cambiar" onClick={onCambiarNombre}>
                  cambiar nombre
                </button>
              )}
            </p>
          )}
          <h1>¿Qué quieres hacer?</h1>
          <p>Puedes empezar una partida nueva o entrar a una que ya esté abierta.</p>
        </header>

        <div className="elegir__opciones">
          <button className="elegir__opcion elegir__opcion--crear tema-pergamino" onClick={onCrear}>
            <span className="elegir__opcion-icono" aria-hidden="true">
              <img src="/svg/ciudad.svg" alt="" />
            </span>
            <span className="elegir__opcion-titulo">Crear partida</span>
            <span className="elegir__opcion-detalle">
              Abre una sala nueva, pública o privada, y espera a que se unan los demás jugadores.
            </span>
          </button>

          <button className="elegir__opcion elegir__opcion--unirse tema-pergamino" onClick={onUnirse}>
            <span className="elegir__opcion-icono" aria-hidden="true">
              <img src="/svg/carretera.svg" alt="" />
            </span>
            <span className="elegir__opcion-titulo">Unirse a partida</span>
            <span className="elegir__opcion-detalle">
              Mira las salas disponibles o entra con el identificador que te compartieron.
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElegirModo;
