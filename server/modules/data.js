import env from './env.js';
import * as db from './db.js';

const DATABASE_NAME = "INFO-3112-Project";
const USER_COLLECTION = "users";
const MATCHES_COLLECTION = "matches";

const addUser = async (user) => {
    let context = undefined;
    try {
        context = await db.initDatabase(env.DB_URI);
        await db.insertDocument(context, DATABASE_NAME, USER_COLLECTION, user);
        console.log(`Successfully inserted [${user.name}] into the database.`);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
};

// Retrieve only login fields
const retrieveOneUserLogin = async (email) => {
    let user = undefined;
    let context = undefined;
    try {
        const query = { email };

        const projection = {
            _id: 0,
            email: 1,
            password: 1
        };

        context = await db.initDatabase(env.DB_URI);
        user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, query, projection);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    return user;
};

const retrieveOneUser = async (email) => {
    let user = undefined;
    let context = undefined;
    try {
        const query = { email };
        context = await db.initDatabase(env.DB_URI);
        user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, query);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
    return user;
};

const updateProfileFields = async (profileInfo) => {
    let numFieldsChanged = 0;
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        const email = profileInfo.email;
        const query = { email };

        const user = await db.findDocument(context, DATABASE_NAME, USER_COLLECTION, query);

        let newProfileFields = {};

        for (const [key, value] of Object.entries(profileInfo)) {
            if (user[key] == null || user[key] !== value) {
                newProfileFields[key] = value;
            }
        }

        await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, query, newProfileFields);

        numFieldsChanged = Object.keys(newProfileFields).length;

    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }

    console.log(`Successfully updated ${numFieldsChanged} fields for [${profileInfo.email}]`);
};

const retrieveAllUsers = async () => {
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
};

const retrieveAllUserMatchData = async () => {
    let users = [];
    let context = undefined;

    try {
        const projection = {
            _id: 0,
            email: 1,
            skillsOwned: 1,
            skillsWanted: 1,
            gender: 1,
            preference: 1,
            matchGender: 1,
        };

        context = await db.initDatabase(env.DB_URI);
        users = await db.findDocuments(context, DATABASE_NAME, USER_COLLECTION, {}, projection);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }

    console.log(`Successfully retrieved all matching fields for all users.`);
    return users;
};

const addMatch = async (matchData) => {
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        let doesMatchExist = await retrieveMatch(matchData);

        if (doesMatchExist != undefined) {
            console.log("Cannot add new match, it already exists in the database.");
            return false;
        }

        if (!matchData.u1_email || !matchData.u2_email) {
            console.log("Cannot add new match, not enough email values provided.");
            return false;
        }

        await db.insertDocument(context, DATABASE_NAME, MATCHES_COLLECTION, matchData);

        console.log(`Successfully inserted match between [${matchData.u1_email} & ${matchData.u2_email}]`);

    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
};

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

        await db.updateDocument(context, DATABASE_NAME, MATCHES_COLLECTION, query, {
            exposedBy
        });

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

        const query = {
            u1_email: matchData.u1_email,
            u2_email: matchData.u2_email
        };

        match = await db.findDocument(context, DATABASE_NAME, MATCHES_COLLECTION, query);

    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }

    console.log(`Retrieved match: ${matchData.u1_email} & ${matchData.u2_email}`);

    return match;
};

const retrieveListOfMatchesByUser = async (email) => {
    let matches = [];
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        const query = {
            $or: [
                { u1_email: email },
                { u2_email: email }
            ]
        };

        matches = await db.findDocuments(context, DATABASE_NAME, MATCHES_COLLECTION, query);

    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }

    console.log(`Retrieved ${matches.length} matches for ${email}`);

    return matches;
};

const likeUser = async (userEmail, likeEmail) => {
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        const user = await retrieveOneUser(userEmail);

        const newLikesList = user.likesList
            ? [...user.likesList, likeEmail]
            : [likeEmail];

        await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, { email: userEmail }, {
            likesList: newLikesList
        });

    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }

    console.log(`${likeEmail} added to likes of ${userEmail}`);
};

const dislikeUser = async (userEmail, dislikeEmail) => {
    let context = undefined;

    try {
        context = await db.initDatabase(env.DB_URI);

        const user = await retrieveOneUser(userEmail);

        const newDislikesList = user.dislikesList
            ? [...user.dislikesList, dislikeEmail]
            : [dislikeEmail];

        await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, { email: userEmail }, {
            dislikesList: newDislikesList
        });

    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }

    console.log(`${dislikeEmail} added to dislikes of ${userEmail}`);
};

// ✅ FINAL EXPORT (FIXED)
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
    dislikeUser,
    retrieveMatch   // ✅ FIX ADDED
};