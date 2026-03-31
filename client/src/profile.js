import * as api from './util/api.js';

/* ===============================
PROFILE STATE
=============================== */

const editBtn = document.getElementById("editBtn");

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

let editing = false;
let uploadedImage = "";
let ownedSkills = [];
let wantedSkills = [];

/* ===============================
EDIT TOGGLE
=============================== */

function setEditMode(state) {
  editing = state;

  fields.forEach(f => f.disabled = !editing);

  document.getElementById("ownedSkillSelect").disabled = !editing;
  document.getElementById("wantedSkillSelect").disabled = !editing;
  document.getElementById("select-local-image").disabled = !editing;

  editBtn.innerText = editing ? "Save" : "Edit";
}

setEditMode(false);

editBtn.onclick = function () {

  if (!editing) {
    setEditMode(true);
    return;
  }

  // VALIDATION
  if (ownedSkills.length < 1) {
    snackBar.textContent = "Select at least 1 owned skill.";
    showSnackBar();
    return;
  }

  if (wantedSkills.length < 1) {
    snackBar.textContent = "Select at least 1 wanted skill.";
    showSnackBar();
    return;
  }

  if (!uploadedImage) {
    snackBar.textContent = "Please upload a profile photo.";
    showSnackBar();
    return;
  }

  const profileInfo = {
    firstName: document.getElementById("name").value,
    email: document.getElementById("email").value,
    age: document.getElementById("age").value,
    location: document.getElementById("location").value,
    bio: document.getElementById("bio").value,
    preference: document.getElementById("preference").value,
    skillsOwned: ownedSkills,
    skillsWanted: wantedSkills,
    photos: uploadedImage,
    gender: document.getElementById("gender").value,
    matchGender: document.getElementById("matchGender").value
  };

  saveChanges(profileInfo);
};

/* ===============================
SAVE PROFILE + MATCH UPDATE
=============================== */

const saveChanges = async (profileInfo) => {
  try {
    await api.users.editProfile(profileInfo);

    // 🔥 Sprint 2: trigger match recalculation
    if (api.matches?.getMatches) {
      await api.matches.getMatches(profileInfo.email);
    }

    snackBar.textContent = "Profile saved & matches updated";
    showSnackBar();

    setEditMode(false);

  } catch (e) {
    console.error(e);
    snackBar.textContent = "Error saving profile";
    showSnackBar();
  }
};

/* ===============================
IMAGE UPLOAD
=============================== */

const imageInput = document.getElementById("select-local-image");
const preview = document.getElementById("photoPreview");

imageInput.onchange = function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onload = () => {
    uploadedImage = reader.result;
    renderImage();
  };

  imageInput.value = "";
};

function renderImage() {
  preview.innerHTML = "";

  if (!uploadedImage) return;

  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";

  const img = document.createElement("img");
  img.src = uploadedImage;
  img.style.width = "100px";
  img.style.height = "100px";
  img.style.objectFit = "cover";
  img.style.borderRadius = "8px";

  const removeBtn = document.createElement("button");
  removeBtn.innerText = "✕";

  removeBtn.onclick = () => {
    if (!editing) return;
    uploadedImage = "";
    renderImage();
  };

  wrapper.appendChild(img);
  wrapper.appendChild(removeBtn);
  preview.appendChild(wrapper);
}

/* ===============================
SKILLS SYSTEM
=============================== */

function addSkill(selectId, containerId, skillArray) {
  const select = document.getElementById(selectId);

  select.onchange = function () {
    const skill = select.value;
    if (!skill) return;

    if (skillArray.includes(skill)) return;

    if (skillArray.length >= 3) {
      snackBar.textContent = "Max 3 skills allowed.";
      showSnackBar();
      select.value = "";
      return;
    }

    skillArray.push(skill);

    renderSkills(containerId, skillArray);

    select.value = "";
  };
}

function renderSkills(containerId, skillArray) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  skillArray.forEach(skill => {
    const tag = document.createElement("div");
    tag.className = "skill-tag";
    tag.innerText = skill;

    const remove = document.createElement("span");
    remove.innerText = " ✕";

    remove.onclick = () => {
      skillArray.splice(skillArray.indexOf(skill), 1);
      renderSkills(containerId, skillArray);
    };

    tag.appendChild(remove);
    container.appendChild(tag);
  });
}

addSkill("ownedSkillSelect", "skillsOwned", ownedSkills);
addSkill("wantedSkillSelect", "skillsWanted", wantedSkills);

/* ===============================
LOAD PROFILE
=============================== */

const getProfileInfo = async () => {
  const email = localStorage.getItem("userEmail");
  const profileInfo = await api.users.getUser(email);
  populateProfile(profileInfo);
};

function populateProfile(profileInfo) {

  if (profileInfo.firstName)
    document.getElementById("name").value = profileInfo.firstName;

  if (profileInfo.email) {
    document.getElementById("email").value = profileInfo.email;
    document.getElementById("email").disabled = true;
  }

  if (profileInfo.age) {
    document.getElementById("age").value = profileInfo.age;
    document.getElementById("age").disabled = true;
  }

  if (profileInfo.location)
    document.getElementById("location").value = profileInfo.location;

  if (profileInfo.bio)
    document.getElementById("bio").value = profileInfo.bio;

  if (profileInfo.gender)
    document.getElementById("gender").value = profileInfo.gender;

  if (profileInfo.matchGender)
    document.getElementById("matchGender").value = profileInfo.matchGender;

  if (profileInfo.preference)
    document.getElementById("preference").value = profileInfo.preference;

  if (profileInfo.skillsOwned) {
    ownedSkills = [...profileInfo.skillsOwned];
    renderSkills("skillsOwned", ownedSkills);
  }

  if (profileInfo.skillsWanted) {
    wantedSkills = [...profileInfo.skillsWanted];
    renderSkills("skillsWanted", wantedSkills);
  }

  if (profileInfo.photos) {
    uploadedImage = profileInfo.photos;
    renderImage();
  }
}

getProfileInfo();

/* ===============================
SNACKBAR
=============================== */

const snackBar = document.getElementById("snackbar");

function showSnackBar() {
  snackBar.className = "show";
  setTimeout(() => {
    snackBar.className = snackBar.className.replace("show", "");
  }, 2500);
}