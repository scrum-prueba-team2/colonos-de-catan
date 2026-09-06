import { useNavigation } from '../navegacion';
import InfoJugador, { type Jugador } from '../componentes/InfoJugador';
import InfoPartida, { type DatosPartida } from '../componentes/infoPartida';
import InfoCarRecursos, { type Recursos } from '../componentes/infoCarRecursos';
// import InfoCarDesarrollo, { type Desarrollo, type TipoDesarrollo } from '../componentes/infoCarDesarrollo';
import InfoCarEspeciales, { type Especiales } from '../componentes/infoCarEspeciales';
import Construir, { type Construibles, type TipoConstruccion } from '../componentes/construir';
import Chat, { type Mensaje } from '../componentes/chat';
import Negociar, { type Oferta } from '../componentes/negociar';
import Tablero from '../componentes/tablero';
import TablaCostes from '../componentes/tablaCostes';
import { tableroPrueba } from '../datos/tableroPrueba';
import FinTurno from '../componentes/finTurno';
import TirarDado from '../componentes/tirarDado';
import { useState } from 'react';
import './Partida.css';

// Los cuatro jugadores. El color lo asignara el servidor al entrar a la sala.
const jugadores: Jugador[] = [
  { nombre: 'José',   color: '#D34F3E', puntos: 4, cartas: 7 },
  { nombre: 'Ana',    color: '#3E7FD3', puntos: 3, cartas: 5 },
  { nombre: 'Carlos', color: '#4CA36B', puntos: 2, cartas: 9 },
  { nombre: 'Lucía',  color: '#E0A030', puntos: 5, cartas: 3 },
];

// yoSoy es el sessionId que da Colyseus del cliente  
// turnoDe es el nombre del jugador que tiene el turno. Se lo pasa el servidor a todos los clientes.
const yoSoy = 'Ana';  

// Mensajes de ejemplo para ver como se ve el chat.
// El id del autor deve coisidir con sessionId para que se vea destacado
const mensajesIniciales: Mensaje[] = [
  { id: 'm1', autor: 'José',   texto: '¿Alguien tiene trigo?',      hora: Date.now() - 5 * 60000 },
  { id: 'm2', autor: 'Ana',    texto: 'Yo, ¿qué me das a cambio?',  hora: Date.now() - 4 * 60000 },
  { id: 'm3', autor: 'Carlos', texto: 'Ojo con el ladrón en el 8.', hora: Date.now() - 2 * 60000 },
];

// contador de turnos y rondas(cuando el primer jugador tiene turno de nuevo) viven en el servidor
// inicio(tiempo relativo puede vivir en cliente), 
// finTurno(tiempo desendente que se escoje en backend) y activa el el cambio de turno de forma automatica
const partida: DatosPartida = {
  turno: 12,
  ronda: 3,
  inicio: Date.now() - 5 * 60 * 1000,   
  finTurno: Date.now() + 45 * 1000,     
};

const misRecursos: Recursos = {
  madera: 3, ladrillo: 1, lana: 0, trigo: 2, piedra: 4,
};

// const misDesarrollo: Desarrollo = {
//   caballero: 2, monopolio: 1, carreteras: 0, invento: 0, puntoVictoria: 1,
// };

// function usarCarta(tipo: TipoDesarrollo) {
//   console.log('usar carta:', tipo);  
// }

const misEspeciales: Especiales = {
  rutaComercial: true,
  ejercito: false,
};

// Que puede construir. En reglas verificar si cumple con recursos para construir.
const construibles: Construibles = {
  camino: true,
  poblado: true,
  ciudad: false,       
  desarrollo: false,
};

function construir(tipo: TipoConstruccion) {
  console.log('construir:', tipo);   
}

// Pantalla principar de la partida. Contiene todos los componentes de la partida.
function Partida() {
  function ofertar(oferta: Oferta) {
    console.log('oferta:', oferta);   
  }
  useNavigation();
  // null significa que en este turno todavia no se ha tirado. Ese mismo dato
  // es el que habilita el -ton de negociar.
  const [ultimoDado, setUltimoDado] = useState<number | null>(null);
  const [turnoDe, setTurnoDe] = useState('Ana');
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajesIniciales);

  // agregar un mensaje a la lista
  function enviarMensaje(texto: string) {
    setMensajes((previos) => [
      // crean un arreglo nuevo. vuelca dentro todos los mensajes que ya había, y después va el nuevo.
      ...previos,
      { id: crypto.randomUUID(), autor: yoSoy, texto, hora: Date.now() },
    ]);
  }

  // El modulo hace que despues del ultimo jugador vuelva al primero.
  // Limpiar el dado es importante: si no, a partir del turno 2 se podria
  // negociar sin haber tirado.
  function siguienteTurno() {
    const i = jugadores.findIndex((j) => j.nombre === turnoDe);
    setTurnoDe(jugadores[(i + 1) % jugadores.length].nombre);
    setUltimoDado(null);        
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
          <Chat mensajes={mensajes} yoSoy={yoSoy} onEnviar={enviarMensaje} />
        </div>
        <div className="construir">
        <Construir
            construibles={construibles}
            esMiTurno={turnoDe === yoSoy}
            onConstruir={construir}
        />
        </div>
        <div className="informacion"> 
            <div className="infoJugadores">
                {jugadores.map((j) => (
                    <InfoJugador key={j.nombre} jugador={j} enTurno={j.nombre === turnoDe} />
                ))}
            </div>
            <div className="infoPartida">
                <InfoPartida partida={partida} />
            </div>
        </div>
        <div className="tablero">
            <Tablero datos={tableroPrueba} />
        </div>
        <div className="cartas"> 
            <div className="carRecursos">
                <InfoCarRecursos recursos={misRecursos} />
            </div>
            <div className="carDesarrollo">
                Cartas de desarrollo solo disponible en vercion Pro Plus Ultra 
                {/* area descartada para esta primer vercion del juego */} 
                {/* <InfoCarDesarrollo desarrollo={misDesarrollo} onUsar={usarCarta} /> */}
            </div>
            <div className="carEspeciales">
                <InfoCarEspeciales especiales={misEspeciales} />
            </div>
        </div>
        <div className="acciones"> 
            <div className="negociar">
            <Negociar
              jugadores={jugadores}
              yoSoy={yoSoy}
              misRecursos={misRecursos}
              esMiTurno={turnoDe === yoSoy}
              yaTiroDados={ultimoDado !== null}
              mensajes={mensajes}
              onEnviarMensaje={enviarMensaje}
              onOfertar={ofertar}
            />
          </div>
            <div className="tirDado">
            <TirarDado
                esMiTurno={turnoDe === yoSoy}
                ultimoDado={ultimoDado}
                onTirar={() => setUltimoDado(8)}
            />
            </div>
            <div className="finTurno">
            <FinTurno
                turnoDe={turnoDe}
                esMiTurno={turnoDe === yoSoy}
                onFinalizar={siguienteTurno}
            />
            </div>
        </div>
    </div>
  );
}

export default Partida;