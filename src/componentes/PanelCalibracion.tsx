import type { Puntajes } from "../deteccion/detectorFacial";
import { NOMBRES_EXPRESION, REGLAS, type Expresion } from "../expresiones/expresiones";

// Gestos que usan las reglas de expresiones
const GESTOS_USADOS = [
  "mouthSmileLeft",
  "mouthSmileRight",
  "jawOpen",
  "browInnerUp",
  "browOuterUpLeft",
  "browOuterUpRight",
  "browDownLeft",
  "browDownRight",
  "eyeBlinkLeft",
  "eyeBlinkRight",
  "mouthPucker",
  "mouthFrownLeft",
  "mouthFrownRight",
  "tongueOut",
];

interface Props {
  puntajes: Puntajes | null;
  detectada: Expresion | null;
}

/** Muestra los puntajes en vivo para ajustar los umbrales de expresiones.ts */
export default function PanelCalibracion({ puntajes, detectada }: Props) {
  return (
    <aside className="panel-calibracion">
      <h2>Calibración</h2>
      <p>
        Detectando ahora:{" "}
        <strong>{detectada ? NOMBRES_EXPRESION[detectada] : "sin rostro"}</strong>
      </p>

      <ul className="barras">
        {GESTOS_USADOS.map((gesto) => {
          const valor = puntajes?.[gesto] ?? 0;
          return (
            <li key={gesto}>
              <span className="barras__nombre">{gesto}</span>
              <span className="barras__pista">
                <span className="barras__relleno" style={{ width: `${valor * 100}%` }} />
              </span>
              <span className="barras__valor">{valor.toFixed(2)}</span>
            </li>
          );
        })}
      </ul>

      <h3>Expresiones</h3>
      <ul className="lista-expresiones">
        {REGLAS.map((r) => (
          <li key={r.expresion} className={r.expresion === detectada ? "activa" : undefined}>
            <strong>{r.nombre}:</strong> {r.instrucciones}
          </li>
        ))}
      </ul>
    </aside>
  );
}
