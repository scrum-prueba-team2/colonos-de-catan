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
import TirarDados, { type ResultadoDados } from '../componentes/tirarDados';
import Construir, {
  type ObjetivoConstruccion,
  type SolicitudConstruccion,
  type TipoConstruccion,
} from '../componentes/construir';
import { FASE_JUEGO, FASE_PARTIDA, FASE_PRECONSTRUCCION } from '../common/fases';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import "./Partida.css"
import InfoTurno from '../componentes/infoTurno';

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
  const [resultadoDados, setResultadoDados] = useState<ResultadoDados | null>(null);
  const [lanzandoDados, setLanzandoDados] = useState(false);
  const [pasandoTurno, setPasandoTurno] = useState(false);

  // Todo lo que manda el servidor. null = todavia no llega, o no hay sala.
  const [estadoReal, setEstadoReal] = useState<EstadoCatan | null>(null);

  useEffect(() => {
    if (!sala) return;
    const salaActual = sala;

    function actualizarEstado() {
      const estado = leerEstado(salaActual);
      setEstadoReal(estado);
      // El servidor confirma el cambio mediante el estado, no un mensaje nuevo.
      if (!estado
        || estado.partida.turnoActual !== salaActual.sessionId
        || estado.partida.fase !== FASE_PARTIDA.JUEGO
        || estado.partida.faseJuego !== FASE_JUEGO.ACCIONES) {
        setPasandoTurno(false);
      }
    }

    actualizarEstado();

    // Se vuelve a leer con cada cambio que mande el servidor.
    salaActual.onStateChange(actualizarEstado);
    return () => { salaActual.onStateChange.remove(actualizarEstado); };
  }, [sala]);

  useEffect(() => {
    if (!sala) return;

    // CatanRoom transmite este evento a todos los jugadores, incluido quien
    // lanzó. Por eso el mismo resultado se ve en todas las pantallas.
    const dejarDeEscucharDados = sala.onMessage('dados', (resultado: ResultadoDados) => {
      setResultadoDados(resultado);
      setLanzandoDados(false);
    });

    // CatanRoom responde "error" al cliente si una validación falla. El
    // navegador ya muestra ese mensaje desde Navegacion; aquí solo liberamos
    // los botones para que la interfaz no quede bloqueada tras el rechazo.
    const dejarDeEscucharErrores = sala.onMessage('error', () => {
      setLanzandoDados(false);
      setPasandoTurno(false);
    });

    return () => {
      dejarDeEscucharDados();
      dejarDeEscucharErrores();
    };
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
  const esMiTurno = estadoReal !== null && turnoActual === miSessionId;
  const puedeLanzarDados = Boolean(
    sala
      && esMiTurno
      && estadoReal?.partida.fase === FASE_PARTIDA.JUEGO
      && estadoReal.partida.faseJuego === FASE_JUEGO.DADOS,
  );
  const puedePasarTurno = Boolean(
    sala
      && esMiTurno
      && estadoReal?.partida.fase === FASE_PARTIDA.JUEGO
      && estadoReal.partida.faseJuego === FASE_JUEGO.ACCIONES,
  );

  // Preconstruccion: el backend solo acepta asentamiento y no cobra recursos.
  const preconstruyendoAsentamiento = Boolean(
    sala
      && esMiTurno
      && estadoReal?.partida.fase === FASE_PARTIDA.PRECONSTRUCCION
      && estadoReal.partida.fasePreconstruccion === FASE_PRECONSTRUCCION.ASENTAMIENTO,
  );
  const tipoPermitido: TipoConstruccion | null = preconstruyendoAsentamiento ? 'poblado' : null;

  function pasarTurno() {
    if (!sala || !puedePasarTurno || pasandoTurno) return;
    setPasandoTurno(true);
    // El backend elige al siguiente jugador. No adelantamos el turno localmente.
    sala.send('msgPasarTurno');
  }

  function lanzarDados() {
    // El backend vuelve a validar turno y fase; esta condición solo evita un
    // clic inválido en la interfaz y bloquea repeticiones mientras responde.
    if (!sala || !puedeLanzarDados || lanzandoDados) return;
    setLanzandoDados(true);
    sala.send('msgLanzarDados');
  }

  function seleccionarConstruccion(tipo: TipoConstruccion | null) {
    setTipoConstruccion(tipo);
    // Un objetivo elegido para una pieza no se puede reutilizar para otra.
    setObjetivoConstruccion(null);
    setEstadoConstruccion('');
  }

  function seleccionarObjetivo(objetivo: ObjetivoConstruccion) {
    if (!tipoConstruccion) return;

    setObjetivoConstruccion(objetivo);

    // Asentamiento: el mensaje es el mismo en preconstruccion y en juego, y el
    // JSON que espera CatanRoom es { h, d, p }. El backend valida todo y
    // confirma por el estado, no con un mensaje de exito.
    if (sala && tipoConstruccion === 'poblado') {
      sala.send('msgColocarAsentamiento', objetivo);
      setTipoConstruccion(null);
      setEstadoConstruccion('Asentamiento enviado al servidor.');
      return;
    }

    const solicitud: SolicitudConstruccion = { tipo: tipoConstruccion, objetivo };

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
          <button className="btn btn-danger w-100 h-100" onClick={onSalir}>Salir</button>
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
            esMiTurno={esMiTurno}
            tipoPermitido={tipoPermitido}
            seleccion={tipoConstruccion}
            onSeleccionar={seleccionarConstruccion}
          />
          {estadoConstruccion && (
            <Typography variant="caption" color="primary" component="p" role="status">
              {estadoConstruccion}
            </Typography>
          )}
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
          {/*INFORMACION DE LA PARTIDA*/}
            <InfoTurno sessionIdTurno={turnoActual} jugadores={jugadores} />
        </div>
        <div className="tablero">
          <Tablero
            datos={datosTablero}
            ordenJugadores={ordenJugadores}
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
          <TirarDados
            resultado={resultadoDados}
            puedeLanzar={puedeLanzarDados}
            lanzando={lanzandoDados}
            onLanzar={lanzarDados}
          />
        </div>
        <div className="finTurno">
          <Button
            type="button"
            variant="contained"
            fullWidth
            disabled={!puedePasarTurno || pasandoTurno}
            onClick={pasarTurno}
          >
            {pasandoTurno ? 'Pasando turno…' : 'Pasar turno'}
          </Button>
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
