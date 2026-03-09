import env from './env.js';
import * as db from './db.js';

const DATABASE_NAME = "INFO-3112-Project";
const USER_COLLECTION = "users";
const MATCHES_COLLECTIOn = "matches"; // Placeholder for when we have matches (temporary).

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

const addProfileFields = async (profileInfo) => {
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
            if (user[key] == null) {
                newProfileFields[key] = value;
            }
        }
        
        // Add new fields to preexisting document.
        await db.updateDocument(context, DATABASE_NAME, USER_COLLECTION, query, newProfileFields);
        console.log(`Successfully added ${Object.keys(newProfileFields).length} new fields to [${user.email}]`);
    } catch (e) {
        console.error(e);
    } finally {
        context?.close();
    }
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

export {
    DATABASE_NAME,
    USER_COLLECTION, 
    addUser,
    retrieveOneUserLogin,
    retrieveOneUser,
    retrieveAllUsers,
    addProfileFields
}
