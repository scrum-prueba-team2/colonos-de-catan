import { useState, type FormEvent } from "react";
import "./IngresarNombre.css";
import Decoracion from "../Decoracion/Decoracion";
import { LARGO_MAXIMO_NOMBRE, validarNombreJugador } from "../nombreJugador";

interface IngresarNombreProps {
  nombreInicial?: string;
  onConfirmar: (nombre: string) => void;
  onVolver?: () => void;
}

function IngresarNombre({ nombreInicial = "", onConfirmar, onVolver }: IngresarNombreProps) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  const error = validarNombreJugador(nombre);
  const mostrarError = intentoEnviar && error;

  function confirmar(e: FormEvent) {
    e.preventDefault();
    setIntentoEnviar(true);
    if (!error) onConfirmar(nombre.trim());
  }

  return (
    <div className="ingresar-nombre tema-fondo">
      <Decoracion />

      <div className="ingresar-nombre__contenido">
        {onVolver && (
          <button type="button" className="tema-volver" onClick={onVolver}>
            ← Volver
          </button>
        )}

        <form className="ingresar-nombre__card tema-pergamino tema-aparecer" onSubmit={confirmar}>
          <span className="ingresar-nombre__icono" aria-hidden="true">
            <img src="/svg/poblado.svg" alt="" />
          </span>
          <span className="tema-insignia tema-insignia--marca">Catan Online</span>
          <h1>¿Cómo te llamas, colono?</h1>
          <p>Este nombre lo verán los demás jugadores en el lobby y durante la partida.</p>

          <label className="tema-etiqueta" htmlFor="nombre-jugador">
            Tu nombre de jugador
          </label>
          <input
            id="nombre-jugador"
            className={"tema-input" + (mostrarError ? " tema-input--error" : "")}
            type="text"
            placeholder="Ej. Colono Valiente"
            value={nombre}
            maxLength={LARGO_MAXIMO_NOMBRE}
            autoFocus
            aria-invalid={Boolean(mostrarError)}
            aria-describedby="nombre-jugador-ayuda"
            onChange={(e) => setNombre(e.target.value)}
          />

          <span className="tema-ayuda" id="nombre-jugador-ayuda">
            <span className="tema-error">{mostrarError ? error : ""}</span>
            <span>
              {nombre.trim().length}/{LARGO_MAXIMO_NOMBRE}
            </span>
          </span>

          <button type="submit" className="ingresar-nombre__btn tema-btn tema-btn--ancho" disabled={!nombre.trim()}>
            Continuar →
          </button>
        </form>
      </div>
    </div>
  );
}

export default IngresarNombre;
