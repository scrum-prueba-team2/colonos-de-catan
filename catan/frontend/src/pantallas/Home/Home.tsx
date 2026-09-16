import "./Home.css";

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

const COLORES_AVATAR = ["#6c5ce0", "#3ddc97", "#e0a63d", "#4f8fe0", "#e0638a"];

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

function HexIsla() {
  // Ilustración original inspirada en las fichas hexagonales de recursos
  // del juego (no es arte oficial de Catan).
  const hex = (cx: number, cy: number, color: string) => {
    const r = 46;
    const puntos = Array.from({ length: 6 }, (_, i) => {
      const angulo = (Math.PI / 180) * (60 * i - 30);
      return `${cx + r * Math.cos(angulo)},${cy + r * Math.sin(angulo)}`;
    }).join(" ");
    return (
      <polygon key={`${cx}-${cy}`} points={puntos} fill={color} stroke="#10131a" strokeWidth={3} />
    );
  };

  return (
    <svg viewBox="0 0 400 220" className="home__hex-arte" aria-hidden="true">
      {hex(120, 70, "#3f7d4f")}
      {hex(200, 70, "#c97b3d")}
      {hex(280, 70, "#d9b23d")}
      {hex(80, 140, "#8fa83d")}
      {hex(160, 140, "#8a8f99")}
      {hex(240, 140, "#e0cf9c")}
      {hex(320, 140, "#3f7d4f")}
    </svg>
  );
}

function Home({ onAbrirMenu }: HomeProps) {
  return (
    <div className="home">
      <nav className="home__nav">
        <span className="home__marca">Catan Online</span>
        <button className="home__nav-btn" onClick={onAbrirMenu} aria-label="Abrir menú de partidas">
          <span aria-hidden="true">👥</span>
        </button>
      </nav>

      <header className="home__hero">
        <span className="home__badge">En desarrollo · versión de prueba</span>
        <HexIsla />
        <h1>Construye, comercia, coloniza</h1>
        <p>
          La versión en línea de Catan que estamos construyendo para jugar por
          turnos con tus amigos, desde cualquier navegador o celular.
        </p>
        <button className="home__cta" onClick={onAbrirMenu}>
          Jugar ahora
        </button>
      </header>

      <section className="home__equipo">
        <h2>El equipo</h2>

        <div className="home__roles">
          {LIDERAZGO.map((persona) => (
            <div className="home__rol" key={persona.nombre}>
              <span className="home__avatar" style={{ background: colorParaNombre(persona.nombre) }}>
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
              <span className="home__avatar home__avatar--chico" style={{ background: colorParaNombre(nombre) }}>
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