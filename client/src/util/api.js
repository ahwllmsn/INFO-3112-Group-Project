const API_IP = 'http://localhost';
const API_PORT = 9000;

const headers = {
    'Accept': '*/*',
    'Content-Type': 'application/json'
};

const serverRoute = (route) => `${API_IP}:${API_PORT}/${route}`;


// =============================
// USERS
// =============================
const users = {

    validateLogin: async (email, password) => {
        const response = await fetch(serverRoute('login'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        return response;
    },


    newSignUp: async (newUser) => {
        newUser.account_created = new Date().toISOString();

        const response = await fetch(serverRoute('sign-up'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ newUser })
        });

        return response;
    },


    editProfile: async (profileInfo) => {
        const response = await fetch(serverRoute('create-or-edit-profile'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ profileInfo })
        });

        return response;
    },


    getUser: async (email) => {
        const response = await fetch(serverRoute('get-profile-data'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ email })
        });

        return await response.json();
    }
};


// =============================
// MATCHES
// =============================
const matches = {

    // GET POTENTIAL MATCHES (CORE FEATURE #3)
    getPotentialMatchesList: async (email) => {
        const response = await fetch(serverRoute('get-potential-matches'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ email })
        });

        return await response.json();
    },


    // SAVE MATCH (CORE FEATURE)
    saveNewMatch: async (matchData) => {
        const response = await fetch(serverRoute('save-new-match'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ matchData })
        });

        return response;
    },


    // LIKE USER
    likeUser: async (userEmail, likeEmail) => {
        const response = await fetch(serverRoute('send-like'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ userEmail, likeEmail })
        });

        return response;
    },


    // DISLIKE USER
    dislikeUser: async (userEmail, dislikeEmail) => {
        const response = await fetch(serverRoute('mark-dislike'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ userEmail, dislikeEmail })
        });

        return response;
    },


    // GET ALL MATCHES
    findMyMatches: async (email) => {
        const response = await fetch(serverRoute('find-my-matches'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ email })
        });

        return await response.json();
    },


    // MUTUAL CONTACT FEATURE (CORE TASK #5)
    shareContact: async (matchData, userEmail) => {
        const response = await fetch(serverRoute('communication-exposed'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ matchData, userEmail })
        });

        return await response.json();
    },


    // OPTIONAL: check match status (if you use it in UI)
    getMatchStatus: async (matchData) => {
        const response = await fetch(serverRoute('get-match-status'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ matchData })
        });

        if (!response.ok) return null;

        return await response.json();
    }
};


// =============================
export {
    users,
    matches
};