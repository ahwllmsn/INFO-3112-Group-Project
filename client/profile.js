/* =================================================
   PROFILE PAGE LOGIC
   (Moved here as requested)
================================================= */

/* YEFRAT TASK - Edit button logic */

const editBtn = document.getElementById("editBtn")

const fields = [
document.getElementById("name"),
document.getElementById("email"),
document.getElementById("preference")
]

let editing = false

editBtn.onclick = function(){

editing = !editing

fields.forEach(field => field.disabled = !editing)

editBtn.innerText = editing ? "Save" : "Edit"

}


/* =================================================
   PROFILE IMAGE UPLOAD
================================================= */

document.getElementById("select-local-image").onchange = (event) => {

const target = event.target
const image = target.files[0]

console.log(image)

try {

const reader = new FileReader()

image ? reader.readAsBinaryString(image) : null

reader.onload = () => {

const binary_string = reader.result

const encoded_string = btoa(binary_string)

// This encoded string can now be stored in MongoDB
console.log("Base64 image string:", encoded_string)

}

} catch (e) {

console.log(e)

}

}