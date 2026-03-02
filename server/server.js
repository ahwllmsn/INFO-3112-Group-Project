import env from './modules/env.js';

import { initDatabase, insertDocument, deleteDocument } from './modules/db.js';

let db = undefined;
try {
    // Connect to INFO-3112-Application-Cluster on MongoDB
    db = await initDatabase(env.DB_URI);
} catch (e) {
    console.error(e);
} finally {
    db?.close();
}

