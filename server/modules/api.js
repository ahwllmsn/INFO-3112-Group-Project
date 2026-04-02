import express from "express";
import cors from "cors";
import { addUser, retrieveOneUserLogin, retrieveOneUser,
         updateProfileFields, addMatch, markCommunicationExposed,
         retrieveListOfMatchesByUser, likeUser, dislikeUser } from "./data.js";
import { getMatchScores } from "./matching-algo.js";

const app = express();

// Change maximum JSON body size for express (to avoid errors in sending/receiving user photos).
// https://stackoverflow.com/questions/71813334/how-to-change-max-size-for-body-parser-express
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended: true}));

app.use(cors());

app.use((req, _res, next) => {

    const timestamp = new Date(Date.now());

    console.warn(`\n[${timestamp.toDateString()} ${timestamp.toTimeString()}]`);

    console.log(req.method, req.hostname, req.path);
    console.log('body:', req.body);

    next();

});


/* =============================
   LOGIN
============================= */

app.post('/login', async (req, res) => {
    try {
        let request_body = req.body;

        let user_email = request_body.email;
        let user_password = request_body.password;

        let user = await retrieveOneUserLogin(user_email);

        if (user == null) {
            res.sendStatus(401);
        } 
        else if (user.password == user_password && user.email == user_email) {
            res.sendStatus(200);
        } 
        else {
            res.sendStatus(401);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   SIGN UP
============================= */

app.post('/sign-up', async (req, res) => {
    try {
        let request_body = req.body;
        const existingUser = await retrieveOneUser(request_body.newUser.email);
        if (existingUser) {
            res.sendStatus(409); // duplicate email
        } 
        else {
            await addUser(request_body.newUser);
            res.sendStatus(200);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   CREATE OR EDIT PROFILE
============================= */

app.post('/create-or-edit-profile', async (req, res) => {
    try {
        let request_body = req.body;
        let result = await updateProfileFields(request_body.profileInfo);
        res.body = result;
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   GET PROFILE INFO
============================= */
app.post('/get-profile-data', async (req, res) => {
    try {
        let request_body = req.body;
        let profileInfo = await retrieveOneUser(request_body.email);
        res.json(profileInfo);
    } catch (e) {
        console.log(e)
        res.sendStatus(500);
    }
});


/* =============================
   GET MATCHES ARRAY FOR 1 USER
============================= */
app.post('/get-potential-matches', async (req, res) => {
    try {
        let request_body = req.body;
        let matchesArray = await getMatchScores(request_body.email);
        res.json(matchesArray);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   SAVE NEW MATCH
============================= */
app.post('/save-new-match', async (req, res) => {
    try {
        let request_body = req.body;
        let result = await addMatch(request_body.matchData);
        if (result == false) {
            res.sendStatus(409); // Record already exists, did not add duplicate.
        } else {
            res.body = result;
            res.sendStatus(200);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   UPDATE COMMUNICATION EXPOSED IN MATCHES
============================= */
app.post('/communication-exposed', async (req, res) => {
    try {
        let { matchData, userEmail } = req.body;
        let exposedBy = await markCommunicationExposed(matchData, userEmail);
        res.json({
            exposedBy
        });
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   GET LIST OF ALL MATCHES FOR 1 USER
============================= */
app.post('/find-my-matches', async (req, res) => {
    try {
        let request_body = req.body;
        let result = await retrieveListOfMatchesByUser(request_body.email);
        res.json(result);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   ADD A "LIKED" USER TO A USER'S LIKED ARRAY (SWIPING YES)
============================= */
app.post('/send-like', async (req, res) => {
    try {
        let request_body = req.body;
        let result = await likeUser(request_body.userEmail, request_body.likeEmail);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   ADD A "DISLIKED" USER TO A USER'S LIKED ARRAY (SWIPING NO)
============================= */
app.post('/mark-dislike', async (req, res) => {
    try {
        let request_body = req.body;
        let result = await dislikeUser(request_body.userEmail, request_body.dislikeEmail);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


/* =============================
   START SERVER
============================= */

const startServer = (port) => {
    app.listen(port, () => {
        console.warn(`Listening on port ${port}`);

    });

}

console.log("API setup is complete.")

export {
    startServer
}