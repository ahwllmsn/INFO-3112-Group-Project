import { users, matches } from "./src/util/api.js";

const swipeContainer = document.getElementById("swipeContainer");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const matchPopup = document.getElementById("matchPopup");
const viewMatches = document.getElementById("viewMatches");
const continueSwipe = document.getElementById("continueSwipe");

const userEmail = localStorage.getItem("userEmail");

let matchList = [];
let currentIndex = 0;

async function loadSwipeMatches() {
  try {
    matchList = await matches.getPotentialMatchesList(userEmail);
    showNextUser();
  } catch (error) {
    console.error("Swipe load error:", error);
  }
}

function showNextUser() {

if (currentIndex >= matchList.length) {

swipeContainer.innerHTML = `

<div class="no-matches">

<h2>No More Matches</h2>

<p>You’ve viewed all your potential matches.</p>

<button id="backHome" class="back-home-btn">
Return to Home
</button>

</div>

`;

document
.getElementById("backHome")
.addEventListener("click", () => {

window.location.href = "home.html";

});

return;

}

const match = matchList[currentIndex];
loadUser(match.u2_email);

}

async function loadUser(email) {
  try {
    const user = await users.getUser(email);
    swipeContainer.innerHTML = createSwipeCard(user);
  } catch (error) {
    console.error("User load error:", error);
  }
}

function createSwipeCard(user){

const name =
user?.name ||
user?.firstName ||
user?.email?.split("@")[0] ||
"Developer";

const age = user?.age || "N/A";
const bio = user?.bio || "No bio yet";
const location = user?.location || "Unknown";
const photo = user?.photos;

return `

<div class="swipe-card">

${photo 
? `<img src="${photo}" class="swipe-photo"/>`
: `<div class="no-photo">No Photo</div>`
}

<h2>${name}</h2>

<p class="age">${age}</p>

<p class="location">${location}</p>

<p class="bio">${bio}</p>

</div>

`;

}

// YES BUTTON (LIKE)
yesBtn.addEventListener("click", () => {

showMatchPopup();

});

// NO BUTTON (DISLIKE)
noBtn.addEventListener("click", () => {
currentIndex++;
showNextUser();
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
currentIndex++;
showNextUser();

});

loadSwipeMatches();