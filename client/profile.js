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
  document.getElementById("preference")
]

let editing = false
let uploadedImages = []

editBtn.onclick = function() {
  editing = !editing
  fields.forEach(f => f.disabled = !editing)

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
      photos: uploadedImages
    }
    console.log(profileInfo)
  }

  editBtn.innerText = editing ? "Save" : "Edit"
}

/* ===============================
IMAGE UPLOAD (MAX 3 PHOTOS)
=============================== */

const imageInput = document.getElementById("select-local-image")
const preview = document.getElementById("photoPreview")

imageInput.onchange = function(event){
  const files = event.target.files
  if(files.length > 3){
    alert("You can only upload up to 3 photos.")
    event.target.value = ""
    preview.innerHTML = ""
    uploadedImages = []
    return
  }

  preview.innerHTML = ""
  uploadedImages = []

  Array.from(files).forEach(file => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const base64 = reader.result
      uploadedImages.push(base64)

      const img = document.createElement("img")
      img.src = base64
      img.style.width = "100px"
      img.style.height = "100px"
      img.style.objectFit = "cover"
      img.style.margin = "5px"
      img.style.borderRadius = "8px"
      preview.appendChild(img)
    }
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
