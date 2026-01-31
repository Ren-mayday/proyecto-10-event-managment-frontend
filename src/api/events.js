import { API_URL, apiFetch } from "./config";

// Obtener todos los eventos
export const getEvents = async () => {
  return await apiFetch("/events");
};

// Obtener un evento (por ID)
export const getEventById = async (id) => {
  return await apiFetch(`/events/${id}`);
};

// Crear un evento (JSON y FormData)
export const createEvent = async (eventData) => {
  const token = localStorage.getItem("token");

  // Si es FormData (tiene imagen), usar fetch directamente
  if (eventData instanceof FormData) {
    const response = await apiFetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: eventData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return;
  }

  // Si es JSON normal, usar apiFetch
  return await apiFetch("/event", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
};

// Actualizar un evento (JSON y FormData)
export const updateEvent = async (id, eventData) => {
  const token = localStorage.getItem("token");

  // Si es FormData (tiene image), usar fetch directamente
  if (eventData instanceof FormData) {
    const response = await fetch(`${API_URL}/event/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: eventData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  }

  return await apiFetch(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(eventData),
  });
};

// Eliminar un evento
export const deleteEvent = async (id) => {
  return await apiFetch(`/events/${id}`, {
    method: "DELETE",
  });
};

// Añadir asistente a un evento
export const addAttendee = async (eventId, userId) => {
  return await apiFetch(`/events/${eventId}/attendees`, {
    method: "POST",
    body: JSON.stringify({ userId }),
  });
};
