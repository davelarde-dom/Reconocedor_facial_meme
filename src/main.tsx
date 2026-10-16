import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Inicio from "./Inicio";
import "./estilos.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Inicio />
  </StrictMode>
);
