import { useState } from 'react';
import { tableroPrueba } from '../datos/tableroPrueba'
import { jugadoresPrueba } from '../datos/jugadoresPrueba';
import TablaCostes from '../componentes/tablaCostes';
import Tablero from '../componentes/tablero';
import InfoJugador from '../componentes/infoJugador';
import Construir, {
  type ObjetivoConstruccion,
  type RecursosConstruccion,
  type SolicitudConstruccion,
  type TipoConstruccion,
} from '../componentes/construir';

import './Partida.css'

// Mientras la conexión de la issue #25 no esté integrada, estos recursos solo
// sirven para probar la interfaz. El estado real debe llegar desde el jugador
// que publica Colyseus, nunca calcularse de forma definitiva en el cliente.
const recursosPrueba: RecursosConstruccion = {
  madera: 2,
  ladrillo: 2,
  lana: 1,
  trigo: 2,
  mineral: 3,
};

interface Props {
  // La capa de conexión inyectará aquí una función equivalente a:
  // room.send('construir', solicitud).
  // Así esta pantalla no crea una segunda conexión al backend.
  onSolicitarConstruccion?: (solicitud: SolicitudConstruccion) => void;
}

// Pantalla principal de la partida. Contiene todos los componentes de la partida.
function Partida({ onSolicitarConstruccion }: Props) {
  const [tipoConstruccion, setTipoConstruccion] = useState<TipoConstruccion | null>(null);
  const [objetivoConstruccion, setObjetivoConstruccion] = useState<ObjetivoConstruccion | null>(null);
  const [estadoConstruccion, setEstadoConstruccion] = useState('');

  function seleccionarConstruccion(tipo: TipoConstruccion | null) {
    setTipoConstruccion(tipo);
    // Un objetivo elegido para una pieza no se puede reutilizar para otra.
    setObjetivoConstruccion(null);
    setEstadoConstruccion('');
  }

  function seleccionarObjetivo(objetivo: ObjetivoConstruccion) {
    if (!tipoConstruccion) return;

    const solicitud: SolicitudConstruccion = { tipo: tipoConstruccion, objetivo };
    setObjetivoConstruccion(objetivo);

    // La validación definitiva (turno, recursos, legalidad y propiedad) vive
    // en CatanRoom. Este callback será conectado por la issue de integración.
    onSolicitarConstruccion?.(solicitud);
    setEstadoConstruccion(
      `Solicitud de ${tipoConstruccion} preparada para (${objetivo.h}, ${objetivo.d}, ${objetivo.p}).`,
    );
  }

  return (
    <div className="marcoPartida">
        <div className="salir"> 
            <button className="btnSalida">Salir</button>
        </div>
        <div className="tabCostos">
            <TablaCostes />
        </div>
        <div className="chat">
          area de chat
        </div>
        <div className="construir">
          <Construir
            recursos={recursosPrueba}
            esMiTurno={true}
            seleccion={tipoConstruccion}
            onSeleccionar={seleccionarConstruccion}
          />
          {estadoConstruccion && <p className="estadoConstruccion" role="status">{estadoConstruccion}</p>}
        </div>
        <div className="informacion"> 
            <div className="infoJugadores">
                {jugadoresPrueba.map((j) => (
                  <InfoJugador key={j.nombre} jugador={j} />
                ))}
            </div>
            <div className="infoPartida">
                area de informacion de partida
            </div>
        </div>
        <div className="tablero">
          <Tablero
            datos={tableroPrueba}
            tipoConstruccion={tipoConstruccion}
            objetivoSeleccionado={objetivoConstruccion}
            onSeleccionarObjetivo={seleccionarObjetivo}
          />
        </div>
        <div className="cartas"> 
            <div className="carRecursos">
              area de cartas de recursos
            </div>
            <div className="carDesarrollo">
              area de cartas de desarollo
            </div>
            <div className="carEspeciales">
              area de cartas especiales 
            </div>
        </div>
        <div className="acciones"> 
          <div className="negociar">
            area de negociar   
          </div>
          <div className="tirDado">
            area de tirar dado
          </div>
          <div className="finTurno">
            area de finaliszar turno
          </div>
        </div>
    </div>
  );
}

export default Partida;
