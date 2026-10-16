import { useState } from "react";
import type { Meme } from "./catalogo";

interface Props {
  meme: Meme | null;
  mensajeVacio: string;
}

/** Muestra el meme; si la imagen aún no existe, indica qué archivo falta. */
export default function VisorMeme({ meme, mensajeVacio }: Props) {
  const [imagenFallida, setImagenFallida] = useState<string | null>(null);

  if (!meme) {
    return <div className="visor-meme visor-meme--vacio">{mensajeVacio}</div>;
  }

  const falta = imagenFallida === meme.imagen;

  return (
    <figure className="visor-meme">
      {falta ? (
        <div className="visor-meme__falta">
          Falta la imagen:
          <code>public{meme.imagen}</code>
        </div>
      ) : (
        <img
          key={meme.imagen}
          src={meme.imagen}
          alt={meme.titulo}
          onError={() => setImagenFallida(meme.imagen)}
        />
      )}
      <figcaption>{meme.titulo}</figcaption>
    </figure>
  );
}
