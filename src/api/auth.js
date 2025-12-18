import { apiFetch } from "./config";

// Login
export const login = async (email, password) => {
  const data = await apiFetch("/users/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Guardar token y usuario en localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

// Register
export const register = async (userName, email, password) => {
  const data = await apiFetch("/users/register", {
    method: "POST",
    body: JSON.stringify({ userName, email, password }),
  });

  // Guardar token y usuario en localStorage
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

// Logout
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Verificar si está logueado
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Obtener usuario actual
export const getCurrentUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Verificar si es admin
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === "admin";
};
