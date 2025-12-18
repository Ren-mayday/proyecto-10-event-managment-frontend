import { apiFetch } from "./config";

// Obtener todos los eventos
export const getEvents = async () => {
  return await apiFetch("/events");
};

// Obtener un evento por ID
export const getEventById = async (id) => {
  return await apiFetch(`/events/${id}`);
};

// Crear un evento
export const createEvent = async (eventData) => {
  return await apiFetch("/events", {
    method: "POST",
    body: JSON.stringify(eventData),
  });
};

// Actualizar un evento
export const updateEvent = async (id, eventData) => {
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
