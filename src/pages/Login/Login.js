import { login } from "../../api/auth";
import { navigate } from "../../router/navigation";
import { Button } from "../../components/Button/Button";
import "./Login.css";

const Login = () => {
  const section = document.createElement("section");
  section.className = "login-container";

  const card = document.createElement("div");
  card.className = "login-card";

  const title = document.createElement("h2");
  title.textContent = "Welcome Back";

  const subtitle = document.createElement("p");
  subtitle.className = "login-subtitle";
  subtitle.textContent = "Login to manage your events";

  const form = document.createElement("form");
  form.className = "login-form";

  // Email input
  const emailGroup = document.createElement("div");
  emailGroup.className = "form-group";

  const emailLabel = document.createElement("label");
  emailLabel.textContent = "Email";
  emailLabel.setAttribute("for", "email");

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.id = "email";
  emailInput.name = "email";
  emailInput.placeholder = "your@email.com";
  emailInput.required = true;

  emailGroup.append(emailLabel, emailInput);

  // Password input
  const passwordGroup = document.createElement("div");
  passwordGroup.className = "form-group";

  const passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Password";
  passwordLabel.setAttribute("for", "password");

  const passwordInput = document.createElement("input");
  passwordInput.type = "password";
  passwordInput.id = "password";
  passwordInput.name = "password";
  passwordInput.placeholder = "••••••••";
  passwordInput.required = true;

  passwordGroup.append(passwordLabel, passwordInput);

  const forgotPasswordLink = document.createElement("p");
  forgotPasswordLink.className = "forgot-password-link";
  forgotPasswordLink.innerHTML = `<a href="/forgot-password">Forgot password?</a>`;

  forgotPasswordLink.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  });

  // Error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "error-message";
  errorMsg.style.display = "none";

  // Submit button usando componente Button
  const submitBtn = Button({
    text: "Login",
    type: "submit",
    variant: "primary",
    fullWidth: true,
  });

  // Link to register
  const registerLink = document.createElement("p");
  registerLink.className = "register-link";
  registerLink.innerHTML = `Don't have an account? <a href="/register">Register here</a>`;

  registerLink.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/register");
  });

  form.append(emailGroup, passwordGroup, forgotPasswordLink, errorMsg, submitBtn);
  card.append(title, subtitle, form, registerLink);
  section.append(card);

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError(errorMsg, "Please fill in all fields");
      return;
    }

    // Deshabilitar botón mientras hace login
    submitBtn.disabled = true;
    submitBtn.textContent = "Logging in...";
    errorMsg.style.display = "none";

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      showError(errorMsg, error.message || "Invalid email or password");
      submitBtn.disabled = false;
      submitBtn.textContent = "Login";
    }
  });

  return section;
};

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

export default Login;
