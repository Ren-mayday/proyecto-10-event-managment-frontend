// Lógica de navegación
import { routes } from "./routes";
import { Navbar } from "../components/NavBar/NavBar";

export function renderRoute() {
  const main = document.getElementById("main");

  if (!main) {
    console.error("Main element not found!");
    return;
  }

  main.innerHTML = "";

  const path = window.location.pathname;

  let route = routes.find((r) => r.path === path);

  // Si no encuentra la ruta exacta, buscar rutas dinámicas
  if (!route) {
    // Rutas con parámetros dinámicos
    if (path.startsWith("/event/")) {
      route = routes.find((r) => r.path === "/event");
    } else if (path.startsWith("/edit-event/")) {
      route = routes.find((r) => r.path === "/edit-event");
    } else if (path.startsWith("/reset-password/")) {
      route = routes.find((r) => r.path === "/reset-password");
    } else if (path.startsWith("/user/")) {
      route = routes.find((r) => r.path === "/user");
    }
  }

  // Si aún no hay ruta, usa Home (404)
  if (!route) {
    route = routes[0];
  }

  const Page = route.page;
  const pageElement = Page();

  if (pageElement) {
    main.append(pageElement);
  } else {
    console.error("Page component did not return a valid element");
  }

  // Re-renderizar navbar para actualizar links activos
  Navbar();
}

export function navigate(path) {
  window.history.pushState({}, "", path);
  renderRoute();
}

window.addEventListener("popstate", renderRoute);
