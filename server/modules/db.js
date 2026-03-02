import {MongoClient} from "mongodb";

const initDatabase = async (connectionString) => {
    try {
        const client = new MongoClient(connectionString);
        await client.connect();
        console.warn(`Connected to INFO-3112-Application-Cluster on MongoDB.`);
        return client;
    }
    catch (e) {
        console.error(e);
    }
}

const insertDocument = (context, database, collection, document) => {
    return context.db(database).collection(collection).insertOne(document);
}

const deleteDocument = (context, database, collection, document) => {
    return context.db(database).collection(collection).deleteOne(document);
}

// Alyssa - 03-02-2026:
// I will add more methods for querying + modification later. I'm just adding in basics for now.


export { 
    initDatabase,
    insertDocument,
    deleteDocument
};