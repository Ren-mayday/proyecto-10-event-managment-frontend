import { getEvents } from "../../api/events";
import { EventCard } from "../../components/EventCard/EventCard";
import { Loading } from "../../components/Loading/Loading";
import "./Home.css";

const Home = () => {
  const section = document.createElement("section");
  section.className = "home-container";

  // Título
  const header = document.createElement("div");
  header.className = "home-header";

  const title = document.createElement("h2");
  title.textContent = "Upcoming Events";

  header.append(title);

  // Contenedor de eventos
  const eventsContainer = document.createElement("div");
  eventsContainer.className = "events-grid";
  eventsContainer.append(Loading("Loading events..."));

  section.append(header, eventsContainer);

  // Cargar eventos
  loadEvents(eventsContainer);

  return section;
};

async function loadEvents(container) {
  try {
    const events = await getEvents();

    if (events.length === 0) {
      container.innerHTML = '<p class="no-events">No events found. Be the first to create one!</p>';
      return;
    }

    container.innerHTML = "";

    events.forEach((event) => {
      const card = EventCard(event);
      container.append(card);
    });
  } catch (error) {
    container.innerHTML = `<p class="error">Error loading events: ${error.message}</p>`;
  }
}

export default Home;
