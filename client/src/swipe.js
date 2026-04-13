import * as api from './util/api.js';
import {matchScoreWord} from "./util/match-score-conversion.js";

const swipeContainer = document.getElementById("swipeContainer");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const matchPopup = document.getElementById("matchPopup");
const viewMatches = document.getElementById("viewMatches");
const continueSwipe = document.getElementById("continueSwipe");

const userEmail = localStorage.getItem("userEmail");
const user = await api.users.getUser(userEmail);

let matchList = [];
let currentIndex = 0;
let currentUser = {};

async function loadSwipeMatches() {
  try {
    matchList = await api.matches.getPotentialMatchesList(userEmail);

    console.log("Potential Matches:", matchList);

    document.getElementById("yesBtn").disabled = false;
    document.getElementById("noBtn").disabled = false;

    document.getElementById("loading-gif").style.display = "none";
    showNextUser();
  } catch (error) {
    console.error("Swipe load error:", error);
  }
}

async function showNextUser() {
  if (!matchList || matchList.length == 0) {
    showYesNoButtons(false);
    swipeContainer.innerHTML = `
    <div class="no-matches">
      <h2>No Matches Found</h2>
      <p>No potential matches available right now.</p>
    </div>
    `;
    return;
  }

  if (currentIndex > matchList.length) {
    showYesNoButtons(false);
    swipeContainer.innerHTML = `
    <div class="no-matches">
      <h2>No More Matches</h2>
      <p>You’ve viewed all your potential matches.</p>

      <button id="backHome" class="back-home-btn">
        Return to Home
      </button>
    </div>
    `;

    document.getElementById("backHome").addEventListener("click", () => {
      window.location.href = "home.html";
    });

    return;
  }

  const match = matchList[currentIndex];

  if (!match) {
    advanceToNextUser();
    return;
  }

  if (user.dislikesList?.includes(match.u2_email) || user.likesList?.includes(match.u2_email)) {
    advanceToNextUser();
  } 

  const email = match.u2_email;

  console.log("Showing user:", email);

  await loadUser(email, match);
}

async function loadUser(email, match) {
  try {
    console.log("Loading user:", email);

    currentUser = await api.users.getUser(email);

    console.log("Loaded user:", currentUser);
    showYesNoButtons(true);
    swipeContainer.innerHTML = createSwipeCard(currentUser, match);

  } catch (error) {
    console.error("User load error:", error);
  }
}

function createSwipeCard(user, match) {

  const name =
    user?.name ||
    user?.firstName ||
    user?.email?.split("@")[0] ||
    "Unknown";
  const age = user?.age || "N/A";
  const bio = user?.bio || "No bio yet";
  const location = user?.location || "Not specified";
  const photo = user?.photos;

  const skills = Array.isArray(user?.skillsOwned) ? user.skillsOwned.slice(0, 3) : [];

  return `
    <div class="match-card">

      ${photo 
      ? `<img src="${photo}" class="swipe-photo"/>`
      : `<div class="no-photo">No Photo</div>`
      }

        <div>
            <h2>${name}</h2 >
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:2px;">
              <p class="role">${user?.gender || ""}, ${age}</p>
              <p class="role">Compatibility: ${matchScoreWord(match.compatibility_score)}</p>
          </div>
        </div>
    
      <p class="bio"><strong>Bio:</strong> ${bio}</p>
      <p class="location"><strong>Location:</strong> ${location}</p>
      <p class="looking-for"><strong>Looking For:</strong> ${user?.preference || ""}</p>

      <div class="tags">
      <p style="margin-top:5px; padding-bottom:0px;"><strong>Skills:</strong></p>
        ${
          skills.length
            ? skills.map(s => `<span style="margin-top:0px;">${s}</span>`).join("")
            : `<span>No skills</span>`
        }
      </div>

    </div>
  `;
}

// YES BUTTON (LIKE)
yesBtn.addEventListener("click", async () => {
  api.matches.likeUser(userEmail, currentUser.email);
  // If this user that has just been liked has ALSO liked the current user (using the app).
  console.log(currentUser);
  if (currentUser.likesList?.includes(userEmail)) {
    showMatchPopup();
    let matchInfo = {u1_email:userEmail, u2_email:currentUser.email, compatibility_score:matchList[currentIndex].compatibility_score, exposed_communication:false};
    await api.matches.saveNewMatch(matchInfo);
  // If it's not a match yet.
  } else {
    advanceToNextUser();
  }
});

// NO BUTTON (DISLIKE)
noBtn.addEventListener("click", () => {
  api.matches.dislikeUser(userEmail, currentUser.email);
  advanceToNextUser();
});

function showMatchPopup(){
  matchPopup.style.display = "flex";
}

// VIEW MATCHES BUTTON
viewMatches.addEventListener("click", () => {
  window.location.href = "matches.html";
});

// CONTINUE SWIPE BUTTON
continueSwipe.addEventListener("click", () => {
  matchPopup.style.display = "none";
  advanceToNextUser();
});

const advanceToNextUser = () => {
  currentIndex++;
  showNextUser();
}

// Only show heart and X buttons when a valid match card is shown on screen.
const showYesNoButtons = (show) => {
  if (show) {
    document.getElementById("yesBtn").style.display = "block";
    document.getElementById("noBtn").style.display = "block";
  } else {
    document.getElementById("yesBtn").style.display = "none";
    document.getElementById("noBtn").style.display = "none";
  }
}

loadSwipeMatches();
