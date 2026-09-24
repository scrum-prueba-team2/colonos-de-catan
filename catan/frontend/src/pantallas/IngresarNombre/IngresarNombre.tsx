import { useState, type FormEvent } from "react";
import "./IngresarNombre.css";
import { LARGO_MAXIMO_NOMBRE, validarNombreJugador } from "../nombreJugador";

interface IngresarNombreProps {
  nombreInicial?: string;
  onConfirmar: (nombre: string) => void;
}

function IngresarNombre({ nombreInicial = "", onConfirmar }: IngresarNombreProps) {
  const [nombre, setNombre] = useState(nombreInicial);
  const [intentoEnviar, setIntentoEnviar] = useState(false);

  const error = validarNombreJugador(nombre);

  function confirmar(e: FormEvent) {
    e.preventDefault();
    setIntentoEnviar(true);
    if (!error) onConfirmar(nombre.trim());
  }

  return (
    <div className="ingresar-nombre">
      <form className="ingresar-nombre__card" onSubmit={confirmar}>
        <span className="ingresar-nombre__marca">Catan Online</span>
        <h1>¿Cómo te llamas?</h1>
        <p>Este nombre lo verán los demás jugadores en el lobby y durante la partida.</p>

        <input
          type="text"
          placeholder="Tu nombre de jugador"
          value={nombre}
          maxLength={LARGO_MAXIMO_NOMBRE}
          autoFocus
          onChange={(e) => setNombre(e.target.value)}
        />

        <span className="ingresar-nombre__error">{intentoEnviar && error ? error : " "}</span>

        <button type="submit" className="ingresar-nombre__btn" disabled={!nombre.trim()}>
          Continuar
        </button>
      </form>
    </div>
  );
}

export default IngresarNombre;
