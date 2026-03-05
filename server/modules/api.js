import express from "express";
import cors from "cors";
import { retrieveOneUser } from "./data";

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



// To-do: define endpoints.
app.get('/get-profile', async (req, res) => { // Still working out the kinks on this.
    try {
        let request_body = req.body;
        let user_email = request_body.email;
        let user = await retrieveOneUser(user_email);
        response.json(user);
    } catch (e) {
        console.log(e);
        response.sendStatus(500);
    }
});


// app.post('/change-this-later', (req, res) => {
//     try {
//         // let body = req.body;
//         console.log("body:", req.body);
//         res.sendStatus(200);
//         // console.log(res);
//     } catch (e) {
//         console.error(e);
//         res.sendStatus(500);
//     }
// });



const startServer = (port) => {
    app.listen(port, console.warn(`Listening on port ${port}`));
}

console.log("API setup is complete.")

export {
    startServer
}