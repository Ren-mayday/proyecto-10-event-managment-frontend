import { getCurrentUser, isAuthenticated } from "../../api/auth";
import { getUserProfile } from "../../api/users";
import { navigate } from "../../router/navigation";
import { Button } from "../../components/Button/Button";
import { Loading } from "../../components/Loading/Loading";
import "./MyProfile.css";

const MyProfile = () => {
  if (!isAuthenticated()) {
    navigate("/login");
    return document.createElement("div");
  }

  const section = document.createElement("section");
  section.className = "profile-container";

  section.append(Loading("Loading profile..."));

  const currentUser = getCurrentUser();
  loadProfile(section, currentUser.userName, true);

  return section;
};

async function loadProfile(container, userName, isOwner = false) {
  try {
    const user = await getUserProfile(userName);
    container.innerHTML = "";

    const card = document.createElement("div");
    card.className = "profile-card";

    // Avatar
    const avatarSection = document.createElement("div");
    avatarSection.className = "profile-avatar-section";

    const avatar = document.createElement("div");
    avatar.className = "profile-avatar";
    if (user.avatarURL) {
      avatar.style.backgroundImage = `url(${user.avatarURL})`;
    } else {
      avatar.textContent = user.userName.charAt(0).toUpperCase();
    }

    avatarSection.append(avatar);

    // Info
    const infoSection = document.createElement("div");
    infoSection.className = "profile-info";

    const name = document.createElement("h1");
    name.textContent = user.userName;

    const email = document.createElement("p");
    email.className = "profile-email";
    email.textContent = user.email;

    // Badge de admin
    if (user.role === "admin") {
      const adminBadge = document.createElement("span");
      adminBadge.className = "admin-badge-profile";
      adminBadge.textContent = "Admin";
      name.append(" ", adminBadge);
    }

    infoSection.append(name, email);

    // Bio
    if (user.bio) {
      const bio = document.createElement("p");
      bio.className = "profile-bio";
      bio.textContent = user.bio;
      infoSection.append(bio);
    }

    // Details grid
    const detailsGrid = document.createElement("div");
    detailsGrid.className = "profile-details-grid";

    // Birthday
    if (user.birthday) {
      const birthdayItem = createDetailItem("🎂 Birthday", new Date(user.birthday).toLocaleDateString());
      detailsGrid.append(birthdayItem);
    }

    // Favorite Food
    if (user.favoriteFood) {
      const foodItem = createDetailItem("🍕 Favorite Food", user.favoriteFood);
      detailsGrid.append(foodItem);
    }

    // Hidden Talents
    if (user.hiddenTalents) {
      const talentsItem = createDetailItem("✨ Hidden Talents", user.hiddenTalents);
      detailsGrid.append(talentsItem);
    }

    // Hobbies
    if (user.hobbies && user.hobbies.length > 0) {
      const hobbiesItem = createDetailItem("🎨 Hobbies", user.hobbies.join(", "));
      detailsGrid.append(hobbiesItem);
    }

    // Interests
    if (user.interests && user.interests.length > 0) {
      const interestsItem = createDetailItem("🌟 Interests", user.interests.join(", "));
      detailsGrid.append(interestsItem);
    }

    // Social Media
    if (user.socialMedia) {
      const socialSection = document.createElement("div");
      socialSection.className = "social-media-section";

      const socialTitle = document.createElement("h3");
      socialTitle.textContent = "Social Media";

      const socialLinks = document.createElement("div");
      socialLinks.className = "social-links";

      if (user.socialMedia.instagram) {
        const igLink = createSocialLink("Instagram", `https://instagram.com/${user.socialMedia.instagram}`, "📸");
        socialLinks.append(igLink);
      }

      if (user.socialMedia.twitter) {
        const twLink = createSocialLink("Twitter", `https://twitter.com/${user.socialMedia.twitter}`, "🐦");
        socialLinks.append(twLink);
      }

      if (user.socialMedia.tiktok) {
        const ttLink = createSocialLink("TikTok", `https://tiktok.com/@${user.socialMedia.tiktok}`, "🎵");
        socialLinks.append(ttLink);
      }

      if (socialLinks.children.length > 0) {
        socialSection.append(socialTitle, socialLinks);
        detailsGrid.append(socialSection);
      }
    }

    infoSection.append(detailsGrid);

    // Buttons
    const actionsDiv = document.createElement("div");
    actionsDiv.className = "profile-actions";

    if (isOwner) {
      const editBtn = Button({
        text: "Edit Profile",
        variant: "primary",
        onClick: () => navigate(`/edit-profile`),
      });
      actionsDiv.append(editBtn);
    }

    const backBtn = Button({
      text: "← Back",
      variant: "outline",
      onClick: () => navigate("/"),
    });

    actionsDiv.append(backBtn);

    card.append(avatarSection, infoSection, actionsDiv);
    container.append(card);
  } catch (error) {
    container.innerHTML = `<p class="error">Error loading profile: ${error.message}</p>`;
  }
}

function createDetailItem(label, value) {
  const item = document.createElement("div");
  item.className = "detail-item";

  const labelEl = document.createElement("strong");
  labelEl.textContent = label;

  const valueEl = document.createElement("span");
  valueEl.textContent = value;

  item.append(labelEl, " ", valueEl);
  return item;
}

function createSocialLink(platform, url, emoji) {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.className = "social-link";
  link.innerHTML = `${emoji} ${platform}`;
  return link;
}

export default MyProfile;
