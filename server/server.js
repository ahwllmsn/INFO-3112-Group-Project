import env from './modules/env.js';
import { addUser, retrieveAllUsers } from './modules/data.js';

import { initDatabase, insertDocument, deleteDocument } from './modules/db.js';

let db = undefined;
try {
    let test_user = {name:"Example User", age: "22", gender:"female", location:"London, ON"};

    // let result = await addUser(test_user);

    let result = await retrieveAllUsers();

    console.log(result);
    
} catch (e) {
    console.error(e);
} finally {
    db?.close();
}

