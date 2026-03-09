import express from "express";
import cors from "cors";
import { addUser, retrieveOneUserLogin, updateProfileFields } from "./data.js";

const app = express();

// Configure Express APIs middleware.
app.use(express.json());
app.use(cors());

// Custom middleware that logs each request.
app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.warn(`\n[${timestamp.toDateString()} ${timestamp.toTimeString()}] / ${timestamp.toISOString()}`);
    console.log(req.method, req.hostname, req.path);
    console.log('headers:', req.headers);
    console.log('query:', req.query);
    console.log('body:', req.body);
    next();
});

// Endpoint for client to send email + password and validate that combination exists in the database.
// It uses POST as it is more secure for sensitive info.
app.post('/login', async (req, res) => {
    try {
        let request_body = req.body;
        let user_email = request_body.email;
        let user_password = request_body.password;
        
        // Get user with the matching email.
        let user = await retrieveOneUserLogin(user_email); 

        // No matching email in database.
        if (user == null) {
            res.sendStatus(401);
        // Email + password combination does not match login credentials.
        } else if (user.password == user_password && user.email == user_email) {
            res.sendStatus(200);
        // Other login credential related error.
        } else {
            res.sendStatus(401);
        }
    // Server-side error.
    } catch (e) {
        console.log(e);
        response.sendStatus(500);
    }
}); 

app.post('/sign-up', async (req, res) => {
    try {
        let request_body = req.body;
        await addUser(request_body.newUser);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.post('/create-profile', async (req, res) => {
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

app.post('/edit-profile', async (req, res) => {
    try {
        let request_body = req.body;
        let result = await updateProfileFields(request_body.profileInfo);
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

const startServer = (port) => {
    app.listen(port, console.warn(`Listening on port ${port}`));
}

console.log("API setup is complete.")

export {
    startServer
}