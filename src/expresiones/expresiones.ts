import type { Puntajes } from "../deteccion/detectorFacial";

export type Expresion = "lengua" | "sorpresa" | "pensativo" | "triste" | "neutral";

/**
 * Umbrales (0 a 1) para cada gesto. Si una expresión se detecta demasiado
 * fácil o casi nunca, ajusta aquí el número usando el panel de calibración.
 */
export const UMBRALES = {
  lengua: 0.3,
  bocaAbierta: 0.45,
  cejasArriba: 0.35,
  mirarArriba: 0.4,
  tristeza: 0.3,
};

interface Regla {
  expresion: Expresion;
  nombre: string;
  instrucciones: string;
  cumple: (p: Puntajes) => boolean;
}

const val = (p: Puntajes, nombre: string) => p[nombre] ?? 0;
const promedio = (p: Puntajes, izq: string, der: string) => (val(p, izq) + val(p, der)) / 2;

/**
 * Reglas en orden de prioridad: gana la primera que se cumpla.
 * Los gestos más específicos (lengua) van antes que los generales.
 */
export const REGLAS: Regla[] = [
  {
    expresion: "lengua",
    nombre: "Lengua afuera",
    instrucciones: "Saca la lengua",
    cumple: (p) => val(p, "tongueOut") > UMBRALES.lengua,
  },
  {
    expresion: "sorpresa",
    nombre: "Sorpresa",
    instrucciones: "Abre la boca y sube las cejas",
    cumple: (p) =>
      val(p, "jawOpen") > UMBRALES.bocaAbierta &&
      Math.max(val(p, "browInnerUp"), promedio(p, "browOuterUpLeft", "browOuterUpRight")) >
        UMBRALES.cejasArriba,
  },
  {
    expresion: "pensativo",
    nombre: "Pensativo",
    instrucciones: "Mira hacia arriba, como pensando",
    cumple: (p) => promedio(p, "eyeLookUpLeft", "eyeLookUpRight") > UMBRALES.mirarArriba,
  },
  {
    expresion: "triste",
    nombre: "Triste",
    instrucciones: "Baja las comisuras de la boca",
    cumple: (p) => promedio(p, "mouthFrownLeft", "mouthFrownRight") > UMBRALES.tristeza,
  },
];

export const NOMBRES_EXPRESION: Record<Expresion, string> = {
  ...(Object.fromEntries(REGLAS.map((r) => [r.expresion, r.nombre])) as Record<Expresion, string>),
  neutral: "Neutral",
};

/** Decide la expresión de un cuadro. Sin reglas cumplidas es "neutral". */
export function clasificarExpresion(puntajes: Puntajes): Expresion {
  return REGLAS.find((r) => r.cumple(puntajes))?.expresion ?? "neutral";
}
