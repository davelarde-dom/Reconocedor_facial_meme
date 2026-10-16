import type { Expresion } from "../expresiones/expresiones";

export interface Meme {
  /** Ruta de la imagen dentro de public/ (por ejemplo /memes/gato-feliz.jpg) */
  imagen: string;
  /** Texto alternativo y título que se muestra debajo */
  titulo: string;
}

/**
 * Qué meme aparece con cada expresión. Para cambiar un meme, pon la imagen
 * en public/memes/ y cambia aquí la ruta. Si una expresión no está en esta
 * lista, no muestra ningún meme.
 */
export const CATALOGO: Partial<Record<Expresion, Meme>> = {
  sorpresa: { imagen: "/memes/gato-sorprendido.jpg", titulo: "Gato sorprendido" },
  lengua: { imagen: "/memes/gato-blep.jpg", titulo: "Gato blep" },
  triste: { imagen: "/memes/gato-triste.jpg", titulo: "Gato triste" },
  neutral: { imagen: "/memes/gato-neutral.jpg", titulo: "Gato serio" },
};
