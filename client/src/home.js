import { users, matches } from "./util/api.js";
import {matchScoreWord} from "./util/match-score-conversion.js";

// Sidebar elements
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const logoutBtn = document.getElementById("logoutBtn");

// User info elements
const userEmailText = document.getElementById("userEmail");
const userNameText = document.getElementById("userName");
const accountType = document.getElementById("accountType");

// Matches container
const matchesGrid = document.getElementById("matchesGrid");

// Get logged in user
const userEmail = localStorage.getItem("userEmail");
let currentUser = {};

// Redirect if not logged in
if (!userEmail) {
  window.location.href = "index.html";
}

// Logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("userEmail");
  localStorage.removeItem("userName");
  window.location.href = "index.html";
});

/* =========================
   LOAD CURRENT USER
========================= */
async function loadCurrentUser() {
  try {
    currentUser = await users.getUser(userEmail);

    userEmailText.textContent = currentUser?.email || userEmail;

    const displayName =
      currentUser?.name ||
      currentUser?.firstName ||
      localStorage.getItem("userName") ||
      userEmail.split("@")[0];


    // Display account type.
    if (!currentUser.accountType) {
      accountType.textContent = "Free";
    } else {
      accountType.textContent = currentUser.accountType;
    }
    
    if (currentUser.accountType == "Paid") {
      unlockPaidFeatures();
    }

    userNameText.textContent = displayName;
  } catch (error) {
    console.error("User load error:", error);
    userEmailText.textContent = userEmail;
    userNameText.textContent = userEmail.split("@")[0];
  }
}

const unlockPaidFeatures = () => {
  document.getElementById("findMatchesBtn").disabled= false;
  document.getElementById("viewMatchesBtn").disabled= false;
  document.getElementById("view-matches-nav-link").hidden = false;
  document.getElementById("find-matches-nav-link").hidden = false;
}

/* =========================
   LOAD MATCHES
========================= */
async function loadMatches() {
  matchesGrid.innerHTML = `<p class="loading-text">Loading potential new connections...</p>`;

  try {
    const matchList = await matches.getPotentialMatchesList(userEmail);

    if (!Array.isArray(matchList) || matchList.length === 0) {
      document.getElementById("loading-gif-alt").style.display = "none";
      matchesGrid.style = "display:flex; justify-content:space-between; align-items:center;"
      matchesGrid.innerHTML = `<p class="loading-text">No users found.<br>
        Select <strong style="line-height: 1.8;">
          <a id="matches-hyperlink" href="matches.html">View My Matches</a>
      </strong> to view your successful matches.</p>`;
      return;
    }

    // Get full user data for each match
    const matchCards = await Promise.all(
      matchList.map(async (match) => {
        try {
          const matchedUser = await users.getUser(match.u2_email);
          return createMatchCard(matchedUser, match.compatibility_score);
        } catch (err) {
          console.error("Match load error:", err);
          return "";
        }
      })
    );

    document.getElementById("loading-gif-alt").style.display = "none";

    matchesGrid.innerHTML = matchCards.join("");
  } catch (error) {
    document.getElementById("loading-gif-alt").style.display = "none";
    console.error("Matches error:", error);
    matchesGrid.innerHTML = `<p class="loading-text">Error loading matches.</p>`;
  }
}

function createMatchCard(user, score) {
  const name = user?.name || user?.firstName || "Unknown";
  const age = user?.age || "N/A";
  const location = user?.location || "Not specified";
  const bio = user?.bio || "No bio yet";

  const skills = Array.isArray(user?.skillsOwned) ? user.skillsOwned.slice(0, 3) : [];

  // Photo from DB (base64 string)
  const photo = user?.photos;

  return `
    <div class="match-card">

      <div class="match-top">
        ${
          photo
            ? `<img src="${photo}" class="match-photo" />`
            : `<div class="no-photo">No Photo</div>`
        }

        <div>
          <h3>${name}</h3 >
          <p class="role">Compatibility: ${matchScoreWord(score)}</p>
          <p>${user?.gender || ""}, ${age}</p>
        </div>
      </div>

      <p class="bio"><strong>Bio:</strong> ${bio}</p>
      <p class="location"><strong>Location:</strong> ${location}</p>
      <p class="looking-for"><strong>Looking For:</strong> ${user?.preference || ""}</p>

      <div class="tags">
        ${
          skills.length
            ? skills.map(s => `<span>${s}</span>`).join("")
            : `<span>No skills</span>`
        }
      </div>

    </div>
  `;
}

/* =========================
   FIND MATCHES BUTTON
========================= */

const findMatchesBtn = document.getElementById("findMatchesBtn");

if (findMatchesBtn) {
  findMatchesBtn.addEventListener("click", () => {
    window.location.href = "swipe.html";
  });
}
// Load data
loadCurrentUser();
loadMatches();