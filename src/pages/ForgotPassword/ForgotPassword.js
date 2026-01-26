import { requestPasswordReset } from "../../api/auth";
import { navigate } from "../../router/navigation";
import { Button } from "../../components/Button/Button";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const section = document.createElement("section");
  section.className = "forgot-password-container";

  const card = document.createElement("div");
  card.className = "forgot-password-card";

  const title = document.createElement("h2");
  title.textContent = "Forgot Password?";

  const subtitle = document.createElement("p");
  subtitle.className = "forgot-password-subtitle";
  subtitle.textContent = "Enter your username or email to recover your password";

  const form = document.createElement("form");
  form.className = "forgot-password-form";

  // Identifier input (username or email)
  const identifierGroup = document.createElement("div");
  identifierGroup.className = "form-group";

  const identifierLabel = document.createElement("label");
  identifierLabel.textContent = "Username or Email";
  identifierLabel.setAttribute("for", "identifier");

  const identifierInput = document.createElement("input");
  identifierInput.type = "text";
  identifierInput.id = "identifier";
  identifierInput.name = "identifier";
  identifierInput.placeholder = "Enter your username or email";
  identifierInput.required = true;

  identifierGroup.append(identifierLabel, identifierInput);

  // Error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "error-message";
  errorMsg.style.display = "none";

  // Submit button
  const submitBtn = Button({
    text: "Continue",
    type: "submit",
    variant: "primary",
    fullWidth: true,
  });

  // Link back to login
  const loginLink = document.createElement("p");
  loginLink.className = "login-link";
  loginLink.innerHTML = `Remember your password? <a href="/login">Login here</a>`;

  loginLink.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/login");
  });

  form.append(identifierGroup, errorMsg, submitBtn);
  card.append(title, subtitle, form, loginLink);
  section.append(card);

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const identifier = identifierInput.value.trim();

    if (!identifier) {
      showError(errorMsg, "Please enter your username or email");
      return;
    }

    // Deshabilitar botón mientras busca
    submitBtn.disabled = true;
    submitBtn.textContent = "Searching...";
    errorMsg.style.display = "none";

    try {
      const data = await requestPasswordReset(identifier);

      // Guardar datos en sessionStorage para el siguiente paso
      sessionStorage.setItem("resetUserId", data.userId);
      sessionStorage.setItem("resetUserName", data.userName);
      sessionStorage.setItem("securityQuestion", data.securityQuestion);

      // Navegar a la página de reset
      navigate("/reset-password");
    } catch (error) {
      showError(errorMsg, error.message || "User not found");
      submitBtn.disabled = false;
      submitBtn.textContent = "Continue";
    }
  });

  return section;
};

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

export default ForgotPassword;
