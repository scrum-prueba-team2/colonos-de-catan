import './tablaCostes.css'

function TablaCostes() {
  return (
    <div className="tcMarco">

      <h2 className="tcTitulo">Tabla de costes</h2>

      <ul className="tcLista">
        <li className="tcFila">
          <img className="tcIconoPieza" src="/svg/carretera.svg" alt="Carretera" />
          <span className="tcNombre">Carretera</span>
          <img className="tcRecurso" src="/svg/madera.svg" alt="Madera" />
          <img className="tcRecurso" src="/svg/ladrillo.svg" alt="Ladrillo" />
        </li>

        <li className="tcFila">
          <img className="tcIconoPieza" src="/svg/poblado.svg" alt="Poblado" />
          <span className="tcNombre">Poblado</span>
          <img className="tcRecurso" src="/svg/madera.svg" alt="Madera" />
          <img className="tcRecurso" src="/svg/ladrillo.svg" alt="Ladrillo" />
          <img className="tcRecurso" src="/svg/trigo.svg" alt="Trigo" />
          <img className="tcRecurso" src="/svg/lana.svg" alt="Lana" />
        </li>

        <li className="tcFila">
          <img className="tcIconoPieza" src="/svg/ciudad.svg" alt="Ciudad" />
          <span className="tcNombre">Ciudad</span>
          <span>2</span>
          <img className="tcRecurso" src="/svg/trigo.svg" alt="Trigo" />
          <span>3</span>
          <img className="tcRecurso" src="/svg/piedra.svg" alt="Piedra" />
        </li>

        <li className="tcFila">
          <img className="tcIconoPieza" src="/svg/desarrollo.svg" alt="Carta de desarrollo" />
          <span className="tcNombre">Carta de desarrollo</span>
          <img className="tcRecurso" src="/svg/trigo.svg" alt="Trigo" />
          <img className="tcRecurso" src="/svg/lana.svg" alt="Lana" />
          <img className="tcRecurso" src="/svg/piedra.svg" alt="Piedra" />
        </li>
      </ul>
    </div>
  );
}

export default TablaCostes;