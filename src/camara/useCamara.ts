import { useCallback, useEffect, useRef, useState } from "react";

export type EstadoCamara = "inactiva" | "solicitando" | "activa" | "error";

/**
 * Maneja el acceso a la cámara web y la conecta a un <video>.
 * Devuelve la referencia que hay que poner en el <video> y funciones para
 * encender/apagar la cámara.
 */
export function useCamara() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [estado, setEstado] = useState<EstadoCamara>("inactiva");
  const [error, setError] = useState<string | null>(null);

  const detener = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setEstado("inactiva");
  }, []);

  const iniciar = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Tu navegador no permite usar la cámara.");
      setEstado("error");
      return;
    }

    setEstado("solicitando");
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current;
      if (video) {
        video.srcObject = stream;
        await video.play();
      }
      setEstado("activa");
    } catch (e) {
      const mensaje =
        e instanceof DOMException && e.name === "NotAllowedError"
          ? "Permiso de cámara denegado. Actívalo en el navegador."
          : "No se pudo abrir la cámara.";
      setError(mensaje);
      setEstado("error");
    }
  }, []);

  // Apagar la cámara al desmontar el componente
  useEffect(() => detener, [detener]);

  return { videoRef, estado, error, iniciar, detener };
}
