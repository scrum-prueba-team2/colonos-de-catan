import "./Decoracion.css";

// Recursos del juego flotando sobre el mar, detrás del contenido.
// Usa los mismos íconos que la partida (public/svg). Es solo decoración:
// no se lee con lector de pantalla ni recibe clics.
const RECURSOS = [
  { icono: "madera", arriba: "12%", izquierda: "6%", tam: 46, giro: -12, retraso: 0 },
  { icono: "trigo", arriba: "70%", izquierda: "4%", tam: 40, giro: 10, retraso: 1.2 },
  { icono: "lana", arriba: "20%", izquierda: "88%", tam: 52, giro: 8, retraso: 0.6 },
  { icono: "ladrillo", arriba: "78%", izquierda: "90%", tam: 42, giro: -8, retraso: 1.8 },
  { icono: "piedra", arriba: "46%", izquierda: "94%", tam: 36, giro: 14, retraso: 2.4 },
  { icono: "trigo", arriba: "90%", izquierda: "48%", tam: 30, giro: -18, retraso: 0.9 },
];

function Decoracion() {
  return (
    <div className="decoracion" aria-hidden="true">
      {RECURSOS.map((r, i) => (
        <img
          key={i}
          className="decoracion__recurso"
          src={`/svg/${r.icono}.svg`}
          alt=""
          style={{
            top: r.arriba,
            left: r.izquierda,
            width: r.tam,
            height: r.tam,
            animationDelay: `${r.retraso}s`,
            ["--giro" as string]: `${r.giro}deg`,
          }}
        />
      ))}
    </div>
  );
}

export default Decoracion;
