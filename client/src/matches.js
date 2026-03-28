import { users, matches } from "./util/api.js";

const matchesContainer = document.getElementById("successfulMatches");

const userEmail = localStorage.getItem("userEmail");

async function loadSuccessfulMatches() {
  try {
    const matchList = await matches.findMyMatches(userEmail);

    if (!matchList || matchList.length === 0) {
      matchesContainer.innerHTML = `
        <h3>No successful matches yet</h3>
      `;
      return;
    }

    const matchCards = await Promise.all(
      matchList.map(async (match) => {
        const user = await users.getUser(match.u2_email);
        return createMatchCard(user, match);
      })
    );

    matchesContainer.innerHTML = matchCards.join("");

  } catch (error) {
    console.error(error);

    matchesContainer.innerHTML = `
      <h3>Error loading matches</h3>
    `;
  }
}

function createMatchCard(user, match) {

  const name =
    user?.name ||
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "Developer";

  const age = user?.age || "N/A";
  const location = user?.location || "Unknown";
  const bio = user?.bio || "No bio yet";
  const photo = user?.photos;
  const email = user?.email || "";

  // Sharing state
const exposedBy = match.exposedBy || [];

const otherUserEmail = user?.email || "";

const currentUserShared = exposedBy.includes(userEmail);
const otherUserShared = exposedBy.includes(otherUserEmail);

const bothShared =
  exposedBy.includes(userEmail) &&
  exposedBy.includes(otherUserEmail);

  return `
    <div class="match-card">

      ${
        photo
          ? `<img src="${photo}" class="match-photo"/>`
          : `<div class="no-photo">No Photo</div>`
      }

      <h2>${name}</h2>

      <p class="age">Age: ${age}</p>

      <p class="location">📍 ${location}</p>

      <p class="bio">${bio}</p>

      ${
  bothShared
    ? `
      <p class="email">${otherUserEmail}</p>
      <button onclick="copyToClipboard('${otherUserEmail}')">
        Copy Email
      </button>
    `
    : currentUserShared
    ? `
      <p class="bio">⏳ Waiting for other user to confirm...</p>
    `
    : `
      <button onclick='openConfirm(${JSON.stringify(match)})'>
        Share Contact Info
      </button>
    `
}

    </div>
  `;
}

//Confirimg share
window.openConfirm = (match) => {
  const confirmShare = confirm("Do you want to share your email with this match?");
  if (confirmShare) {
    shareContact(match);
  }
};

window.shareContact = async (match) => {
  try {
    const email = localStorage.getItem("userEmail");

    await matches.shareContact(
      {
        u1_email: match.u1_email,
        u2_email: match.u2_email
      },
      email
    );

    loadSuccessfulMatches();

  } catch (error) {
    console.error("Error sharing contact:", error);
    loadSuccessfulMatches();
  }
};

//Copy to clipboard button
window.copyToClipboard = (email) => {
  navigator.clipboard.writeText(email);
  alert("Email copied!");
};

loadSuccessfulMatches();