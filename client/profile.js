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


function getCheckedValues(containerId){

const container = document.getElementById(containerId)

const checked = [...container.querySelectorAll("input:checked")]

return checked.map(cb => cb.value)

}


editBtn.onclick = function(){

editing = !editing

fields.forEach(field => field.disabled = !editing)


if(!editing){

const profileInfo = {

email: document.getElementById("email").value,

name: document.getElementById("name").value,

age: document.getElementById("age").value,

location: document.getElementById("location").value,

bio: document.getElementById("bio").value,

preference: document.getElementById("preference").value,

skillsOwned: getCheckedValues("skillsOwned"),

skillsWanted: getCheckedValues("skillsWanted")

}

console.log(profileInfo)

}

editBtn.innerText = editing ? "Save" : "Edit"

}



/* ===============================
IMAGE UPLOAD
=============================== */

document.getElementById("select-local-image").onchange = (event) => {

const target = event.target

const image = target.files[0]

try {

const reader = new FileReader()

image ? reader.readAsBinaryString(image) : null

reader.onload = () => {

const binary_string = reader.result

const encoded_string = btoa(binary_string)

console.log("Base64 image string:", encoded_string)

}

} catch (e) {

console.log(e)

}

}