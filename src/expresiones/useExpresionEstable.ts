import { useEffect, useRef, useState } from "react";
import type { Expresion } from "./expresiones";

/**
 * Solo cambia la expresión confirmada cuando la nueva se mantiene durante
 * `msParaConfirmar`. Así un parpadeo o un gesto de medio segundo no dispara
 * un meme por accidente.
 *
 * `detectada` es null cuando no hay rostro en cámara.
 */
export function useExpresionEstable(detectada: Expresion | null, msParaConfirmar = 400) {
  const [confirmada, setConfirmada] = useState<Expresion | null>(null);
  const candidata = useRef<{ expresion: Expresion | null; desde: number } | null>(null);

  // Sin dependencias a propósito: se evalúa en cada render, que ocurre
  // en cada cuadro de video analizado.
  useEffect(() => {
    const ahora = performance.now();

    if (candidata.current?.expresion !== detectada) {
      candidata.current = { expresion: detectada, desde: ahora };
      return;
    }

    if (detectada !== confirmada && ahora - candidata.current.desde >= msParaConfirmar) {
      setConfirmada(detectada);
    }
  });

  return confirmada;
}
