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
export const register = async (userName, email, password, securityQuestion, securityAnswer) => {
  const data = await apiFetch("/users/register", {
    method: "POST",
    body: JSON.stringify({
      userName,
      email,
      password,
      securityQuestion,
      securityAnswer,
    }),
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

// Request password reset - paso 1: obtener pregunta de seguridad
export const requestPasswordReset = async (identifier) => {
  const data = await apiFetch("users/forgot-password", {
    method: "POST",
    body: JSON.stringify({
      userName: identifier,
      email: identifier,
    }),
  });

  return data;
};

// Reset password - paso 2: validar respuesta y cambiar contraseña
export const resetPassword = async (userId, securityAnswer, newPassword) => {
  const data = await apiFetch("/users/reset-password", {
    method: "POST",
    body: JSON.stringify({
      userId,
      securityAnswer,
      newPassword,
    }),
  });

  // Guardar token y usuario en localStorage (auto-login después del reset)
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};
