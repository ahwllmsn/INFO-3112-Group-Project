/*
Please include an input element with the id of "select-local-image" in the profile.html page so the user
may select a local image on their machine to upload as their profile photo. - Alyssa

<input type="file" id="select-local-image"/>
*/

// Handle file upload with Base64 encoding.
document.getElementById("select-local-image").onchange = (event) => { 
    const target = event.target;
    const image = target.files[0];

    // console.log(target);
    console.log(image);

    try {
        const reader = new FileReader();
        image ? reader.readAsBinaryString(image) : null;
        reader.onload = (readerEvent) => {
            const binary_string = reader.result;
            const encoded_string = btoa(binary_string); // This is the value we will store in MongoDB.
            // console.log("base64:",encoded_string);

            // Now you can save this encoded string value (or an array/object of these) into the user object that holds all their data.
            // This way, we can store it in MongoDB. - Alyssa
        }
    } catch (e) {
        console.log(e);
    }
};



