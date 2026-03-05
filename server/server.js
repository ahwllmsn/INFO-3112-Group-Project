// import env from './modules/env.js';
import { addUser, retrieveAllUsers } from './modules/data.js';

// import { initDatabase, insertDocument, deleteDocument } from './modules/db.js';

import { startServer } from './modules/api.js';

const API_PORT = 9000;
// await retrieveAllUsers();

startServer(API_PORT);

// let db = undefined;
// try {
//     let test_user = {name:"Example User", age: "22", gender:"female", location:"London, ON"};

//     // let result = await addUser(test_user);

//     let result = await retrieveAllUsers();

//     console.log(result);
    
// } catch (e) {
//     console.error(e);
// } finally {
//     db?.close();
// }

