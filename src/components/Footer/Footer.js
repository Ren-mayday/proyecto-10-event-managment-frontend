import "./Footer.css";

export const Footer = () => {
  const footer = document.getElementById("footer");

  if (!footer) {
    console.error("Footer element not found!");
    return;
  }

  footer.innerHTML = "";

  const footerContent = document.createElement("div");
  footerContent.className = "footer-content";

  const text = document.createElement("p");
  text.innerHTML = `
    Made with 🩵 by <strong>Rencel</strong> | 
    Event Management for the Queer Tea Club | 
    © ${new Date().getFullYear()}
  `;

  footerContent.append(text);
  footer.append(footerContent);
};
