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
       CREATE OR EDIT PROFILE
    ============================= */

    editProfile: async (profileInfo) => {
        let response = await fetch(serverRoute('create-or-edit-profile'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ profileInfo })
        });
        return response;
    },

    /* =============================
       RETRIEVE USER DATA
    ============================= */

    getUser: async (email) => {
        let response = await fetch(serverRoute('get-profile-data'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ email })
        });
        let data = await response.json();
        return data;
    },
};


const matches = {
    /* =============================
      GET MATCHES ARRAY FOR 1 USER
    ============================= */
    getPotentialMatchesList: async (email) => {
        let response = await fetch(serverRoute('get-potential-matches'), {
            headers,
            method: 'POST',
            body: JSON.stringify({email})
        });
        let matchesArray = await response.json();
        console.log(`Successfully retrieved ${matchesArray.length} potential match${matchesArray.length > 1 ? "es" : ""} for ${email}`);
        return matchesArray;
    },

    /* =============================
      SAVE NEW MATCH
    ============================= */    
    saveNewMatch: async (matchData) => {
        let response = await fetch(serverRoute('save-new-match'), {
            headers,
            method: 'POST',
            body: JSON.stringify({matchData})
        });
        if(response.ok) {
            console.log("Saved a new match!");
        } else {
            console.log("Cannot add new match, it already exists in the database.");
        }
    },

    /* =============================
      MATCHES SHARING CONTACT INFO
    ============================= */
    shareContact: async (matchData, userEmail) => {
        let response = await fetch(serverRoute('communication-exposed'), {
            headers,
            method: 'POST',
            body: JSON.stringify({ matchData, userEmail })
        });
        if (response.ok) {
            return await response.json();
        }
    },

    /* =============================
     GET LIST OF ALL MATCHES FOR 1 USER
    ============================= */
    findMyMatches: async (email) => {
        let response = await fetch(serverRoute('find-my-matches'), {
            headers,
            method: 'POST',
            body: JSON.stringify({email})
        });
        let matchesArray = await response.json();
        if (response.ok) {
            console.log(`Successfully retrieved ${matchesArray.length} match${matchesArray.length > 1 ? "es" : ""} for ${email}`);
        }
        return matchesArray;
    },
    /* =============================
     ADD A "LIKED" USER TO A USER'S LIKED ARRAY (SWIPING YES)
    ============================= */
    likeUser: async (userEmail, likeEmail) => {
        let response = await fetch(serverRoute('send-like'), {
            headers,
            method: 'POST',
            body: JSON.stringify({userEmail, likeEmail}) 
        });
        if (response.ok) {
            console.log(`${userEmail} swiped yes on ${likeEmail}!`);
        }
    },
    /* =============================
     ADD A "DISLIKED" USER TO A USER'S LIKED ARRAY (SWIPING NO)
    ============================= */
    dislikeUser: async (userEmail, dislikeEmail) => {
        let response = await fetch(serverRoute('mark-dislike'), {
            headers,
            method: 'POST',
            body: JSON.stringify({userEmail, dislikeEmail}) 
        });
        if (response.ok) {
            console.log(`${userEmail} swiped no on ${dislikeEmail}!`);
        }
    }
};

const statistics = {
    getAppStatistics: async () => {
        let response = await fetch(serverRoute('get-app-statistics'), {
            headers,
            method: 'POST'
        });
        if (response.ok) {
            return await response.json();
        }
    }
}


export {
    users,
    matches,
    statistics
};