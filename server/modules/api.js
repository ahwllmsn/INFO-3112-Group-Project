import express from "express";
import cors from "cors";
import { addUser, retrieveOneUserLogin, retrieveOneUser, updateProfileFields } from "./data.js";

const app = express();

app.use(express.json());
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
''

/* =============================
   GET PROFILE INFO
============================= */
app.post('/get-profile-data', async (req, res) => {
    try {
        let request_body = req.body;
        let profileInfo = await retrieveOneUser(request_body.email);
        res.json(profileInfo);
        res.sendStatus(200);
    } catch (e) {
        console.log(e)
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