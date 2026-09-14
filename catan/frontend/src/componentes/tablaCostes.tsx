import './tablaCostos.css'

function TablaCostes() {
  return (
    <div className="tcMarco">
      <h2 className="tcTitulo">Tabla de costes</h2>

      <ul className="tcLista">
        <li className="tcFila">
          <img className="tcIconoPieza" src="/img/carretera.png" alt="Carretera" />
          <span className="tcNombre">Carretera</span>
          <img className="tcRecurso" src="/img/madera.png" alt="Madera" />
          <img className="tcRecurso" src="/img/ladrillo.png" alt="Ladrillo" />
        </li>

        <li className="tcFila">
          <img className="tcIconoPieza" src="/img/poblado.png" alt="Poblado" />
          <span className="tcNombre">Poblado</span>
          <img className="tcRecurso" src="/img/madera.png" alt="Madera" />
          <img className="tcRecurso" src="/img/ladrillo.png" alt="Ladrillo" />
          <img className="tcRecurso" src="/img/trigo.png" alt="Trigo" />
          <img className="tcRecurso" src="/img/lana.png" alt="Lana" />
        </li>

        <li className="tcFila tcInactiva">
          <img className="tcIconoPieza" src="/img/ciudad.png" alt="Ciudad" />
          <span className="tcNombre">Ciudad</span>
          <img className="tcRecurso" src="/img/trigo.png" alt="Trigo" />
          <span>2</span>
          <img className="tcRecurso" src="/img/piedra.png" alt="Piedra" />
          <span>3</span>
        </li>

        <li className="tcFila tcInactiva">
          <img className="tcIconoPieza" src="/img/desarrollo.png" alt="Carta de desarrollo" />
          <span className="tcNombre">Carta de desarrollo</span>
          <img className="tcRecurso" src="/img/trigo.png" alt="Trigo" />
          <img className="tcRecurso" src="/img/lana.png" alt="Lana" />
          <img className="tcRecurso" src="/img/piedra.png" alt="Piedra" />
        </li>
      </ul>
    </div>
  );
}

export default TablaCostes;