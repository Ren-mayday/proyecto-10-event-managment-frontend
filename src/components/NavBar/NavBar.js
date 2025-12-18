import { routes } from "../../router/routes";
import { navigate } from "../../router/navigation";
import { isAuthenticated, getCurrentUser, logout } from "../../api/auth";
import "./NavBar.css";

export const Navbar = () => {
  const header = document.getElementById("header");

  if (!header) {
    console.error("Header element not found!");
    return;
  }

  header.innerHTML = "";

  const nav = document.createElement("nav");
  nav.className = "navbar";

  // Logo a la izquierda
  const logo = document.createElement("div");
  logo.className = "navbar-logo";

  const logoLink = document.createElement("a");
  logoLink.href = "/";
  logoLink.textContent = "Event Management";
  logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/");
  });

  logo.append(logoLink);

  // Hamburger button (solo móvil)
  const hamburger = document.createElement("button");
  hamburger.className = "hamburger";
  hamburger.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;
  hamburger.setAttribute("aria-label", "Toggle menu");

  // Menú central
  const menu = document.createElement("div");
  menu.className = "navbar-menu";

  // Rutas públicas
  const publicRoutes = routes.filter((route) => route.path === "/" || route.path === "/events");

  publicRoutes.forEach((route) => {
    const link = createNavLink(route.path, route.text);
    menu.append(link);
  });

  // Botones solo si está logueado
  if (isAuthenticated()) {
    const createLink = createNavLink("/create-event", "Create Event");
    const profileLink = createNavLink("/my-profile", "My Profile");
    menu.append(createLink, profileLink);
  }

  // Sección derecha (auth)
  const authSection = document.createElement("div");
  authSection.className = "navbar-auth";

  if (isAuthenticated()) {
    const user = getCurrentUser();

    const userInfo = document.createElement("div");
    userInfo.className = "user-info";

    const userName = document.createElement("span");
    userName.className = "user-name";
    userName.textContent = user.userName;

    if (user.role === "admin") {
      const adminBadge = document.createElement("span");
      adminBadge.className = "admin-badge";
      adminBadge.textContent = "Admin";
      userInfo.append(userName, adminBadge);
    } else {
      userInfo.append(userName);
    }

    const logoutBtn = document.createElement("button");
    logoutBtn.className = "logout-btn";
    logoutBtn.textContent = "Logout";
    logoutBtn.addEventListener("click", () => {
      logout();
      navigate("/");
      Navbar();
    });

    authSection.append(userInfo, logoutBtn);
  } else {
    const loginLink = createNavLink("/login", "Login");
    const registerLink = createNavLink("/register", "Register", "navbar-register");
    authSection.append(loginLink, registerLink);
  }

  menu.append(authSection);

  nav.append(logo, hamburger, menu);
  header.append(nav);

  // Toggle hamburger menu
  hamburger.addEventListener("click", () => {
    menu.classList.toggle("active");
    hamburger.classList.toggle("active");
  });

  // Cerrar menú al hacer click en un link
  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A" || e.target.tagName === "BUTTON") {
      menu.classList.remove("active");
      hamburger.classList.remove("active");
    }
  });
};

function createNavLink(path, text, extraClass = "") {
  const link = document.createElement("a");
  link.href = path;
  link.textContent = text;
  link.className = `navbar-link ${extraClass}`;

  if (window.location.pathname === path) {
    link.classList.add("active");
  }

  link.addEventListener("click", (e) => {
    e.preventDefault();
    navigate(path);
    updateActiveLink();
  });

  return link;
}

function updateActiveLink() {
  document.querySelectorAll(".navbar-link").forEach((l) => l.classList.remove("active"));
  const currentPath = window.location.pathname;
  document.querySelectorAll(".navbar-link").forEach((l) => {
    if (l.getAttribute("href") === currentPath) {
      l.classList.add("active");
    }
  });
}
