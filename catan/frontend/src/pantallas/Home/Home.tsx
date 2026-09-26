import "./Home.css";
import Decoracion from "../Decoracion/Decoracion";

interface HomeProps {
  onAbrirMenu: () => void;
}

interface MiembroEquipo {
  nombre: string;
  rol: string;
}

const LIDERAZGO: MiembroEquipo[] = [
  { nombre: "Oscar Menéndez", rol: "Scrum master" },
  { nombre: "Ángel Jiménez", rol: "Product owner" },
];

const DESARROLLADORES: string[] = [
  "Hengel Contreras",
  "Obed García",
  "Elias Molina",
  "Yahir Zabaleta",
  "Misael Sandoval",
  "José Villela",
  "Jaime Cardona",
];

// Tonos oscuros de los terrenos del tablero: bosque, ladrillo, trigo, mar y
// montaña. Oscuros para que las iniciales en blanco se lean bien.
const COLORES_AVATAR = ["#2f6b3f", "#b64e36", "#b07a1f", "#176977", "#5d6773"];

function colorParaNombre(nombre: string): string {
  let hash = 0;
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORES_AVATAR[Math.abs(hash) % COLORES_AVATAR.length];
}

function iniciales(nombre: string): string {
  return nombre
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0].toUpperCase())
    .join("");
}

// Terreno y número de cada ficha de la isla. Los colores son los mismos
// que usa componentes/tablero.css; 6 y 8 van en rojo como en el tablero.
const FICHAS_ISLA = [
  { cx: 120, cy: 70, color: "#6ab04c", numero: 8 },
  { cx: 200, cy: 70, color: "#c96b4a", numero: 5 },
  { cx: 280, cy: 70, color: "#f6e58d", numero: 10 },
  { cx: 80, cy: 140, color: "#a5d6a7", numero: 3 },
  { cx: 160, cy: 140, color: "#9aa0a6", numero: 6 },
  { cx: 240, cy: 140, color: "#e8c97a", numero: null },
  { cx: 320, cy: 140, color: "#6ab04c", numero: 11 },
];

function HexIsla() {
  // Ilustración original inspirada en las fichas hexagonales de recursos
  // del juego (no es arte oficial de Catan).
  const puntosHex = (cx: number, cy: number) => {
    const r = 46;
    return Array.from({ length: 6 }, (_, i) => {
      const angulo = (Math.PI / 180) * (60 * i - 30);
      return `${cx + r * Math.cos(angulo)},${cy + r * Math.sin(angulo)}`;
    }).join(" ");
  };

  return (
    <svg viewBox="0 0 400 220" className="home__hex-arte" aria-hidden="true">
      {FICHAS_ISLA.map((ficha, i) => (
        <g key={`${ficha.cx}-${ficha.cy}`} className="home__hex" style={{ animationDelay: `${i * 0.08}s` }}>
          <polygon points={puntosHex(ficha.cx, ficha.cy)} fill={ficha.color} stroke="#f3ede0" strokeWidth={4} />
          {ficha.numero !== null ? (
            <>
              <circle cx={ficha.cx} cy={ficha.cy} r={15} fill="#f6efdd" stroke="#00000022" strokeWidth={1.5} />
              <text
                x={ficha.cx}
                y={ficha.cy}
                className={"home__hex-numero" + (ficha.numero === 6 || ficha.numero === 8 ? " home__hex-numero--rojo" : "")}
              >
                {ficha.numero}
              </text>
            </>
          ) : (
            // En el desierto empieza el ladrón.
            <g className="home__ladron">
              <ellipse cx={ficha.cx} cy={ficha.cy + 14} rx={11} ry={5} fill="#333" />
              <ellipse cx={ficha.cx} cy={ficha.cy + 2} rx={8} ry={12} fill="#333" />
              <circle cx={ficha.cx} cy={ficha.cy - 13} r={7} fill="#333" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}

function Home({ onAbrirMenu }: HomeProps) {
  return (
    <div className="home tema-fondo">
      <Decoracion />

      <nav className="home__nav">
        <span className="home__marca">
          <span className="home__marca-hex" aria-hidden="true" />
          Catan Online
        </span>
        <button className="home__nav-btn tema-btn tema-btn--chico" onClick={onAbrirMenu} aria-label="Abrir menú de partidas">
          <span aria-hidden="true">👥</span> Jugar
        </button>
      </nav>

      <header className="home__hero">
        <span className="tema-insignia tema-insignia--marca">🛠️ En desarrollo · versión de prueba</span>
        <HexIsla />
        <h1>
          Construye, <span className="home__resalte home__resalte--ladrillo">comercia</span>,{" "}
          <span className="home__resalte home__resalte--bosque">coloniza</span>
        </h1>
        <p>
          La versión en línea de Catan que estamos construyendo para jugar por
          turnos con tus amigos, desde cualquier navegador o celular.
        </p>
        <button className="home__cta tema-btn tema-btn--ladrillo" onClick={onAbrirMenu}>
          🎲 Jugar ahora
        </button>
      </header>

      <section className="home__equipo tema-pergamino">
        <h2>El equipo</h2>

        <div className="home__roles">
          {LIDERAZGO.map((persona) => (
            <div className="home__rol" key={persona.nombre}>
              <span className="tema-hex home__avatar" style={{ background: colorParaNombre(persona.nombre) }}>
                {iniciales(persona.nombre)}
              </span>
              <div className="home__rol-texto">
                <span className="home__rol-nombre">{persona.nombre}</span>
                <span className="home__rol-cargo">{persona.rol}</span>
              </div>
            </div>
          ))}
        </div>

        <h3>Desarrolladores</h3>
        <ul className="home__desarrolladores">
          {DESARROLLADORES.map((nombre) => (
            <li key={nombre}>
              <span className="tema-hex home__avatar home__avatar--chico" style={{ background: colorParaNombre(nombre) }}>
                {iniciales(nombre)}
              </span>
              {nombre}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Home;
