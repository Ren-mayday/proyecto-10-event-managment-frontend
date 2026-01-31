import { getEventById, deleteEvent } from "../../api/events";
import { API_URL } from "../../api/config";
import { navigate } from "../../router/navigation";
import { isAuthenticated, getCurrentUser } from "../../api/auth";
import { Button } from "../../components/Button/Button";
import { Loading } from "../../components/Loading/Loading";
import "./EventDetail.css";

const EventDetail = () => {
  const section = document.createElement("section");
  section.className = "event-detail-container";

  // Obtener ID del evento desde la URL
  const eventId = window.location.pathname.split("/event/")[1];

  if (!eventId) {
    section.innerHTML = '<p class="error">Event not found</p>';
    return section;
  }

  // Usar componente Loading
  const loadingComponent = Loading("Loading event...");
  section.append(loadingComponent);

  // Cargar evento
  loadEventDetail(section, eventId);

  return section;
};

async function loadEventDetail(container, eventId) {
  try {
    const event = await getEventById(eventId);
    container.innerHTML = "";

    // Card del evento
    const card = document.createElement("div");
    card.className = "event-detail-card";

    // Imagen
    const imageSection = document.createElement("div");
    imageSection.className = "event-detail-image";
    if (event.imageURL) {
      imageSection.style.backgroundImage = `url(${event.imageURL})`;
    } else {
      imageSection.style.backgroundImage = "url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800)";
    }

    // Contenido
    const content = document.createElement("div");
    content.className = "event-detail-content";

    const title = document.createElement("h1");
    title.textContent = event.title;

    const dateInfo = document.createElement("p");
    dateInfo.className = "event-info";
    dateInfo.innerHTML = `📅 ${event.formattedDate || new Date(event.date).toLocaleDateString()}`;

    const locationInfo = document.createElement("p");
    locationInfo.className = "event-info";
    locationInfo.innerHTML = `📍 ${event.location}`;

    // Mostrar creador
    const creatorInfo = document.createElement("p");
    creatorInfo.className = "event-creator";
    creatorInfo.innerHTML = `👤 Created by: <span class="creator-name">${
      event.createdBy?.userName || "Unknown"
    }</span>`;
    creatorInfo.style.cursor = "pointer";

    // Click en el nombre del creador → ver su perfil
    creatorInfo.querySelector(".creator-name")?.addEventListener("click", (e) => {
      e.stopPropagation();
      if (event.createdBy?.userName) {
        navigate(`/user/${event.createdBy.userName}`);
      }
    });

    const description = document.createElement("p");
    description.className = "event-description";
    description.textContent = event.description || "No description available";

    // Asistentes
    const attendeesSection = document.createElement("div");
    attendeesSection.className = "attendees-section";

    const attendeesTitle = document.createElement("h3");
    attendeesTitle.textContent = `Attendees (${event.attendees?.length || 0})`;

    const attendeesList = document.createElement("div");
    attendeesList.className = "attendees-list";

    if (event.attendees && event.attendees.length > 0) {
      event.attendees.forEach((attendee) => {
        const attendeeItem = document.createElement("span");
        attendeeItem.className = "attendee-badge";
        attendeeItem.textContent = attendee.userName;
        attendeesList.append(attendeeItem);
      });
    } else {
      attendeesList.innerHTML = '<p class="no-attendees">No attendees yet</p>';
    }

    attendeesSection.append(attendeesTitle, attendeesList);

    // Botones de acción
    const actionsDiv = createActionButtons(event);

    content.append(title, dateInfo, locationInfo, description, attendeesSection, actionsDiv);
    card.append(imageSection, content);
    container.append(card);
  } catch (error) {
    container.innerHTML = `<p class="error">Error loading event: ${error.message}</p>`;
  }
}

function createActionButtons(event) {
  const actionsDiv = document.createElement("div");
  actionsDiv.className = "event-actions";

  const user = getCurrentUser();
  const isLoggedIn = isAuthenticated();

  // Botón volver
  const backBtn = Button({
    text: "← Back to Events",
    variant: "outline",
    onClick: () => navigate("/"),
  });

  actionsDiv.append(backBtn);

  if (!isLoggedIn) {
    // Si no está logueado, botón para ir al login
    const loginBtn = Button({
      text: "Login to Attend",
      variant: "primary",
      onClick: () => navigate("/login"),
    });
    actionsDiv.append(loginBtn);
    return actionsDiv;
  }

  // Verificar si el usuario es creador o admin
  // Manejar createdBy como objeto o string
  const creatorId = event.createdBy?._id || event.createdBy;
  const isCreator = user?.id === creatorId;
  const isAdmin = user?.role === "admin";

  // Botón Asistir/Dejar de asistir
  const isAttending = event.attendees?.some((a) => a._id === user.id || a.id === user.id);

  const attendBtn = Button({
    text: isAttending ? "Leave Event" : "Attend Event",
    variant: isAttending ? "outline" : "secondary",
    onClick: () => handleAttendance(event.id, isAttending),
  });

  actionsDiv.append(attendBtn);

  // Si es creador o admin, mostrar botones Edit y Delete
  if (isCreator || isAdmin) {
    const editBtn = Button({
      text: "Edit Event",
      variant: "primary",
      onClick: () => navigate(`/edit-event/${event.id}`),
    });

    const deleteBtn = Button({
      text: "Delete Event",
      variant: "danger",
      onClick: () => handleDelete(event.id),
    });

    actionsDiv.append(editBtn, deleteBtn);
  }

  return actionsDiv;
}

async function handleAttendance(eventId, isAttending) {
  try {
    const token = localStorage.getItem("token");
    const method = isAttending ? "DELETE" : "POST";

    const response = await fetch(`${API_URL}/events/${eventId}/attend`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to update attendance");
    }

    // re-renderizar la página
    const section = document.querySelector(".event-detail-container");
    if (section) {
      section.innerHTML = "";
      const loadingComponent = Loading("Updating");
      section.append(loadingComponent);
      await loadEventDetail(section, eventId);
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

async function handleDelete(eventId) {
  const confirmed = confirm("Are you sure you want to delete this event? This action cannot be undone.");

  if (!confirmed) return;

  try {
    await deleteEvent(eventId);
    alert("Event deleted successfully");
    navigate("/");
  } catch (error) {
    alert(`Error deleting event: ${error.message}`);
  }
}

export default EventDetail;
