import "./Button.css";

export const Button = ({
  text,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  fullWidth = false,
}) => {
  const button = document.createElement("button");
  button.type = type;
  button.textContent = text;
  button.className = `btn btn-${variant}`;
  button.disabled = disabled;

  if (fullWidth) {
    button.classList.add("btn-full");
  }

  if (onClick) {
    button.addEventListener("click", onClick);
  }

  return button;
};
