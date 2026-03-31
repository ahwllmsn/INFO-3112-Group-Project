import * as api from "./util/api.js";

/* ===============================
ELEMENTS
=============================== */

const editBtn = document.getElementById("editBtn");
const snackBar = document.getElementById("snackbar");

const fields = [
  document.getElementById("name"),
  document.getElementById("email"),
  document.getElementById("age"),
  document.getElementById("location"),
  document.getElementById("bio"),
  document.getElementById("preference"),
  document.getElementById("gender"),
  document.getElementById("matchGender")
];

/* ===============================
STATE
=============================== */

let editing = false;
let uploadedImage = "";
let ownedSkills = [];
let wantedSkills = [];

/* ===============================
EDIT MODE
=============================== */

function setEditMode(state) {
  editing = state;

  fields.forEach((f) => (f.disabled = !editing));

  document.getElementById("ownedSkillSelect").disabled = !editing;
  document.getElementById("wantedSkillSelect").disabled = !editing;
  document.getElementById("select-local-image").disabled = !editing;

  editBtn.innerText = editing ? "Save" : "Edit";
}

setEditMode(false);

/* ===============================
SNACKBAR
=============================== */

function showSnackBar(message) {
  snackBar.textContent = message;
  snackBar.className = "show";

  setTimeout(() => {
    snackBar.className = snackBar.className.replace("show", "");
  }, 2500);
}

/* ===============================
SAVE PROFILE
=============================== */

editBtn.onclick = async () => {
  if (!editing) {
    setEditMode(true);
    return;
  }

  const profileInfo = {
    firstName: document.getElementById("name").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
    location: document.getElementById("location").value,
    bio: document.getElementById("bio").value,
    preference: document.getElementById("preference").value,
    gender: document.getElementById("gender").value,
    matchGender: document.getElementById("matchGender").value,
    skillsOwned,
    skillsWanted,
    photos: uploadedImage
  };

  await saveChanges(profileInfo);
};

/* ===============================
SAVE FUNCTION
=============================== */

const saveChanges = async (profileInfo) => {
  try {
    await api.users.editProfile(profileInfo);

    // refresh matches after profile update
    await api.matches.getMatches(profileInfo.email);

    setEditMode(false);

    showSnackBar("Profile saved & matches updated");
  } catch (e) {
    console.error(e);
    showSnackBar("Error saving profile");
  }
};

/* ===============================
SKILLS HANDLING (REAL-TIME)
=============================== */

const ownedSelect = document.getElementById("ownedSkillSelect");
const wantedSelect = document.getElementById("wantedSkillSelect");

function addSkill(skill, list, type) {
  if (!skill) return;

  if (list.includes(skill)) return; // prevent duplicates

  const max = 5;
  if (list.length >= max) return;

  list.push(skill);

  renderSkills();
}

function renderSkills() {
  const ownedContainer = document.getElementById("ownedSkillsDisplay");
  const wantedContainer = document.getElementById("wantedSkillsDisplay");

  ownedContainer.innerHTML = ownedSkills.map(s => `<span class="tag">${s}</span>`).join("");
  wantedContainer.innerHTML = wantedSkills.map(s => `<span class="tag">${s}</span>`).join("");
}

/* listeners */
ownedSelect.addEventListener("change", (e) => {
  addSkill(e.target.value, ownedSkills);
});

wantedSelect.addEventListener("change", (e) => {
  addSkill(e.target.value, wantedSkills);
});