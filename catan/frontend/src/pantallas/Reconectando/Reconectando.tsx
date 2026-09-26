import "./Reconectando.css";
import Decoracion from "../Decoracion/Decoracion";

// Se muestra al cargar la página mientras se intenta volver a la sala
// con el token guardado. Dura como mucho lo que tarde el servidor en
// aceptar o rechazar la reconexión.
function Reconectando() {
  return (
    <div className="reconectando tema-fondo">
      <Decoracion />
      <div className="reconectando__card tema-pergamino tema-aparecer" role="status" aria-live="polite">
        <span className="reconectando__hex" aria-hidden="true" />
        <h1>Volviendo a tu partida…</h1>
        <p>Estamos recuperando tu lugar en la sala. Tus recursos y construcciones siguen ahí.</p>
        <span className="reconectando__puntos" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </div>
    </div>
  );
}

export default Reconectando;
