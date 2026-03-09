const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
}

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;

const users = {
    validateLogin: async (email, password) => {
        let response = await fetch(serverRoute('login'), {
            headers,
            method: 'POST',
            body: JSON.stringify({email, password}),
        });
        return response;
    },
    newSignUp: async (newUser) => {
        // Add date information for when this account was created.
        const date = new Date();
        newUser.account_created = date;
        let response = await fetch(serverRoute('sign-up'), {
            headers,
            method: 'POST',
            body: JSON.stringify({newUser}),
        });
        return response;
    },
    // Note: pass all profile information here (including things that already exist - email, first name, password)
    // And only the new profile fields will be created (like age, gender, location, looking for love/friendship, etc.)
    // You must pass the email at the very least because the lookup is done on that field.  - Alyssa
    createProfile: async (profileInfo) => {
        let response = await fetch(serverRoute('create-profile'), {
            headers,
            method: 'POST',
            body: JSON.stringify({profileInfo}),
        });
        return response;  
    },
    editProfile: async (profileInfo) => {
        let response = await fetch(serverRoute('edit-profile'), {
            headers,
            method: 'POST',
            body: JSON.stringify({profileInfo}),
        });
        return response;  
    },
}

const matches = {

}

export {
    users,
    matches
}
