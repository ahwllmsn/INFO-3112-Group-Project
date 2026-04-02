import env from './env.js';
import * as db from './db.js';

const DATABASE_NAME = "INFO-3112-Project";
const USER_COLLECTION = "users";
const MATCHES_COLLECTION = "matches";

const addUser = async (user) => {
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        let result = await db.insertDocument(context, DATABASE_NAME, USER_COLLECTION, user);
        console.log(`Successfully inserted [${user.name}] into the database.`);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
}

// Retrieve only the log-in fields for a user with lookup using their email.
const retrieveOneUserLogin = async (email) => {
    let user = undefined;
    let context = undefined;
    try {
        const query = {email};

        // Project to only get id, email, password.
        const projection = {
            _id: 0,
            email: 1,
            password: 1
        }

        context = await db.initDatabase(env.DB_URI);
        user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, query, projection);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    return user;

}

const retrieveOneUser = async (email) => { // Has not been used yet.
    let user = undefined;
    let context = undefined;
    try {
        const query = {email};
        context = await db.initDatabase(env.DB_URI);
        user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, query);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    return user;
}

const updateProfileFields = async (profileInfo) => {
    let numFieldsChanged = 0;
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        
        // First, find the document of that user to add new profile fields to.
        const email = profileInfo.email;
        const query = {email};
        let user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, query);

        // Iterate through all keys in new profile, and only save the new ones that the user doesn't already have.
        let newProfileFields = {};
        for (const [key, value] of Object.entries(profileInfo)) {
            if (user[key] == null || user[key] != profileInfo[key]) {
                newProfileFields[key] = value;
            }
        }
        
        // Add new fields to preexisting document.
        await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, query, newProfileFields);
        numFieldsChanged = Object.keys(newProfileFields).length;
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    console.log(`Successfully updated ${numFieldsChanged} fields for [${profileInfo.email}]`);
}

const retrieveAllUsers = async () => { // Has not been used yet.
    let users = [];
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {});
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }    
    return users;
}

const retrieveAllUserMatchData = async () => {
    let users = [];
    let context = undefined;
    try {

        // Project to only get id, email, password.
        const projection = {
            _id: 0,
            email: 1,
            skillsOwned: 1,
            skillsWanted: 1,
            gender: 1,
            preference: 1,
            matchGender: 1,
        }

        context = await db.initDatabase(env.DB_URI);
        users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {}, projection);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    console.log(`Successfully retrieved all matching fields for all users.`);
    return users;
}

const addMatch = async (matchData) => {
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        let doesMatchExist = await retrieveMatch(matchData);
        if (doesMatchExist != undefined) {
            console.log("Cannot add new match, it already exists in the database.");
            return false;
        } else if (matchData.u1_email == undefined || matchData.u2_email == undefined) {
            console.log("Cannot add new match, not enough email values provided.");
            return false;
        }
        let result = await db.insertDocument(context, DATABASE_NAME, MATCHES_COLLECTION, matchData);
        console.log(`Successfully inserted a new match between [${matchData.u1_email} & ${matchData.u2_email}] into the database!`);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
}

const markCommunicationExposed = async (matchData, userEmail) => {
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        const query = {
            u1_email: matchData.u1_email,
            u2_email: matchData.u2_email
        };

        const match = await db.findDocument(context, DATABASE_NAME, MATCHES_COLLECTION, query);

        let exposedBy = match.exposedBy || [];

        if (!exposedBy.includes(userEmail)) {
            exposedBy.push(userEmail);
        }

        // Update communication exposed boolean.
        let exposed_communication = match.exposed_communication;
        if (exposedBy.includes(matchData.u1_email) && exposedBy.includes(matchData.u2_email)) {
            exposed_communication = true;
        }

        let updatedFields = {exposedBy, exposed_communication};

        await db.updateDocument(context, DATABASE_NAME, MATCHES_COLLECTION, query, updatedFields);

        return exposedBy;

    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
};

const retrieveMatch = async (matchData) => {
    let match = undefined;
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        const query = {"u1_email":matchData.u1_email, "u2_email":matchData.u2_email };

        match = await db.findDocument(context, DATABASE_NAME, MATCHES_COLLECTION, query);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    console.log(`Successfully retrieved match data for the match between ${matchData.u1_email} & ${matchData.u2_email}`);
    return match;
}

const retrieveListOfMatchesByUser = async (email) => {
    let matches = [];
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        const query = {$or:[ { "u1_email":email },{ "u2_email":email } ]};

        matches = await db.findDocuments(context, DATABASE_NAME, MATCHES_COLLECTION, query);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    console.log(`Successfully retrieved ${matches.length} match${matches.length > 1 ? "es" : ""} for ${email}`);
    return matches; 
}

const likeUser = async (userEmail, likeEmail) => {
    let user = undefined;
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        user = await retrieveOneUser(userEmail);

        let newLikesList = [];
        if (user.likesList) {
            newLikesList = [...user.likesList, likeEmail];
        } else {
            newLikesList = [likeEmail];
        }

        const newLikesListObject = {"likesList": newLikesList};
        let query = {email: userEmail};
        await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, query, newLikesListObject);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    console.log(`${likeEmail} is now in ${userEmail}'s liked collection.`);
}

const dislikeUser = async (userEmail, dislikeEmail) => {
    let user = undefined;
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        user = await retrieveOneUser(userEmail);

        let newDislikesList = [];
        if (user.dislikesList) {
            newDislikesList = [...user.dislikesList, dislikeEmail];
        } else {
            newDislikesList = [dislikeEmail];
        }

        const newDislikesListObject = {"dislikesList": newDislikesList};
        let query = {email: userEmail};
        await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, query, newDislikesListObject);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    console.log(`${dislikeEmail} is now in ${userEmail}'s disliked collection.`);
}

export {
    DATABASE_NAME,
    USER_COLLECTION, 
    addUser,
    retrieveOneUserLogin,
    retrieveOneUser,
    retrieveAllUsers,
    updateProfileFields,
    retrieveAllUserMatchData,
    addMatch,
    markCommunicationExposed,
    retrieveListOfMatchesByUser,
    likeUser,
    dislikeUser
}
