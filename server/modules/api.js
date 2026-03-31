import express from "express";
import cors from "cors";

import {
    addUser,
    retrieveOneUserLogin,
    retrieveOneUser,
    updateProfileFields,
    addMatch,
    markCommunicationExposed,
    retrieveListOfMatchesByUser,
    likeUser,
    dislikeUser,
    retrieveMatch   // ✅ FIXED (missing before)
} from "./data.js";

import { getMatchScores } from "./matching-algo.js";

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, _res, next) => {
    const timestamp = new Date(Date.now());
    console.warn(`\n[${timestamp.toDateString()} ${timestamp.toTimeString()}]`);
    console.log(req.method, req.path);
    console.log('body:', req.body);
    next();
});


// =============================
// LOGIN
// =============================
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await retrieveOneUserLogin(email);

        if (!user) return res.sendStatus(401);

        if (user.password === password) {
            return res.sendStatus(200);
        }

        return res.sendStatus(401);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// SIGN UP
// =============================
app.post('/sign-up', async (req, res) => {
    try {
        const { newUser } = req.body;

        const existingUser = await retrieveOneUser(newUser.email);

        if (existingUser) {
            return res.sendStatus(409);
        }

        await addUser(newUser);
        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// CREATE OR EDIT PROFILE
// =============================
app.post('/create-or-edit-profile', async (req, res) => {
    try {
        const { profileInfo } = req.body;

        await updateProfileFields(profileInfo);

        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// GET PROFILE
// =============================
app.post('/get-profile-data', async (req, res) => {
    try {
        const { email } = req.body;

        const profile = await retrieveOneUser(email);

        res.json(profile);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// MATCHING (6 TASK CORE)
// =============================
app.post('/get-potential-matches', async (req, res) => {
    try {
        const { email } = req.body;

        const matchesArray = await getMatchScores(email);

        res.json(matchesArray);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// SAVE MATCH
// =============================
app.post('/save-new-match', async (req, res) => {
    try {
        const { matchData } = req.body;

        const result = await addMatch(matchData);

        if (!result) return res.sendStatus(409);

        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// MUTUAL CONTACT LOGIC (IMPORTANT FOR TASK 5)
// =============================
app.post('/communication-exposed', async (req, res) => {
    try {
        const { matchData, userEmail } = req.body;

        const exposedBy = await markCommunicationExposed(matchData, userEmail);

        res.json({ exposedBy });

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// GET ALL MATCHES
// =============================
app.post('/find-my-matches', async (req, res) => {
    try {
        const { email } = req.body;

        const result = await retrieveListOfMatchesByUser(email);

        res.json(result);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// LIKE / DISLIKE
// =============================
app.post('/send-like', async (req, res) => {
    try {
        const { userEmail, likeEmail } = req.body;

        await likeUser(userEmail, likeEmail);

        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});

app.post('/mark-dislike', async (req, res) => {
    try {
        const { userEmail, dislikeEmail } = req.body;

        await dislikeUser(userEmail, dislikeEmail);

        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
// FIXED MATCH STATUS (TASK SUPPORT)
// =============================
app.post('/get-match-status', async (req, res) => {
    try {
        const match = await retrieveMatch(req.body.matchData);

        if (!match) return res.sendStatus(404);

        res.json({
            exposedBy: match.exposedBy || [],
            u1_email: match.u1_email,
            u2_email: match.u2_email
        });

    } catch (e) {
        console.log(e);
        res.sendStatus(500);
    }
});


// =============================
const startServer = (port) => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
};

console.log("API setup complete");

export { startServer };