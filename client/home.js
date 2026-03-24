import { users, matches } from "./src/util/api.js";

const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn");

const userEmailText = document.getElementById("userEmail");
const userNameText = document.getElementById("userName");
const matchesGrid = document.getElementById("matchesGrid");

const statusText = document.getElementById("userStatus");


const userEmail = localStorage.getItem("userEmail");

if (userEmail) {
  statusText.textContent = "● Active";
  statusText.style.color = "limegreen";
} else {
  statusText.textContent = "● Offline";
  statusText.style.color = "gray";
}

if (!userEmail) {
  window.location.href = "index.html";
}

function openSidebar() {
  sidebar.classList.add("open");
  overlay.classList.add("show");
}

function closeSidebar() {
  sidebar.classList.remove("open");
  overlay.classList.remove("show");
}

menuBtn.addEventListener("click", openSidebar);
closeBtn.addEventListener("click", closeSidebar);
overlay.addEventListener("click", closeSidebar);

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "index.html";
});

async function loadCurrentUser() {
  try {
    const currentUser = await users.getUser(userEmail);

    userEmailText.textContent = currentUser?.email || userEmail;

    const displayName =
      currentUser?.name ||
      currentUser?.firstName ||
      localStorage.getItem("userName") ||
      userEmail.split("@")[0];

    userNameText.textContent = displayName;
  } catch (error) {
    console.error("Could not load current user:", error);
    userEmailText.textContent = userEmail;
    userNameText.textContent = userEmail.split("@")[0];
  }
}

async function loadMatches() {
  matchesGrid.innerHTML = `<p class="loading-text">Loading matches...</p>`;

  try {
    const matchList = await matches.getPotentialMatchesList(userEmail);

    if (!Array.isArray(matchList) || matchList.length === 0) {
      matchesGrid.innerHTML = `<p class="loading-text">No matches found yet.</p>`;
      return;
    }

    const matchCards = await Promise.all(
      matchList.map(async (match) => {
        try {
          const matchedUser = await users.getUser(match.u2_email);
          return createMatchCard(matchedUser, match.compatibility_score);
        } catch (error) {
          console.error("Could not load matched user:", match.u2_email, error);
          return "";
        }
      })
    );

    const validCards = matchCards.filter(card => card.trim() !== "");

    if (validCards.length === 0) {
      matchesGrid.innerHTML = `<p class="loading-text">No matches available right now.</p>`;
      return;
    }

    matchesGrid.innerHTML = validCards.join("");
  } catch (error) {
    console.error("Could not load matches:", error);
    matchesGrid.innerHTML = `<p class="loading-text">Could not load matches.</p>`;
  }
}

function createMatchCard(user, score) {
  const displayName = user?.name || user?.firstName || "Unknown User";
  const bio = user?.bio || "No bio added yet.";
  const location = user?.location || "Location not added";
  const age = user?.age ? `${user.age}` : "N/A";
  const preference = user?.preference || "Not specified";
  const skillsOwned = Array.isArray(user?.skillsOwned) ? user.skillsOwned : [];
  const topSkills = skillsOwned.slice(0, 3);

  return `
    <div class="match-card">
      <h4>${escapeHtml(displayName)}</h4>
      <p class="role">Match Score: ${escapeHtml(String(score))}</p>
      <p class="bio">${escapeHtml(bio)}</p>
      <p class="match-extra"><strong>Age:</strong> ${escapeHtml(age)}</p>
      <p class="match-extra"><strong>Location:</strong> ${escapeHtml(location)}</p>
      <p class="match-extra"><strong>Looking For:</strong> ${escapeHtml(preference)}</p>
      <div class="tags">
        ${
          topSkills.length
            ? topSkills.map(skill => `<span>${escapeHtml(skill)}</span>`).join("")
            : `<span>No skills listed</span>`
        }
      </div>
    </div>
  `;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

loadCurrentUser();
loadMatches();