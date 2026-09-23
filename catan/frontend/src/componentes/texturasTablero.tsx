// Texturas de los hexagonos.

const TERRENOS = ['desierto', 'bosque', 'pasto', 'campo', 'colina', 'montana'];

function TexturasTablero() {
  return (
    <defs>
      {TERRENOS.map((n) => (
        <pattern
          key={n}
          id={`tex-${n}`}
          patternContentUnits="objectBoundingBox"
          width="1"
          height="1"
        >
          <image
            href={`img/tex/${n}.png`}
            width="1"
            height="1"
            preserveAspectRatio="xMidYMid slice"
          />
        </pattern>
      ))}
    </defs>
  );
}

export default TexturasTablero;