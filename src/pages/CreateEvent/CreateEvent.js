import { createEvent } from "../../api/events";
import { navigate } from "../../router/navigation";
import { isAuthenticated } from "../../api/auth";
import { FormField } from "../../components/FormField/FormField";
import { Button } from "../../components/Button/Button";
import "./CreateEvent.css";

const CreateEvent = () => {
  // Verificar si está autenticado
  if (!isAuthenticated()) {
    navigate("/login");
    return document.createElement("div");
  }

  const section = document.createElement("section");
  section.className = "create-event-container";

  const card = document.createElement("div");
  card.className = "create-event-card";

  const title = document.createElement("h2");
  title.textContent = "Create New Event";

  const form = document.createElement("form");
  form.className = "create-event-form";

  // Title field
  const titleField = FormField({
    label: "Event Title",
    type: "text",
    id: "title",
    name: "title",
    placeholder: "e.g., Pride June 2026",
    required: true,
  });

  // Date field
  const dateField = FormField({
    label: "Date",
    type: "date",
    id: "date",
    name: "date",
    required: true,
  });

  // Time field
  const timeField = FormField({
    label: "Time",
    type: "time",
    id: "time",
    name: "time",
    required: true,
  });

  // Location field
  const locationField = FormField({
    label: "Location",
    type: "text",
    id: "location",
    name: "location",
    placeholder: "e.g., Plaça Catalunya, Barcelona",
    required: true,
  });

  // Description field
  const descriptionField = FormField({
    label: "Description",
    type: "textarea",
    id: "description",
    name: "description",
    placeholder: "Tell us about your event...",
    required: true,
  });

  // Image upload field
  const imageGroup = document.createElement("div");
  imageGroup.className = "form-group";

  const imageLabel = document.createElement("label");
  imageLabel.textContent = "Event Image (optional)";
  imageLabel.setAttribute("for", "image");

  const imageInput = document.createElement("input");
  imageInput.type = "file";
  imageInput.id = "image";
  imageInput.name = "image";
  imageInput.accept = "image/*";
  imageInput.className = "file-input";

  imageGroup.append(imageLabel, imageInput);

  // Error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "error-message";
  errorMsg.style.display = "none";

  // Submit button
  const submitBtn = Button({
    text: "Create Event",
    type: "submit",
    variant: "primary",
    fullWidth: true,
  });

  // Cancel button
  const cancelBtn = Button({
    text: "Cancel",
    variant: "outline",
    fullWidth: true,
    onClick: () => navigate("/"),
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
  section.append(card);

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", titleField.input.value.trim());
    formData.append("date", dateField.input.value);
    formData.append("time", timeField.input.value);
    formData.append("location", locationField.input.value.trim());
    formData.append("description", descriptionField.input.value.trim());

    // Añadir imagen si existe
    if (imageInput.files[0]) {
      formData.append("image", imageInput.files[0]);
    }

    // Deshabilitar botón
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating event...";
    errorMsg.style.display = "none";

    try {
      await createEvent(formData);
      navigate("/");
    } catch (error) {
      showError(errorMsg, error.message || "Failed to create event");
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Event";
    }
  });

  return section;
};

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

export default CreateEvent;
