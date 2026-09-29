import { useState, type FormEvent } from "react";
import "./CrearSala.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  LARGO_MAXIMO_ALIAS,
  LARGO_MAXIMO_CODIGO,
  aliasSugerido,
  validarAlias,
  validarCodigoAcceso,
} from "../validacionSala";

// Lo que CatanRoom.onCreate sabe leer (además del nombre del jugador).
export interface DatosNuevaSala {
  alias: string;
  privada: boolean;
  codigoAcceso?: string;
}

interface CrearSalaProps {
  nombreJugador: string;
  // Devuelve null si la sala se creó, o el mensaje de error a mostrar.
  onCrear: (datos: DatosNuevaSala) => Promise<string | null>;
  onVolver: () => void;
}

function CrearSala({ nombreJugador, onCrear, onVolver }: CrearSalaProps) {
  const [alias, setAlias] = useState(() => aliasSugerido(nombreJugador));
  // Apagado por defecto: las salas son públicas salvo que se pida lo contrario.
  const [privada, setPrivada] = useState(false);
  const [codigo, setCodigo] = useState("");
  const [intentoEnviar, setIntentoEnviar] = useState(false);
  const [creando, setCreando] = useState(false);
  const [errorServidor, setErrorServidor] = useState<string | null>(null);

  const errorAlias = validarAlias(alias);
  // El código solo importa si la sala es privada.
  const errorCodigo = privada ? validarCodigoAcceso(codigo) : null;
  const mostrarErrorAlias = intentoEnviar && errorAlias;
  const mostrarErrorCodigo = intentoEnviar && errorCodigo;

  async function crear(e: FormEvent) {
    e.preventDefault();
    setIntentoEnviar(true);
    if (errorAlias || errorCodigo || creando) return;

    setCreando(true);
    setErrorServidor(null);
    const error = await onCrear({
      alias: alias.trim(),
      privada,
      codigoAcceso: privada ? codigo : undefined,
    });
    // Si todo salió bien, Navegacion ya cambió de pantalla y este
    // componente se desmontó: no hay que tocar su estado.
    if (error) {
      setErrorServidor(error);
      setCreando(false);
    }
  }

  return (
    <div className="bg-info-subtle min-vh-100 px-3 py-4">
      <div className="mx-auto d-flex flex-column align-items-start gap-3 crear-sala__contenido">
        <Button variant="text" onClick={onVolver}>
          ← Volver
        </Button>

        <Card variant="outlined" className="w-100">
          <CardContent component="form" onSubmit={crear} noValidate className="p-4 d-flex flex-column gap-3">
            <header>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img src="/svg/ciudad.svg" alt="" aria-hidden="true" width={40} height={40} />
                <div>
                  <Typography variant="h5" component="h1">
                    Funda tu sala
                  </Typography>
                  <p className="mb-0 text-body-secondary">Ponle nombre y decide quién puede entrar.</p>
                </div>
              </div>
              <Divider />
            </header>

            <TextField
              id="alias-sala"
              label="Nombre de la sala"
              placeholder="Ej. Isla de los Amigos"
              fullWidth
              autoFocus
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              error={Boolean(mostrarErrorAlias)}
              helperText={
                <span className="d-flex justify-content-between gap-2">
                  <span>{mostrarErrorAlias ? errorAlias : "De 4 a 20 letras, números o espacios."}</span>
                  <span>
                    {alias.trim().length}/{LARGO_MAXIMO_ALIAS}
                  </span>
                </span>
              }
              slotProps={{ htmlInput: { maxLength: LARGO_MAXIMO_ALIAS } }}
            />

            <div className={"crear-sala__privacidad" + (privada ? " crear-sala__privacidad--privada" : "")}>
              <div className="crear-sala__privacidad-texto">
                <span className="crear-sala__privacidad-titulo" id="privacidad-titulo">
                  {privada ? "🔒 Sala privada" : "🌍 Sala pública"}
                </span>
                <span className="crear-sala__privacidad-detalle">
                  {privada
                    ? "Aparece en el listado, pero solo entra quien tenga el código."
                    : "Cualquiera puede verla en el listado y entrar."}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privada}
                aria-labelledby="privacidad-titulo"
                className="crear-sala__interruptor"
                onClick={() => setPrivada((p) => !p)}
              >
                <span className="crear-sala__interruptor-perilla" />
              </button>
            </div>

            {privada && (
              <div className="crear-sala__campo crear-sala__campo--codigo tema-aparecer">
                <label className="tema-etiqueta" htmlFor="codigo-sala">
                  Código de acceso
                </label>
                <input
                  id="codigo-sala"
                  className={"tema-input crear-sala__codigo" + (mostrarErrorCodigo ? " tema-input--error" : "")}
                  type="text"
                  placeholder="Ej. OVEJA7"
                  value={codigo}
                  maxLength={LARGO_MAXIMO_CODIGO}
                  autoComplete="off"
                  spellCheck={false}
                  aria-invalid={Boolean(mostrarErrorCodigo)}
                  aria-describedby="codigo-sala-ayuda"
                  // Los espacios no se admiten: se quitan mientras se escribe.
                  onChange={(e) => setCodigo(e.target.value.replace(/\s/g, ""))}
                />
                <span className="tema-ayuda" id="codigo-sala-ayuda">
                  <span className={mostrarErrorCodigo ? "tema-error" : ""}>
                    {mostrarErrorCodigo ? errorCodigo : "De 4 a 8 letras o números. Distingue mayúsculas."}
                  </span>
                  <span>
                    {codigo.length}/{LARGO_MAXIMO_CODIGO}
                  </span>
                </span>
              </div>
            )}

            {errorServidor && (
              <p className="tema-aviso" role="alert">
                ⚠️ {errorServidor}
              </p>
            )}

            <button type="submit" className="tema-btn tema-btn--ladrillo tema-btn--ancho" disabled={creando}>
              {creando ? "Creando sala…" : "🏗️ Crear sala"}
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CrearSala;
