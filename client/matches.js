import { users, matches } from "./src/util/api.js";

const matchesContainer = document.getElementById("successfulMatches");

const userEmail = localStorage.getItem("userEmail");

async function loadSuccessfulMatches(){

try{

const matchList = await matches.getPotentialMatchesList(userEmail);

if(!matchList || matchList.length === 0){

matchesContainer.innerHTML = `
<h3>No successful matches yet</h3>
`;

return;

}

const matchCards = await Promise.all(

matchList.map(async (match)=>{

const user = await users.getUser(match.u2_email);

return createMatchCard(user);

})

);

matchesContainer.innerHTML = matchCards.join("");

}catch(error){

console.error(error);

matchesContainer.innerHTML = `
<h3>Error loading matches</h3>
`;

}

}

function createMatchCard(user){

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

<p class="email">${email}</p>

</div>

`;

}

loadSuccessfulMatches();