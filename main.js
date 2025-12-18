import { renderRoute } from "./src/router/navigation";
import { Navbar } from "./src/components/NavBar/NavBar";
import { Footer } from "./src/components/Footer/Footer";

function init() {
  // Renderizo el Navbar
  Navbar();
  Footer();
  // Renderizo la ruta inicial
  renderRoute();
}

// Si el DOM ya está listo, ejecuta directamente
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
