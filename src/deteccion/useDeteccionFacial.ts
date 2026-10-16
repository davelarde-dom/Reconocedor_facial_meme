import { useEffect, useState, type RefObject } from "react";
import { analizarCuadro, obtenerDetector, type Puntajes } from "./detectorFacial";

export type EstadoDetector = "cargando" | "listo" | "error";

/**
 * Analiza el video en cada cuadro mientras `activo` sea true.
 * `puntajes` es null cuando no se ve ningún rostro.
 */
export function useDeteccionFacial(
  videoRef: RefObject<HTMLVideoElement | null>,
  activo: boolean
) {
  const [estado, setEstado] = useState<EstadoDetector>("cargando");
  const [puntajes, setPuntajes] = useState<Puntajes | null>(null);

  useEffect(() => {
    if (!activo) {
      setPuntajes(null);
      return;
    }

    let cancelado = false;
    let idCuadro = 0;
    let ultimoTiempoVideo = -1;

    obtenerDetector()
      .then((detector) => {
        if (cancelado) return;
        setEstado("listo");

        const bucle = () => {
          if (cancelado) return;
          const video = videoRef.current;
          // Solo analizar cuando hay un cuadro nuevo del video
          if (video && video.readyState >= 2 && video.currentTime !== ultimoTiempoVideo) {
            ultimoTiempoVideo = video.currentTime;
            setPuntajes(analizarCuadro(detector, video, performance.now()));
          }
          idCuadro = requestAnimationFrame(bucle);
        };
        bucle();
      })
      .catch((e) => {
        console.error("No se pudo cargar el detector facial:", e);
        if (!cancelado) setEstado("error");
      });

    return () => {
      cancelado = true;
      cancelAnimationFrame(idCuadro);
    };
  }, [videoRef, activo]);

  return { estado, puntajes };
}
