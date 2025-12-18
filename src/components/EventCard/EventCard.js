import { navigate } from "../../router/navigation";
import "./EventCard.css";

export const EventCard = (event) => {
  const card = document.createElement("div");
  card.className = "event-card";

  // Imagen del evento (placeholder si no tiene)
  const image = document.createElement("div");
  image.className = "event-image";
  if (event.imageURL) {
    image.style.backgroundImage = `url(${event.imageURL})`;
  } else {
    image.style.backgroundImage = "url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400)";
  }

  // Contenido del card
  const content = document.createElement("div");
  content.className = "event-content";

  const title = document.createElement("h3");
  title.textContent = event.title;

  const date = document.createElement("p");
  date.className = "event-date";
  date.innerHTML = `📅 ${event.formattedDate || new Date(event.date).toLocaleDateString()}`;

  const location = document.createElement("p");
  location.className = "event-location";
  location.innerHTML = `📍 ${event.location}`;

  const creator = document.createElement("p");
  creator.className = "event-creator-card";
  creator.innerHTML = `👤 ${event.createdBy?.userName || "Unknown"}`;

  const description = document.createElement("p");
  description.className = "event-description";
  description.textContent = event.description?.substring(0, 100) + "..." || "No description";

  const attendees = document.createElement("p");
  attendees.className = "event-attendees";
  attendees.innerHTML = `👥 ${event.attendees?.length || 0} attending`;

  content.append(title, date, location, creator, description, attendees);
  card.append(image, content);

  // Click para ir al detalle
  card.addEventListener("click", () => {
    navigate(`/event/${event.id}`);
  });

  return card;
};
