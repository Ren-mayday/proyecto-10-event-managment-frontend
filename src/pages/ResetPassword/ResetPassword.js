import { resetPassword } from "../../api/auth";
import { navigate } from "../../router/navigation";
import { Button } from "../../components/Button/Button";
import "./ResetPassword.css";

const ResetPassword = () => {
  const userId = sessionStorage.getItem("resetUserId");
  const userName = sessionStorage.getItem("resetUserName");
  const securityQuestion = sessionStorage.getItem("securityQuestion");

  if (!userId || !securityQuestion) {
    // Si no hay datos, redirigir a forgot-password
    navigate("/forgot-password");
    return document.createElement("div");
  }

  const section = document.createElement("section");
  section.className = "reset-password-container";

  const card = document.createElement("div");
  card.className = "reset-password-card";

  const title = document.createElement("h2");
  title.textContent = "Reset Password";

  const subtitle = document.createElement("p");
  subtitle.className = "reset-password-subtitle";
  subtitle.innerHTML = `Hi <strong>${userName}</strong>, answer your security question to reset your password`;

  const form = document.createElement("form");
  form.className = "reset-password-form";

  // Security Question (readonly)
  const questionGroup = document.createElement("div");
  questionGroup.className = "form-group";

  const questionLabel = document.createElement("label");
  questionLabel.textContent = "Security Question";

  const questionDisplay = document.createElement("div");
  questionDisplay.className = "security-question-display";
  questionDisplay.textContent = securityQuestion;

  questionGroup.append(questionLabel, questionDisplay);

  // Security Answer input
  const answerGroup = document.createElement("div");
  answerGroup.className = "form-group";

  const answerLabel = document.createElement("label");
  answerLabel.textContent = "Your Answer";
  answerLabel.setAttribute("for", "answer");

  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.id = "answer";
  answerInput.name = "answer";
  answerInput.placeholder = "Enter your answer";
  answerInput.required = true;
  answerInput.autocomplete = "off";

  answerGroup.append(answerLabel, answerInput);

  // New Password input
  const passwordGroup = document.createElement("div");
  passwordGroup.className = "form-group";

  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "New Password";
  passwordLabel.setAttribute("for", "password");

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.placeholder = "••••••••";
  passwordInput.required = true;

  passwordGroup.append(passwordLabel, passwordInput);

  // Confirm Password input
  const confirmGroup = document.createElement("div");
  confirmGroup.className = "form-group";

  const confirmLabel = document.createElement("label");
  confirmLabel.textContent = "Confirm New Password";
  confirmLabel.setAttribute("for", "confirm-password");

  const confirmInput = document.createElement("input");
  confirmInput.type = "password";
  confirmInput.id = "confirm-password";
  confirmInput.name = "confirm-password";
  confirmInput.placeholder = "••••••••";
  confirmInput.required = true;

  confirmGroup.append(confirmLabel, confirmInput);

  // Error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "error-message";
  errorMsg.style.display = "none";

  // Success message
  const successMsg = document.createElement("p");
  successMsg.className = "success-message";
  successMsg.style.display = "none";

  // Submit button
  const submitBtn = Button({
    text: "Reset Password",
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
    // Limpiar sessionStorage
    sessionStorage.removeItem("resetUserId");
    sessionStorage.removeItem("resetUserName");
    sessionStorage.removeItem("securityQuestion");
    navigate("/login");
  });

  form.append(questionGroup, answerGroup, passwordGroup, confirmGroup, errorMsg, successMsg, submitBtn);
  card.append(title, subtitle, form, loginLink);
  section.append(card);

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const answer = answerInput.value.trim();
    const newPassword = passwordInput.value;
    const confirmPassword = confirmInput.value;

    // Validaciones
    if (!answer || !newPassword || !confirmPassword) {
      showError(errorMsg, "Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      showError(errorMsg, "Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      showError(errorMsg, "Passwords do not match");
      return;
    }

    // Deshabilitar botón mientras resetea
    submitBtn.disabled = true;
    submitBtn.textContent = "Resetting password...";
    errorMsg.style.display = "none";
    successMsg.style.display = "none";

    try {
      await resetPassword(userId, answer, newPassword);

      // Mostrar mensaje de éxito
      showSuccess(successMsg, "Password reset successful! Redirecting...");

      // Limpiar sessionStorage
      sessionStorage.removeItem("resetUserId");
      sessionStorage.removeItem("resetUserName");
      sessionStorage.removeItem("securityQuestion");

      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      showError(errorMsg, error.message || "Incorrect security answer or server error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Reset Password";
    }
  });

  return section;
};

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

function showSuccess(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

export default ResetPassword;
