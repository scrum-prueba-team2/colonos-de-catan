import { useEffect, useState } from 'react';
import type { Room } from '@colyseus/sdk';
import {
  jugadoresPrueba, ordenJugadoresPrueba, turnoActualPrueba, miSessionIdPrueba,
} from '../datos/jugadoresPrueba';
import InfoJugadores from '../componentes/infoJugadores';

import { bancaPrueba } from '../datos/bancaPruebas';
import Existencias from '../componentes/existencias';
import { tableroPrueba } from '../datos/tableroPrueba'
import TablaCostes from '../componentes/tablaCostes';
import Tablero from '../componentes/tablero';
import type { Recursos } from '../common/jugador';
import type { EstadoCatan } from '../common/estado';
import CarRecursos from '../componentes/carRecursos';
import CarDesarrollo from '../componentes/carDesarrollo';
import Construir, {
  type ObjetivoConstruccion,
  type SolicitudConstruccion,
  type TipoConstruccion,
} from '../componentes/construir';
import './Partida.css'

const recursosPrueba: Recursos = {
  madera: 2,
  ladrillo: 2,
  lana: 1,
  trigo: 2,
  mineral: 3,
};

/* room.state es un Schema de Colyseus: toJSON() lo vuelve objeto plano. Las
   claves son las mismas que en common/ (h, d, p, terreno, constuccion, nombre,
   recursos, cartas_usables...), asi que no hay nada que traducir.
   Devuelve null mientras el estado no haya llegado completo. */
function leerEstado(sala: Room): EstadoCatan | null {
  const raiz = sala.state as { toJSON?: () => EstadoCatan } | undefined;
  if (!raiz?.toJSON) return null;
  const estado = raiz.toJSON();
  if (!estado.tablero || !estado.jugadores || !estado.partida || !estado.banca) return null;
  return estado;
}

interface Props {
  // Si no hay sala de Colyseus, usara el tableroPrueba
  sala?: Room | null;
  // La capa de conexión inyectará aquí una función equivalente a:
  // room.send('construir', solicitud).
  // Así esta pantalla no crea una segunda conexión al backend.
  onSolicitarConstruccion?: (solicitud: SolicitudConstruccion) => void;
  // Navegacion borra el token de reconexión y abandona la sala.
  onSalir?: () => void;
}

// Pantalla principal de la partida. Contiene todos los componentes de la partida.
function Partida({ sala, onSolicitarConstruccion, onSalir }: Props) {
  const [tipoConstruccion, setTipoConstruccion] = useState<TipoConstruccion | null>(null);
  const [objetivoConstruccion, setObjetivoConstruccion] = useState<ObjetivoConstruccion | null>(null);
  const [estadoConstruccion, setEstadoConstruccion] = useState('');

  // Todo lo que manda el servidor. null = todavia no llega, o no hay sala.
  const [estadoReal, setEstadoReal] = useState<EstadoCatan | null>(null);

  useEffect(() => {
    if (!sala) return;
    const salaActual = sala;

    function actualizarEstado() {
      setEstadoReal(leerEstado(salaActual));
    }

    actualizarEstado();

    // Se vuelve a leer con cada cambio que mande el servidor.
    salaActual.onStateChange(actualizarEstado);
    return () => { salaActual.onStateChange.remove(actualizarEstado); };
  }, [sala]);

  /* Sin sala, o antes del primer estado, se usan los datos de prueba: tienen la
     misma forma, asi que los componentes no notan la diferencia. Los seis
     salen de la misma fuente para no mezclar un sessionId real con jugadores
     de prueba. */
  const datosTablero = estadoReal?.tablero ?? tableroPrueba;
  const jugadores = estadoReal?.jugadores ?? jugadoresPrueba;
  const ordenJugadores = estadoReal?.partida.ordenJugadores ?? ordenJugadoresPrueba;
  const turnoActual = estadoReal?.partida.turnoActual ?? turnoActualPrueba;
  const banca = estadoReal?.banca ?? bancaPrueba;
  const miSessionId = estadoReal ? (sala?.sessionId ?? '') : miSessionIdPrueba;

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
            <button className="btnSalida" onClick={onSalir}>Salir</button>
        </div>
        <div className="tabCostos">
            <TablaCostes />
        </div>
        <div className="chat">
          area de chat
        </div>
        <div className="construir">
          <Construir
            recursos={jugadores[miSessionId]?.recursos ?? recursosPrueba}
            esMiTurno={true}
            seleccion={tipoConstruccion}
            onSeleccionar={seleccionarConstruccion}
          />
          {estadoConstruccion && <p className="estadoConstruccion" role="status">{estadoConstruccion}</p>}
        </div>
        <div className="infoJugadores">
          <InfoJugadores
            jugadores={jugadores}
            ordenJugadores={ordenJugadores}
            turnoActual={turnoActual}
            miSessionId={miSessionId}
          />
        </div>
        <div className="infoPartida">
            area de informacion de partida
        </div>
        <div className="tablero">
          <Tablero
            datos={datosTablero}
            tipoConstruccion={tipoConstruccion}
            objetivoSeleccionado={objetivoConstruccion}
            onSeleccionarObjetivo={seleccionarObjetivo}
          />
        </div>
        <div className="carRecursos">
          <CarRecursos miJugador={jugadores[miSessionId]} />
        </div>
        <div className="carDesarrollo">
          <CarDesarrollo miJugador={jugadores[miSessionId]} />
        </div>
        <div className="carEspeciales">
          area de cartas especiales 
        </div>
        <div className="negociar">
            area de negociar   
        </div>
        <div className="tirDado">
          area de tirar dado
        </div>
        <div className="finTurno">
          area de finaliszar turno
        </div>
        <div className="existencias">
          <Existencias
            banca={banca}
            miJugador={jugadores[miSessionId]}
          />
        </div>
    </div>
  );
}

export default Partida;