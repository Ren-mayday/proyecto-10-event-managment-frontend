import { register } from "../../api/auth";
import { navigate } from "../../router/navigation";
import { Button } from "../../components/Button/Button";
import "./Register.css";

const Register = () => {
  const section = document.createElement("section");
  section.className = "register-container";

  const card = document.createElement("div");
  card.className = "register-card";

  const title = document.createElement("h2");
  title.textContent = "Join Us";

  const subtitle = document.createElement("p");
  subtitle.className = "register-subtitle";
  subtitle.textContent = "Create your account to start managing events";

  const form = document.createElement("form");
  form.className = "register-form";

  // Username input
  const usernameGroup = document.createElement("div");
  usernameGroup.className = "form-group";

  const usernameLabel = document.createElement("label");
  usernameLabel.textContent = "Username";
  usernameLabel.setAttribute("for", "username");

  const usernameInput = document.createElement("input");
  usernameInput.type = "text";
  usernameInput.id = "username";
  usernameInput.name = "username";
  usernameInput.placeholder = "Your username";
  usernameInput.required = true;

  usernameGroup.append(usernameLabel, usernameInput);

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

  // Error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "error-message";
  errorMsg.style.display = "none";

  // Submit button usando componente Button
  const submitBtn = Button({
    text: "Register",
    type: "submit",
    variant: "secondary", // Rosa para Register
    fullWidth: true,
  });

  // Link to login
  const loginLink = document.createElement("p");
  loginLink.className = "login-link";
  loginLink.innerHTML = `Already have an account? <a href="/login">Login here</a>`;

  loginLink.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    navigate("/login");
  });

  form.append(usernameGroup, emailGroup, passwordGroup, errorMsg, submitBtn);
  card.append(title, subtitle, form, loginLink);
  section.append(card);

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validación básica
    if (!userName || !email || !password) {
      showError(errorMsg, "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      showError(errorMsg, "Password must be at least 6 characters");
      return;
    }

    // Deshabilitar botón mientras registra
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";
    errorMsg.style.display = "none";

    try {
      await register(userName, email, password);
      navigate("/");
    } catch (error) {
      showError(errorMsg, error.message || "Registration failed. Email might already exist.");
      submitBtn.disabled = false;
      submitBtn.textContent = "Register";
    }
  });

  return section;
};

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

export default Register;
