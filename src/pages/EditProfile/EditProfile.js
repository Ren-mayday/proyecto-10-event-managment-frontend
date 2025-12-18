import { getCurrentUser, isAuthenticated } from "../../api/auth";
import { getUserProfile, updateUserProfile } from "../../api/users";
import { navigate } from "../../router/navigation";
import { Button } from "../../components/Button/Button";
import { FormField } from "../../components/FormField/FormField";
import { Loading } from "../../components/Loading/Loading";
import "./EditProfile.css";

const EditProfile = () => {
  if (!isAuthenticated()) {
    navigate("/login");
    return document.createElement("div");
  }

  const section = document.createElement("section");
  section.className = "edit-profile-container";

  section.append(Loading("Loading profile..."));

  const currentUser = getCurrentUser();
  loadProfileAndCreateForm(section, currentUser);

  return section;
};

async function loadProfileAndCreateForm(container, currentUser) {
  try {
    const user = await getUserProfile(currentUser.userName);
    container.innerHTML = "";

    const card = document.createElement("div");
    card.className = "edit-profile-card";

    const title = document.createElement("h2");
    title.textContent = "Edit Profile";

    const form = document.createElement("form");
    form.className = "edit-profile-form";

    // Avatar preview
    const avatarPreview = document.createElement("div");
    avatarPreview.className = "avatar-preview";
    if (user.avatarURL) {
      avatarPreview.style.backgroundImage = `url(${user.avatarURL})`;
    } else {
      avatarPreview.textContent = user.userName.charAt(0).toUpperCase();
    }

    // Avatar upload
    const avatarGroup = document.createElement("div");
    avatarGroup.className = "form-group";

    const avatarLabel = document.createElement("label");
    avatarLabel.textContent = "Profile Picture";

    const avatarInput = document.createElement("input");
    avatarInput.type = "file";
    avatarInput.accept = "image/*";
    avatarInput.className = "file-input";

    // Preview nueva imagen
    avatarInput.addEventListener("change", (e) => {
      if (e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
          avatarPreview.style.backgroundImage = `url(${event.target.result})`;
          avatarPreview.textContent = "";
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    });

    avatarGroup.append(avatarLabel, avatarPreview, avatarInput);

    // Username field
    const usernameField = FormField({
      label: "Username",
      type: "text",
      id: "newUserName",
      name: "newUserName",
      placeholder: "Your username",
      value: user.userName || "",
    });

    // Bio
    const bioField = FormField({
      label: "Bio",
      type: "textarea",
      id: "bio",
      name: "bio",
      placeholder: "Tell us about yourself...",
      value: user.bio || "",
    });

    // Birthday
    const birthdayValue = user.birthday ? new Date(user.birthday).toISOString().split("T")[0] : "";
    const birthdayField = FormField({
      label: "Birthday",
      type: "date",
      id: "birthday",
      name: "birthday",
      value: birthdayValue,
    });

    // Favorite Food
    const foodField = FormField({
      label: "Favorite Food",
      type: "text",
      id: "favoriteFood",
      name: "favoriteFood",
      placeholder: "e.g., Pizza, Sushi",
      value: user.favoriteFood || "",
    });

    // Hidden Talents
    const talentsField = FormField({
      label: "Hidden Talents",
      type: "text",
      id: "hiddenTalents",
      name: "hiddenTalents",
      placeholder: "e.g., I can juggle!",
      value: user.hiddenTalents || "",
    });

    // Hobbies (comma separated)
    const hobbiesField = FormField({
      label: "Hobbies (separated by commas)",
      type: "text",
      id: "hobbies",
      name: "hobbies",
      placeholder: "e.g., Reading, Gaming, Dancing",
      value: user.hobbies ? user.hobbies.join(", ") : "",
    });

    // Interests (comma separated)
    const interestsField = FormField({
      label: "Interests (separated by commas)",
      type: "text",
      id: "interests",
      name: "interests",
      placeholder: "e.g., Art, Music, Technology",
      value: user.interests ? user.interests.join(", ") : "",
    });

    // Social Media
    const socialTitle = document.createElement("h3");
    socialTitle.textContent = "Social Media";
    socialTitle.className = "section-title";

    const instagramField = FormField({
      label: "Instagram username",
      type: "text",
      id: "instagram",
      name: "instagram",
      placeholder: "yourhandle",
      value: user.socialMedia?.instagram || "",
    });

    const twitterField = FormField({
      label: "Twitter username",
      type: "text",
      id: "twitter",
      name: "twitter",
      placeholder: "yourhandle",
      value: user.socialMedia?.twitter || "",
    });

    const tiktokField = FormField({
      label: "TikTok username",
      type: "text",
      id: "tiktok",
      name: "tiktok",
      placeholder: "yourhandle",
      value: user.socialMedia?.tiktok || "",
    });

    // Current Password (requerido para actualizar)
    const passwordField = FormField({
      label: "Current Password (required to save changes)",
      type: "password",
      id: "currentPassword",
      name: "currentPassword",
      placeholder: "Enter your password",
      required: true,
    });

    // Error message
    const errorMsg = document.createElement("p");
    errorMsg.className = "error-message";
    errorMsg.style.display = "none";

    // Success message
    const successMsg = document.createElement("p");
    successMsg.className = "success-message";
    successMsg.style.display = "none";

    // Buttons
    const submitBtn = Button({
      text: "Save Changes",
      type: "submit",
      variant: "primary",
      fullWidth: true,
    });

    const cancelBtn = Button({
      text: "Cancel",
      variant: "outline",
      fullWidth: true,
      onClick: () => navigate("/my-profile"),
    });

    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";
    buttonGroup.append(submitBtn, cancelBtn);

    form.append(
      avatarGroup,
      usernameField.group,
      bioField.group,
      birthdayField.group,
      foodField.group,
      talentsField.group,
      hobbiesField.group,
      interestsField.group,
      socialTitle,
      instagramField.group,
      twitterField.group,
      tiktokField.group,
      passwordField.group,
      errorMsg,
      successMsg,
      buttonGroup
    );

    card.append(title, form);
    container.append(card);

    // Handle submit
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData();

      // Añadir avatar si se seleccionó
      if (avatarInput.files[0]) {
        formData.append("avatar", avatarInput.files[0]);
      }

      // Username (solo si se ha cambiado)
      if (usernameField.input.value.trim() && usernameField.input.value.trim() !== user.userName) {
        formData.append("newUserName", usernameField.input.value.trim());
      }

      // Otros campos
      if (bioField.input.value.trim()) {
        formData.append("bio", bioField.input.value.trim());
      }

      if (birthdayField.input.value) {
        formData.append("birthday", birthdayField.input.value);
      }

      if (foodField.input.value.trim()) {
        formData.append("favoriteFood", foodField.input.value.trim());
      }

      if (talentsField.input.value.trim()) {
        formData.append("hiddenTalents", talentsField.input.value.trim());
      }

      // Hobbies (convertir string a array)
      if (hobbiesField.input.value.trim()) {
        const hobbiesArray = hobbiesField.input.value
          .split(",")
          .map((h) => h.trim())
          .filter((h) => h);
        formData.append("hobbies", JSON.stringify(hobbiesArray));
      }

      // Interests (convertir string a array)
      if (interestsField.input.value.trim()) {
        const interestsArray = interestsField.input.value
          .split(",")
          .map((i) => i.trim())
          .filter((i) => i);
        formData.append("interests", JSON.stringify(interestsArray));
      }

      // Social media
      const socialMedia = {};
      if (instagramField.input.value.trim()) {
        socialMedia.instagram = instagramField.input.value.trim();
      }
      if (twitterField.input.value.trim()) {
        socialMedia.twitter = twitterField.input.value.trim();
      }
      if (tiktokField.input.value.trim()) {
        socialMedia.tiktok = tiktokField.input.value.trim();
      }

      if (Object.keys(socialMedia).length > 0) {
        formData.append("socialMedia", JSON.stringify(socialMedia));
      }

      // Current password (requerido)
      formData.append("currentPassword", passwordField.input.value);

      submitBtn.disabled = true;
      submitBtn.textContent = "Saving...";
      errorMsg.style.display = "none";
      successMsg.style.display = "none";

      try {
        const response = await updateUserProfile(user._id, formData);

        // Actualizar user en localStorage
        localStorage.setItem("user", JSON.stringify(response.user));

        successMsg.textContent = "Profile updated successfully!";
        successMsg.style.display = "block";

        setTimeout(() => {
          navigate("/my-profile");
        }, 1500);
      } catch (error) {
        showError(errorMsg, error.message || "Failed to update profile");
        submitBtn.disabled = false;
        submitBtn.textContent = "Save Changes";
      }
    });
  } catch (error) {
    container.innerHTML = `<p class="error">Error loading profile: ${error.message}</p>`;
  }
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = "block";
}

export default EditProfile;
