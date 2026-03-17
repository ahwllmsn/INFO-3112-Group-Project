import * as api from './src/util/api.js';
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
let uploadedImages = []
  fields.forEach(f => f.disabled = !editing)
  document.getElementById("ownedSkillSelect").disabled = !editing
  document.getElementById("wantedSkillSelect").disabled = !editing
  document.getElementById("select-local-image").disabled = !editing
  editBtn.innerText = editing ? "Save" : "Edit"

editBtn.onclick = function() {
  editing = !editing
  fields.forEach(f => f.disabled = !editing)
  document.getElementById("ownedSkillSelect").disabled = !editing
  document.getElementById("wantedSkillSelect").disabled = !editing
  document.getElementById("select-local-image").disabled = !editing

  if(!editing){
    const profileInfo = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      age: document.getElementById("age").value,
      location: document.getElementById("location").value,
      bio: document.getElementById("bio").value,
      preference: document.getElementById("preference").value,
      skillsOwned: ownedSkills,
      skillsWanted: wantedSkills,
      photos: uploadedImages,
      gender: document.getElementById("gender").value,
      matchGender: document.getElementById("matchGender").value,
    }
    // console.log(profileInfo); 
    // Update profile info in the database.
    api.users.editProfile(profileInfo);
  }
  editBtn.innerText = editing ? "Save" : "Edit"
}

/* ===============================
IMAGE UPLOAD (MAX 3 PHOTOS + REMOVE)
=============================== */

const imageInput = document.getElementById("select-local-image")
const preview = document.getElementById("photoPreview")

imageInput.onchange = function(event){
  const files = Array.from(event.target.files)

  if(uploadedImages.length + files.length > 3){
    alert("You can only have up to 3 photos total.")
    imageInput.value = ""
    return
  }

  files.forEach(file => {
    const reader = new FileReader()
    reader.readAsDataURL(file)

    reader.onload = () => {
      uploadedImages.push(reader.result)
      renderImages()
    }
  })

  imageInput.value = "" 
}

function renderImages(){
  preview.innerHTML = ""

  uploadedImages.forEach((imgSrc, index) => {
    const wrapper = document.createElement("div")
    wrapper.style.position = "relative"
    wrapper.style.display = "inline-block"
    wrapper.style.margin = "5px"

    const img = document.createElement("img")
    img.src = imgSrc
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
      if(!editing) return  
      uploadedImages.splice(index, 1)
      renderImages()
    }

    wrapper.appendChild(img)
    wrapper.appendChild(removeBtn)
    preview.appendChild(wrapper)
  })
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
      alert("You can only select up to 3 skills.")
      select.value = ""
      return
    }

    skillArray.push(skill)
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
