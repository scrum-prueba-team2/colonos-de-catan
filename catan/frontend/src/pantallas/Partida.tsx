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
import type { Recurso, Recursos } from '../common/jugador';
import { CARTA } from '../common/jugador';
import type { EstadoCatan } from '../common/estado';
import type { Coordenada } from '../common/tablero';
import CarRecursos from '../componentes/carRecursos';
import CarDesarrollo from '../componentes/carDesarrollo';
import DescartarRecursos from '../componentes/descartarRecursos';
import TirarDados, { type ResultadoDados } from '../componentes/tirarDados';
import Construir, {
  type ObjetivoConstruccion,
  type SolicitudConstruccion,
  type TipoConstruccion,
} from '../componentes/construir';
import { FASE_JUEGO, FASE_PARTIDA, FASE_PRECONSTRUCCION } from '../common/fases';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import "./Partida.css"
import InfoTurno from '../componentes/infoTurno';
import ElegirRobo from '../componentes/ElegirRobo';
import UsarCarta, { type CartaUsable } from '../componentes/UsarCarta';

const recursosPrueba: Recursos = {
  madera: 2,
  ladrillo: 2,
  lana: 1,
  trigo: 2,
  mineral: 3,
};

//Mensajes de construccion
const MENSAJE_CONSTRUIR: Partial<Record<TipoConstruccion, string>> = {
  poblado: 'msgColocarAsentamiento',
  camino: 'msgColocarCamino',
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
  const [descarteEnEspera, setDescarteEnEspera] = useState<number | null>(null);
  const [moviendoLadron, setMoviendoLadron] = useState(false);
  const [compraEnEspera, setCompraEnEspera] = useState<number | null>(null);
  const [robando, setRobando] = useState(false);
  const [menuCartasAbierto, setMenuCartasAbierto] = useState(false);
  /* Carta de caballero: null = no se esta usando; 'eligiendo' = el jugador
     elige el hexagono del ladron; un numero = mensaje enviado, guarda cuantos
     caballeros usables tenia para saber cuando el servidor lo confirma. */
  const [caballero, setCaballero] = useState<null | 'eligiendo' | number>(null);
  // Todo lo que manda el servidor. null = todavia no llega, o no hay sala.
  const [estadoReal, setEstadoReal] = useState<EstadoCatan | null>(null);

  useEffect(() => {
    if (!sala) return;
    const salaActual = sala;

    function actualizarEstado() {
      const estado = leerEstado(salaActual);
      setEstadoReal(estado);
      // Cada descarte aceptado reduce la cuenta publicada por el servidor.
      setDescarteEnEspera((cantidadAnterior) => {
        if (cantidadAnterior === null) return null;
        const partida = estado?.partida;
        const restantes = partida?.jugadoresParaDescartar[salaActual.sessionId] ?? 0;
        return !partida || partida.faseJuego !== FASE_JUEGO.DESCARTE || restantes < cantidadAnterior
          ? null
          : cantidadAnterior;
      });
      // La compra se confirma cuando el servidor reduce el mazo de la banca.
      setCompraEnEspera((cartasAnteriores) => {
        if (cartasAnteriores === null) return null;
        return !estado
          || estado.partida.turnoActual !== salaActual.sessionId
          || estado.partida.faseJuego !== FASE_JUEGO.ACCIONES
          || estado.banca.cartas.length < cartasAnteriores
          ? null
          : cartasAnteriores;
      });
      // El servidor confirma el cambio mediante el estado, no un mensaje nuevo.
      if (!estado
        || estado.partida.turnoActual !== salaActual.sessionId
        || estado.partida.fase !== FASE_PARTIDA.JUEGO
        || estado.partida.faseJuego !== FASE_JUEGO.ACCIONES) {
        setPasandoTurno(false);
      }
      // Al mover al ladron el backend cambia la fase (Acciones o Robo).
      if (!estado || estado.partida.faseJuego !== FASE_JUEGO.LADRON) {
        setMoviendoLadron(false);
      }

      if(!estado || estado.partida.faseJuego !== FASE_JUEGO.ROBO){
        setRobando(false);
      }

      // El caballero se confirma cuando el servidor le resta la carta al
      // jugador. Si cambia el turno o la fase, se cancela.
      setCaballero((anterior) => {
        if (anterior === null) return null;
        const usables = estado?.jugadores[salaActual.sessionId]?.cartas_usables[CARTA.CABALLERO] ?? 0;
        if (!estado || estado.partida.turnoActual !== salaActual.sessionId) return null;
        if (typeof anterior === 'number') return usables < anterior ? null : anterior;
        return estado.partida.faseJuego === FASE_JUEGO.ACCIONES ? anterior : null;
      });

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
      setDescarteEnEspera(null);
      setMoviendoLadron(false);
      setCompraEnEspera(null);
      setRobando(false);
      // Si el servidor rechaza el caballero, se puede elegir otro hexagono.
      setCaballero((anterior) => (typeof anterior === 'number' ? 'eligiendo' : anterior));
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
  const partidaActual = estadoReal?.partida;
  const miJugadorReal = estadoReal?.jugadores[miSessionId];
  const descartesPendientes = partidaActual?.jugadoresParaDescartar[miSessionId] ?? 0;
  // El backend procesa primero al jugador pendiente que aparece en ordenJugadores.
  const siguienteDescartador = partidaActual?.ordenJugadores.find(
    (id) => (partidaActual.jugadoresParaDescartar[id] ?? 0) > 0,
  );
  const esSuTurnoDeDescartar = Boolean(
    sala
      && partidaActual?.fase === FASE_PARTIDA.JUEGO
      && partidaActual.faseJuego === FASE_JUEGO.DESCARTE
      && descartesPendientes > 0
      && siguienteDescartador === miSessionId,
  );
  const puedeLanzarDados = Boolean(
    sala
      && esMiTurno
      && estadoReal?.partida.fase === FASE_PARTIDA.JUEGO
      && estadoReal.partida.faseJuego === FASE_JUEGO.DADOS,
  );
  // Se llega aqui tras sacar 7 o despues de que todos terminen de descartar.
  const puedeMoverLadron = Boolean(
    sala
      && esMiTurno
      && estadoReal?.partida.fase === FASE_PARTIDA.JUEGO
      && estadoReal.partida.faseJuego === FASE_JUEGO.LADRON,
  );

  const puedeRobar = Boolean(
    sala
    && esMiTurno
    && estadoReal?.partida.fase === FASE_PARTIDA.JUEGO
    && estadoReal.partida.faseJuego === FASE_JUEGO.ROBO
  );

  const puedePasarTurno = Boolean(
    sala
      && esMiTurno
      && estadoReal?.partida.fase === FASE_PARTIDA.JUEGO
      && estadoReal.partida.faseJuego === FASE_JUEGO.ACCIONES,
  );
  const puedeComprarCarta = Boolean(
    sala
      && esMiTurno
      && partidaActual?.fase === FASE_PARTIDA.JUEGO
      && partidaActual.faseJuego === FASE_JUEGO.ACCIONES
      && (estadoReal?.banca.cartas.length ?? 0) > 0
      && (miJugadorReal?.recursos.trigo ?? 0) >= 1
      && (miJugadorReal?.recursos.lana ?? 0) >= 1
      && (miJugadorReal?.recursos.mineral ?? 0) >= 1,
  );

  // Las 4 cartas que se pueden jugar (el punto de victoria no se juega).
  const cartasUsables = miJugadorReal?.cartas_usables;
  const tieneCartaUsable = Boolean(cartasUsables && (
    cartasUsables[CARTA.CABALLERO] + cartasUsables[CARTA.CARRETERAS]
      + cartasUsables[CARTA.ABUNDANCIA] + cartasUsables[CARTA.MONOPOLIO] > 0
  ));
  // El backend permite una carta por turno y solo en la fase de acciones.
  const puedeUsarCarta = Boolean(
    puedePasarTurno
      && partidaActual?.cartaJugable
      && tieneCartaUsable
      && caballero === null,
  );

  /* Preconstruccion: el backend solo acepta la pieza de la subfase en curso y
     no cobra recursos.*/
  const enPreconstruccion = Boolean(
    sala && esMiTurno && estadoReal?.partida.fase === FASE_PARTIDA.PRECONSTRUCCION,
  );
  const tipoPermitido: TipoConstruccion | null = !enPreconstruccion
    ? null
    : estadoReal?.partida.fasePreconstruccion === FASE_PRECONSTRUCCION.CAMINO
      ? 'camino'
      : 'poblado';

  const puedeConstruir = enPreconstruccion || puedePasarTurno;

  function pasarTurno() {
    if (!sala || !puedePasarTurno || pasandoTurno) return;
    setPasandoTurno(true);
    // El backend elige al siguiente jugador. No adelantamos el turno localmente.
    sala.send('msgPasarTurno');
  }

  function comprarCarta() {
    if (!sala || !puedeComprarCarta || compraEnEspera !== null) return;
    setCompraEnEspera(estadoReal?.banca.cartas.length ?? 0);
    sala.send('msgComprarCarta');
  }

  function descartarRecurso(recurso: Recurso) {
    const disponibles = estadoReal?.jugadores[miSessionId]?.recursos[recurso] ?? 0;
    if (!sala || !esSuTurnoDeDescartar || descarteEnEspera !== null || disponibles < 1) return;
    setDescarteEnEspera(descartesPendientes);
    sala.send('msgDescartarRecursos', { recurso });
  }

  function lanzarDados() {
    // El backend vuelve a validar turno y fase; esta condición solo evita un
    // clic inválido en la interfaz y bloquea repeticiones mientras responde.
    if (!sala || !puedeLanzarDados || lanzandoDados) return;
    setLanzandoDados(true);
    sala.send('msgLanzarDados');
  }

  function moverLadron(hexagono: Coordenada) {
    // El backend valida turno, fase y que no sea el mismo hexagono, y luego
    // cambia la fase a Acciones o a Robo. Mientras responde, se ocultan los
    // circulos para no mandar dos veces el mensaje.
    if (!sala || !puedeMoverLadron || moviendoLadron) return;
    setMoviendoLadron(true);
    sala.send('msgMoverLadron', { h: hexagono.h, d: hexagono.d });
  }

  function robarJugador(jugadorRobado: string) {
    // El backend valida que este en jugadoresParaRobar, roba y pasa a Acciones.
    if (!sala || !puedeRobar || robando) return;
    setRobando(true);
    sala.send('msgRobarJugador', { jugadorRobado });
  }

  function elegirCarta(carta: CartaUsable) {
    setMenuCartasAbierto(false);
    if (carta === CARTA.CABALLERO) {
      // Se reutilizan los circulos de mover al ladron para elegir el hexagono.
      setTipoConstruccion(null);
      setCaballero('eligiendo');
    }
  }

  function jugarCaballero(hexagono: Coordenada) {
    // El backend valida turno, fase, la carta y el hexagono. Si hay 2 o mas
    // jugadores para robar pasa a la fase de Robo y se abre ElegirRobo.
    if (!sala || caballero !== 'eligiendo') return;
    setCaballero(cartasUsables?.[CARTA.CABALLERO] ?? 0);
    sala.send('msgCartaCaballero', { h: hexagono.h, d: hexagono.d });
  }

  function seleccionarHexagonoLadron(hexagono: Coordenada) {
    if (caballero === 'eligiendo') jugarCaballero(hexagono);
    else moverLadron(hexagono);
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

    // El backend valida turno, fase, recursos y posicion, y confirma por el
    // estado: no manda ningun mensaje de exito.
    const mensaje = MENSAJE_CONSTRUIR[tipoConstruccion];
    if (sala && mensaje) {
      sala.send(mensaje, objetivo);
      setTipoConstruccion(null);
      setEstadoConstruccion(`Enviado al servidor: ${tipoConstruccion}.`);
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
            puedeConstruir={puedeConstruir}
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
        <div className="tablero" style={{ position: 'relative' }}>
          {caballero !== null && (
            <Alert
              severity="info"
              sx={{ position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}
              action={caballero === 'eligiendo' && (
                <Button color="inherit" size="small" onClick={() => setCaballero(null)}>
                  Cancelar
                </Button>
              )}
            >
              {caballero === 'eligiendo'
                ? 'Caballero: elige a qué hexágono mover al ladrón.'
                : 'Usando caballero…'}
            </Alert>
          )}
          <Tablero
            datos={datosTablero}
            ordenJugadores={ordenJugadores}
            tipoConstruccion={tipoConstruccion}
            objetivoSeleccionado={objetivoConstruccion}
            onSeleccionarObjetivo={seleccionarObjetivo}
            moviendoLadron={(puedeMoverLadron && !moviendoLadron) || caballero === 'eligiendo'}
            onSeleccionarHexagonoLadron={seleccionarHexagonoLadron}
          />
        </div>
        <div className="carRecursos">
          <CarRecursos miJugador={jugadores[miSessionId]} />
        </div>
        <div className="carDesarrollo">
          <CarDesarrollo
            miJugador={jugadores[miSessionId]}
            puedeComprar={puedeComprarCarta}
            comprando={compraEnEspera !== null}
            onComprar={comprarCarta}
            puedeUsarCarta={puedeUsarCarta}
            onUsarCarta={() => setMenuCartasAbierto(true)}
          />
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
        <DescartarRecursos
          pendientes={descartesPendientes}
          recursos={estadoReal?.jugadores[miSessionId]?.recursos}
          esSuTurnoDeDescartar={esSuTurnoDeDescartar}
          enviando={descarteEnEspera !== null}
          onDescartar={descartarRecurso}
        />
          <ElegirRobo
          abierto={puedeRobar}
          jugadoresParaRobar={partidaActual?.jugadoresParaRobar ?? []}
          jugadores={jugadores}
          enviando={robando}
          onRobar={robarJugador}
        />
        <UsarCarta
          abierto={menuCartasAbierto && puedeUsarCarta}
          cartasUsables={cartasUsables}
          onElegir={elegirCarta}
          onCerrar={() => setMenuCartasAbierto(false)}
        />

    </div>
  );
}

export default Partida;
