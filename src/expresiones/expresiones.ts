import type { Puntajes } from "../deteccion/detectorFacial";

export type Expresion =
  | "guino"
  | "ojos_cerrados"
  | "lengua"
  | "sorpresa"
  | "beso"
  | "feliz"
  | "enojado"
  | "triste"
  | "neutral";

/**
 * Umbrales (0 a 1) para cada gesto. Si una expresión se detecta demasiado
 * fácil o casi nunca, ajusta aquí el número usando el panel de calibración.
 */
export const UMBRALES = {
  ojoCerrado: 0.5,
  ojoAbierto: 0.3,
  lengua: 0.3,
  bocaAbierta: 0.45,
  cejasArriba: 0.35,
  beso: 0.7,
  sonrisa: 0.55,
  cejasAbajo: 0.45,
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
 * Los gestos más específicos (guiño, lengua) van antes que los generales.
 */
export const REGLAS: Regla[] = [
  {
    expresion: "guino",
    nombre: "Guiño",
    instrucciones: "Cierra un solo ojo",
    cumple: (p) => {
      const izq = val(p, "eyeBlinkLeft");
      const der = val(p, "eyeBlinkRight");
      return (
        (izq > UMBRALES.ojoCerrado && der < UMBRALES.ojoAbierto) ||
        (der > UMBRALES.ojoCerrado && izq < UMBRALES.ojoAbierto)
      );
    },
  },
  {
    expresion: "ojos_cerrados",
    nombre: "Ojos cerrados",
    instrucciones: "Cierra los dos ojos",
    cumple: (p) => Math.min(val(p, "eyeBlinkLeft"), val(p, "eyeBlinkRight")) > UMBRALES.ojoCerrado,
  },
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
    expresion: "beso",
    nombre: "Beso",
    instrucciones: "Haz trompita como para dar un beso",
    cumple: (p) => val(p, "mouthPucker") > UMBRALES.beso,
  },
  {
    expresion: "feliz",
    nombre: "Feliz",
    instrucciones: "Sonríe",
    cumple: (p) => promedio(p, "mouthSmileLeft", "mouthSmileRight") > UMBRALES.sonrisa,
  },
  {
    expresion: "enojado",
    nombre: "Enojado",
    instrucciones: "Frunce el ceño (baja las cejas)",
    cumple: (p) => promedio(p, "browDownLeft", "browDownRight") > UMBRALES.cejasAbajo,
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
