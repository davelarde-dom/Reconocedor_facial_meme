import { useState } from "react";
import { useCamara } from "./camara/useCamara";
import { useDeteccionFacial } from "./deteccion/useDeteccionFacial";
import { clasificarExpresion } from "./expresiones/expresiones";
import { useExpresionEstable } from "./expresiones/useExpresionEstable";
import { CATALOGO } from "./memes/catalogo";
import VisorMeme from "./memes/VisorMeme";
import PanelCalibracion from "./componentes/PanelCalibracion";

export default function Inicio() {
  const camara = useCamara();
  const camaraActiva = camara.estado === "activa";
  const deteccion = useDeteccionFacial(camara.videoRef, camaraActiva);
  const [verCalibracion, setVerCalibracion] = useState(false);

  const detectada = deteccion.puntajes ? clasificarExpresion(deteccion.puntajes) : null;
  const confirmada = useExpresionEstable(detectada);
  const meme = confirmada ? CATALOGO[confirmada] ?? null : null;

  let mensajeVacio = "Enciende la cámara para empezar";
  if (camaraActiva) {
    if (deteccion.estado === "cargando") mensajeVacio = "Cargando detector facial…";
    else if (deteccion.estado === "error") mensajeVacio = "No se pudo cargar el detector. Revisa tu conexión a internet.";
    else if (!deteccion.puntajes) mensajeVacio = "No veo ningún rostro 👀";
    else mensajeVacio = "Haz una expresión…";
  }

  return (
    <main className="inicio">
      <h1>Reconocedor facial de memes de gatos 🐱</h1>

      <section className="escenario">
        <div className="camara">
          <video ref={camara.videoRef} playsInline muted />
          {!camaraActiva && (
            <div className="camara__cubierta">
              {camara.error && <p className="error">{camara.error}</p>}
              <button onClick={camara.iniciar} disabled={camara.estado === "solicitando"}>
                {camara.estado === "solicitando" ? "Esperando permiso…" : "Encender cámara"}
              </button>
            </div>
          )}
        </div>

        <VisorMeme meme={meme} mensajeVacio={mensajeVacio} />
      </section>

      <div className="controles">
        {camaraActiva && <button onClick={camara.detener}>Apagar cámara</button>}
        <button onClick={() => setVerCalibracion((v) => !v)}>
          {verCalibracion ? "Ocultar calibración" : "Mostrar calibración"}
        </button>
      </div>

      {verCalibracion && <PanelCalibracion puntajes={deteccion.puntajes} detectada={detectada} />}
    </main>
  );
}
