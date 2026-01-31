import { apiFetch, API_URL } from "./config";

// Obtener perfil de un usuario por userName
export const getUserProfile = async (userName) => {
  return await apiFetch(`/users/${userName}`);
};

// Actualizar perfil del usuario
export const updateUserProfile = async (userId, userData) => {
  const token = localStorage.getItem("token");

  // Si hay avatar, usar FormData
  if (userData instanceof FormData) {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: userData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data || "Something went wrong");
    }

    return data;
  }

  // Si no hay avatar, usar JSON normal
  return await apiFetch(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};
