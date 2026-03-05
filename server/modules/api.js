import express from "express";
import cors from "cors";

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
app.get('/test', (_req, res) => {
    res.sendFile("package.json", {root: '.'});
});

const startServer = (port) => {
    app.listen(port, console.warn(`Listening on port ${port}`));
}

console.log("API setup is complete.")

export {
    startServer
}