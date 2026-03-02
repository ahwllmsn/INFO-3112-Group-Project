import env from './env.js';
import * as db from './db.js';

const DATABASE_NAME = "INFO-3112-Project";
const USER_COLLECTION = "users";

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
}

export {
    DATABASE_NAME,
    USER_COLLECTION, 
    addUser,
    retrieveAllUsers
}
