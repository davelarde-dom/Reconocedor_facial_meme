import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

// Debe coincidir con la versión instalada en package.json
const VERSION_MEDIAPIPE = "1.0.1";
const RUTA_WASM = `https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@${VERSION_MEDIAPIPE}/wasm`;
const RUTA_MODELO =
  "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task";

/**
 * Puntajes de 0 a 1 por cada gesto facial (blendshape) de MediaPipe,
 * por ejemplo: { mouthSmileLeft: 0.8, jawOpen: 0.1, ... }
 */
export type Puntajes = Record<string, number>;

let instancia: Promise<FaceLandmarker> | null = null;

/** Crea el detector una sola vez y lo reutiliza. */
export function obtenerDetector(): Promise<FaceLandmarker> {
  instancia ??= crearDetector().catch((e) => {
    instancia = null; // permitir reintentar
    throw e;
  });
  return instancia;
}

async function crearDetector(): Promise<FaceLandmarker> {
  const archivos = await FilesetResolver.forVisionTasks(RUTA_WASM);
  const opciones = {
    outputFaceBlendshapes: true,
    runningMode: "VIDEO" as const,
    numFaces: 1,
  };

  try {
    return await FaceLandmarker.createFromOptions(archivos, {
      ...opciones,
      baseOptions: { modelAssetPath: RUTA_MODELO, delegate: "GPU" },
    });
  } catch {
    // Algunos equipos no soportan GPU en el navegador
    return FaceLandmarker.createFromOptions(archivos, {
      ...opciones,
      baseOptions: { modelAssetPath: RUTA_MODELO, delegate: "CPU" },
    });
  }
}

/** Analiza un cuadro del video. Devuelve null si no hay rostro. */
export function analizarCuadro(
  detector: FaceLandmarker,
  video: HTMLVideoElement,
  marcaTiempo: number
): Puntajes | null {
  const resultado = detector.detectForVideo(video, marcaTiempo);
  const categorias = resultado.faceBlendshapes[0]?.categories;
  if (!categorias) return null;

  const puntajes: Puntajes = {};
  for (const c of categorias) puntajes[c.categoryName] = c.score;
  return puntajes;
}
