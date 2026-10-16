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
  neutral: { imagen: "/memes/gato-saludando.gif", titulo: "Gato saludando" },
  lengua: { imagen: "/memes/gato-lengua.gif", titulo: "Gato sacando la lengua" },
  triste: { imagen: "/memes/gato-llorando.webp", titulo: "Gato llorando" },
  pensativo: { imagen: "/memes/gato-pensativo.png", titulo: "Gato pensativo" },
  sorpresa: { imagen: "/memes/gato-sorprendido.png", titulo: "Gato sorprendido" },
};
