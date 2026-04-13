import * as api from './util/api.js';
import { showSnackBar, snackBar } from './util/snackbar.js';

/* ===============================
Editable Fields & Profile Save
=============================== */

const editBtn = document.getElementById("editBtn")
const fields = [
  document.getElementById("name"),
  document.getElementById("email"),
  document.getElementById("age"),
  document.getElementById("location"),
  document.getElementById("bio"),
  document.getElementById("preference"),
  document.getElementById("gender"),        
  document.getElementById("matchGender") 
]

//Had to double this bit up to make the button work correctly
let editing = true
let uploadedImage = undefined;
  fields.forEach(f => f.disabled = !editing)
  document.getElementById("ownedSkillSelect").disabled = !editing
  document.getElementById("wantedSkillSelect").disabled = !editing
  document.getElementById("select-local-image").disabled = !editing
  editBtn.innerText = editing ? "Save" : "Edit"

editBtn.onclick = function() {

  if (editing) {

    if (ownedSkills.length < 1) {
      snackBar.textContent = "Please select at least 1 owned skill.";
      showSnackBar();
      return
    }

    if (wantedSkills.length < 1) {
      snackBar.textContent = "Please select at least 1 wanted skill.";
      showSnackBar();
      return
    }

    if (!uploadedImage) {
      snackBar.textContent = "Please provide a profile photo." ;
      showSnackBar();
      return
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
      matchGender: document.getElementById("matchGender").value,
      accountType: document.getElementById("membership-checkbox").checked ? "Paid" : "Free"
    }
    document.getElementById("status-text").innerHTML = "Saving changes...";
    saveChanges(profileInfo);
  }
  editBtn.innerText = editing ? "Save" : "Edit"
}

const saveChanges = async (profileInfo) => {
  try {
    await api.users.editProfile(profileInfo);
    console.log("Successfully saved profile changes.");
    snackBar.textContent = "Saved changes";
      document.getElementById("status-text").innerHTML = "";
    showSnackBar();
    // If user SAVES their profile as paid, enable the sidebar match links.
    if (profileInfo.accountType == "Paid") {
      document.getElementById("view-matches-nav-link").hidden = false;
      document.getElementById("find-matches-nav-link").hidden = false;
    }
  } catch (e) {
    console.log(e);
    snackBar.textContent = "Error saving profile";
    showSnackBar();
  }
}

/* ===============================
IMAGE UPLOAD (MAX 1 PHOTO + REMOVE)
=============================== */
const imageInput = document.getElementById("select-local-image")
const preview = document.getElementById("photoPreview")

imageInput.onchange = function(event) {
  if (event.target.files.length > 1) {
    snackBar.textContent = "You may only upload 1 photo.";
    showSnackBar();
    return;
  }
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.readAsDataURL(file)

  reader.onload = () => {
    uploadedImage = reader.result;
    renderImage();
  }
  imageInput.value = "";
}

function renderImage(){
  preview.innerHTML = ""

  if(!uploadedImage) return;
  
  const wrapper = document.createElement("div")
  wrapper.style.position = "relative"
  wrapper.style.display = "inline-block"
  wrapper.style.margin = "5px"

  const img = document.createElement("img")
  img.src = uploadedImage;
  img.style.width = "100px"
  img.style.height = "100px"
  img.style.objectFit = "cover"
  img.style.borderRadius = "8px"

  const removeBtn = document.createElement("button")
  removeBtn.innerText = "✕"
  removeBtn.style.position = "absolute"
  removeBtn.style.top = "0"
  removeBtn.style.right = "0"
  removeBtn.style.background = "red"
  removeBtn.style.color = "white"
  removeBtn.style.border = "none"
  removeBtn.style.cursor = "pointer"
  removeBtn.style.borderRadius = "50%"

  removeBtn.onclick = () => {
    if(!editing) return;  
    uploadedImage = "";
    renderImage();
  }

  wrapper.appendChild(img)
  wrapper.appendChild(removeBtn)
  preview.appendChild(wrapper)
  
}

/* ===============================
SKILL TAG SYSTEM (MAX 3)
=============================== */
let ownedSkills = []
let wantedSkills = []

function addSkill(selectId, containerId, skillArray){
  const select = document.getElementById(selectId)
  select.onchange = function(){
    const skill = select.value
    if(!skill) return
    if(skillArray.includes(skill)) return
    if(skillArray.length >= 3){
      snackBar.textContent = "You can only select up to 3 skills.";
      showSnackBar();
      select.value = ""
      return
    }

    skillArray.push(skill)
    if (containerId == "skillsOwned") {
      ownedSkills = skillArray;
    } else {
      wantedSkills = skillArray;
    }
    renderSkills(containerId, skillArray)
    select.value = ""
  }
}

function renderSkills(containerId, skillArray){
  const container = document.getElementById(containerId)
  container.innerHTML = ""
  skillArray.forEach(skill => {
    const tag = document.createElement("div")
    tag.className = "skill-tag"
    tag.innerText = skill

    const remove = document.createElement("span")
    remove.innerText = " ✕"
    remove.onclick = () => {
      skillArray.splice(skillArray.indexOf(skill),1)
      renderSkills(containerId, skillArray)
    }

    tag.appendChild(remove)
    container.appendChild(tag)
  })
}

// Initialize both skill selectors
addSkill("ownedSkillSelect","skillsOwned",ownedSkills)
addSkill("wantedSkillSelect","skillsWanted",wantedSkills)


// Auto-populate profile if the fields already exist.
const getProfileInfo = async () => {
  let currentEmail = localStorage.getItem("userEmail");
  let profileInfo = await api.users.getUser(currentEmail);
  populateProfileFields(profileInfo);
  if (profileInfo.accountType == "Paid") {
    document.getElementById("view-matches-nav-link").hidden = false;
    document.getElementById("find-matches-nav-link").hidden = false;
  }
}

const populateProfileFields = (profileInfo) => {
  // Text input fields.
  if(profileInfo.firstName) {
    document.getElementById("name").value = profileInfo.firstName;
  }
  if(profileInfo.email) {
    document.getElementById("email").value = profileInfo.email;
    // Should not allow the user to edit their email. This will create a lot of database issues if they alter it!
    document.getElementById("email").disabled = true; 
  }
  if(profileInfo.age) {
    document.getElementById("age").value = profileInfo.age;
    // If an initial value has been given for age, it is constant and can never be altered again (for safety reasons).
    document.getElementById("age").disabled = true;
  }
  if(profileInfo.location) {
    document.getElementById("location").value = profileInfo.location;
  }
  if(profileInfo.bio) {
    document.getElementById("bio").value = profileInfo.bio;
  }

  // Drop-down menus.
  if(profileInfo.gender) {
    document.getElementById("gender").value = profileInfo.gender;
  }
  if(profileInfo.matchGender) {
    document.getElementById("matchGender").value = profileInfo.matchGender;
  }
  if(profileInfo.preference) {
    document.getElementById("preference").value = profileInfo.preference;
  }

  // Skills drop-down menus
  if (profileInfo.skillsOwned) {
    ownedSkills = [...profileInfo.skillsOwned];
    renderSkills("skillsOwned", ownedSkills);
  }

  if (profileInfo.skillsWanted) {
    wantedSkills = [...profileInfo.skillsWanted];
    renderSkills("skillsWanted", wantedSkills);
  }

  // Profile image.
  if (profileInfo.photos) {
    uploadedImage = profileInfo.photos;
    renderImage();
  }

  if (profileInfo.accountType) {
    document.getElementById("membership-checkbox").checked = profileInfo.accountType == "Paid";
  }
  document.getElementById("status-text").innerHTML = "";
}

getProfileInfo();

// If marked membership checkbox as false (free member), then disabled accessing the match links on the sidebar.
document.getElementById("membership-checkbox").addEventListener('change', (e) => {
  if (!e.currentTarget.checked) {
    document.getElementById("view-matches-nav-link").hidden = true;
    document.getElementById("find-matches-nav-link").hidden = true;
  }
})



