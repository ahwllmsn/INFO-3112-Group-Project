const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
};

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;


const users = {

    /* =============================
       LOGIN
    ============================= */

    validateLogin: async (email, password) => {

        let response = await fetch(serverRoute('login'), {

            headers,
            method: 'POST',
            body: JSON.stringify({ email, password })

        });

        return response;
    },


    /* =============================
       SIGN UP
    ============================= */

    newSignUp: async (newUser) => {

        const date = new Date();

        newUser.account_created = date.toISOString();

        let response = await fetch(serverRoute('sign-up'), {

            headers,
            method: 'POST',
            body: JSON.stringify({ newUser })

        });

        return response;
    },


    /* =============================
       CREATE PROFILE
    ============================= */

    createProfile: async (profileInfo) => {

        let response = await fetch(serverRoute('create-profile'), {

            headers,
            method: 'POST',
            body: JSON.stringify({ profileInfo })

        });

        return response;

    },


    /* =============================
       EDIT PROFILE
    ============================= */

    editProfile: async (profileInfo) => {

        let response = await fetch(serverRoute('edit-profile'), {

            headers,
            method: 'POST',
            body: JSON.stringify({ profileInfo })

        });

        return response;

    }

};


const matches = {

    // Future matching APIs can go here

};


export {
    users,
    matches
};