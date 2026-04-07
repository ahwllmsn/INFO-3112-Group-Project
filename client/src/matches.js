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

    const otherEmail =
      match.u1_email === userEmail
        ? match.u2_email
        : match.u1_email;

    const user = await users.getUser(otherEmail);

    return createMatchCard(user, match, otherEmail);
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

function createMatchCard(user, match, otherEmail) {

  const name =
    user?.name ||
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "Developer";

  const age = user?.age || "N/A";
  const location = user?.location || "Unknown";
  const bio = user?.bio || "No bio yet";
  const photo = user?.photos;
  const otherUserEmail = otherEmail;

  // Sharing state
const exposedBy = match.exposedBy || [];


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
      <button class="edit-btn" onclick='openConfirm(${JSON.stringify(match)})'>
        Share Contact Info
      </button>
    `
    
}

<div style="text-align: right; margin-top: 10px;">
  <button class="edit-btn" onclick="openRatingModal('${match.u1_email}', '${match.u2_email}')">
    ⭐ Rate Match
  </button>
</div>
    </div>
  `;
}

//Confirming share
let pendingMatch = null;

window.openConfirm = (match) => {
  pendingMatch = match;
  document.getElementById("confirmModal").style.display = "flex";
};

window.closeConfirmModal = () => {
  document.getElementById("confirmModal").style.display = "none";
  pendingMatch = null;
};

window.confirmShareAction = () => {
  if (pendingMatch) {
    shareContact(pendingMatch);
  }
  closeConfirmModal();
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

//Match Ratings
let selectedRating = 0;
let currentMatch = null;

window.openRatingModal = (u1, u2) => {
  currentMatch = { u1_email: u1, u2_email: u2 };
  selectedRating = 0;

  document.getElementById("ratingModal").style.display = "block";
};

window.closeRatingModal = () => {
  document.getElementById("ratingModal").style.display = "none";
};

window.selectRating = (rating) => {
  selectedRating = rating;

  // Highlight selected stars
  const stars = document.querySelectorAll("#starContainer span");
  stars.forEach((star, index) => {
    star.style.opacity = index < rating ? "1" : "0.3";
  });
};

window.submitRating = async () => {
  try {
    if (!selectedRating) {
      alert("Please select a rating");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");

    await matches.rateMatch(
      currentMatch,
      userEmail,
      selectedRating
    );

    closeRatingModal();

    resetStars();

    loadSuccessfulMatches();

  } catch (error) {
    console.error("Error submitting rating:", error);
  }
};

loadSuccessfulMatches();