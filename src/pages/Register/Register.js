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

  // Security Question
  const questionGroup = document.createElement("div");
  questionGroup.className = "form-group";

  const questionLabel = document.createElement("label");
  questionLabel.textContent = "Security Question";
  questionLabel.setAttribute("for", "security-question");

  const questionSelect = document.createElement("select");
  questionSelect.id = "security-question";
  questionSelect.name = "security-question";
  questionSelect.required = true;

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a security question";
  defaultOption.disabled = true;
  defaultOption.selected = true;

  const questions = [
    "What was the name of your first pet?",
    "What city were you born in?",
    "What is your mother's maiden name?",
    "What was the name of your elementary school?",
    "What is your favorite book?",
    "What was your childhood nickname?",
  ];

  questionSelect.append(defaultOption);
  questions.forEach((q) => {
    const option = document.createElement("option");
    option.value = q;
    option.textContent = q;
    questionSelect.append(option);
  });

  questionGroup.append(questionLabel, questionSelect);

  // Security Answer
  const answerGroup = document.createElement("div");
  answerGroup.className = "form-group";

  const answerLabel = document.createElement("label");
  answerLabel.textContent = "Security Answer";
  answerLabel.setAttribute("for", "security-answer");

  const answerInput = document.createElement("input");
  answerInput.type = "text";
  answerInput.id = "security-answer";
  answerInput.name = "security-answer";
  answerInput.placeholder = "Your answer (remember this!)";
  answerInput.required = true;

  const answerHint = document.createElement("small");
  answerHint.className = "form-hint";
  answerHint.textContent = "This will be used to recover your password if you forget it";

  answerGroup.append(answerLabel, answerInput, answerHint);

  // Error message
  const errorMsg = document.createElement("p");
  errorMsg.className = "error-message";
  errorMsg.style.display = "none";

  // Submit button usando componente Button
  const submitBtn = Button({
    text: "Register",
    type: "submit",
    variant: "secondary",
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

  // Añadir los nuevos campos al form
  form.append(usernameGroup, emailGroup, passwordGroup, questionGroup, answerGroup, errorMsg, submitBtn);
  card.append(title, subtitle, form, loginLink);
  section.append(card);

  // Handle form submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userName = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const securityQuestion = questionSelect.value;
    const securityAnswer = answerInput.value.trim();

    // Validación básica
    if (!userName || !email || !password || !securityQuestion || !securityAnswer) {
      showError(errorMsg, "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      showError(errorMsg, "Password must be at least 6 characters");
      return;
    }

    if (securityAnswer.length < 2) {
      showError(errorMsg, "Security answer must be at least 2 characters");
      return;
    }

    // Deshabilitar botón mientras registra
    submitBtn.disabled = true;
    submitBtn.textContent = "Creating account...";
    errorMsg.style.display = "none";

    try {
      await register(userName, email, password, securityQuestion, securityAnswer);
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
