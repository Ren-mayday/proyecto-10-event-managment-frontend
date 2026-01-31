import { getEventById, updateEvent } from "../../api/events";
import { navigate } from "../../router/navigation";
import { isAuthenticated, getCurrentUser } from "../../api/auth";
import { FormField } from "../../components/FormField/FormField";
import { Button } from "../../components/Button/Button";
import { Loading } from "../../components/Loading/Loading";
import "./EditEvent.css";

const EditEvent = () => {
  // Verificar si está autentificado
  if (!isAuthenticated()) {
    navigate("/login");
    return document.createElement("div");
  }

  const section = document.createElement("section");
  section.className = "edit-event-container";

  // Obtener ID del evento desde la URL
  const eventId = window.location.pathname.split("/edit-event/")[1];

  if (!eventId) {
    section.innerHTML = '<p class="error">Event not found</p>';
    return section;
  }

  // Loading mientras carga el evento
  section.append(Loading("Loading event..."));

  // Cargar evento y crear formulario
  loadEventAndCreateForm(section, eventId);

  return section;
};

async function loadEventAndCreateForm(container, eventId) {
  try {
    const event = await getEventById(eventId);
    const user = getCurrentUser();

    // Normalizar ambos IDs a string para comparar
    const creatorId = (event.createdBy?._id || event.createdBy)?.toString();
    const userId = (user?.id || user?._id)?.toString();
    const isCreator = userId === creatorId;
    const isAdmin = user?.role === "admin";

    if (!isCreator && !isAdmin) {
      container.innerHTML = '<p class="error">You don\'t have permission to edit this event</p>';
      return;
    }

    container.innerHTML = "";

    const card = document.createElement("div");
    card.className = "edit-event-card";

    const title = document.createElement("h2");
    title.textContent = "Edit Event";

    const form = document.createElement("form");
    form.className = "edit-event-form";

    // Title field (pre-rellenado)
    const titleField = FormField({
      label: "Event Title",
      type: "text",
      id: "title",
      name: "title",
      placeholder: "e.g., Pride March 2025",
      required: true,
      value: event.title,
    });

    // Date field (pre-rellenado)
    const dateValue = event.date ? new Date(event.date).toISOString().split("T")[0] : "";
    const dateField = FormField({
      label: "Date",
      type: "date",
      id: "date",
      name: "date",
      required: true,
      value: dateValue,
    });

    // Time field (extraído de la fecha si existe)
    const timeValue = event.date ? new Date(event.date).toTimeString().slice(0, 5) : "";
    const timeField = FormField({
      label: "Time",
      type: "time",
      id: "time",
      name: "time",
      required: false,
      value: timeValue,
    });

    // Location field (pre-rellenado)
    const locationField = FormField({
      label: "Location",
      type: "text",
      id: "location",
      name: "location",
      placeholder: "e.g., Plaça de Catalunya, Barcelona",
      required: true,
      value: event.location,
    });

    // Description field (pre-rellenado)
    const descriptionField = FormField({
      label: "Description",
      type: "textarea",
      id: "description",
      name: "description",
      placeholder: "Tell us about your event...",
      required: true,
      value: event.description,
    });

    // Image upload field
    const imageGroup = document.createElement("div");
    imageGroup.className = "form-group";

    const imageLabel = document.createElement("label");
    imageLabel.textContent = "Change Event Image (optional)";
    imageLabel.setAttribute("for", "image");

    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.id = "image";
    imageInput.name = "image";
    imageInput.accept = "image/*";
    imageInput.className = "file-input";

    // Mostrar imagen actual si existe
    if (event.imageURL) {
      const currentImage = document.createElement("p");
      currentImage.className = "current-image-info";
      currentImage.innerHTML = `Current image: <a href="${event.imageURL}" target="_blank">View</a>`;
      imageGroup.append(imageLabel, currentImage, imageInput);
    } else {
      imageGroup.append(imageLabel, imageInput);
    }

    // Error message
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    errorMsg.style.display = "none";

    // Submit button
    const submitBtn = Button({
      text: "Update Event",
      type: "submit",
      variant: "primary",
      fullWidth: true,
    });

    // Cancel button
    const cancelBtn = Button({
      text: "Cancel",
      variant: "outline",
      fullWidth: true,
      onClick: () => navigate(`/event/${eventId}`),
    });

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    buttonGroup.append(submitBtn, cancelBtn);

    form.append(
      titleField.group,
      dateField.group,
      timeField.group,
      locationField.group,
      descriptionField.group,
      imageGroup,
      errorMsg,
      buttonGroup,
    );

    card.append(title, form);
    container.append(card);

    // Handle form submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();
      formData.append("title", titleField.input.value.trim());
      formData.append("date", dateField.input.value);
      formData.append("time", timeField.input.value);
      formData.append("location", locationField.input.value.trim());
      formData.append("description", descriptionField.input.value.trim());

      // Añadir imagen si se seleccionó una nueva
      if (imageInput.files[0]) {
        formData.append("image", imageInput.files[0]);
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Updating event...";
      errorMsg.style.display = "none";

      try {
        await updateEvent(eventId, formData);
        navigate(`/event/${eventId}`);
      } catch (error) {
        showError(errorMsg, error.message || "Failed to update event");
        submitBtn.disabled = false;
        submitBtn.textContent = "Update Event";
      }
    });
  } catch (error) {
    container.innerHTML = `<p class="error">Error loading event: ${error.message}</p>`;
  }
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

export default EditEvent;
