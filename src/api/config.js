// URL base de tu backend
export const API_URL = import.meta.env.PROD
  ? "proyecto-10-event-management-backend.vercel.app"
  : "http://localhost:4000/api/v1";

// Función helper para hacer fetch con configuración común
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
