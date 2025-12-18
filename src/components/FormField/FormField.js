import "./FormField.css";

export const FormField = ({ label, type = "text", id, name, placeholder = "", required = false, value = "" }) => {
  const group = document.createElement("div");
  group.className = "form-group";

  // Label
  const labelElement = document.createElement("label");
  labelElement.textContent = label;
  labelElement.setAttribute("for", id);

  // Input o Textarea
  let inputElement;

  if (type === "textarea") {
    inputElement = document.createElement("textarea");
    inputElement.rows = 5;
  } else {
    inputElement = document.createElement("input");
    inputElement.type = type;
  }

  inputElement.id = id;
  inputElement.name = name;
  inputElement.placeholder = placeholder;
  inputElement.required = required;
  inputElement.value = value;

  group.append(labelElement, inputElement);

  return { group, input: inputElement };
};
