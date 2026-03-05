import express from "express";
import cors from "cors";

const app = express();

// Configure Express APIs middleware.
app.use(express.json());
app.use(cors());

// To-do: define endpoints.

const startServer = (port) => {
    app.listen(port, console.warn(`Listening on port ${port}`));
}

console.log("API setup is complete.")

export {
    startServer
}