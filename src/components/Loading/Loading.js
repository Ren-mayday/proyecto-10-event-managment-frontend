import "./Loading.css";

export const Loading = (text = "Loading...") => {
  const loadingDiv = document.createElement("div");
  loadingDiv.className = "loading-container";

  const spinner = document.createElement("div");
  spinner.className = "spinner";

  const loadingText = document.createElement("p");
  loadingText.className = "loading-text";
  loadingText.textContent = text;

  loadingDiv.append(spinner, loadingText);

  return loadingDiv;
};
