require("dotenv").config();

const express = require("express");
const cors = require("cors");

const db = require("./models");
const routes = require("./routes");
const { logInfo, logError } = require("./utils/logger_utils");

/** Express App initialization */
const PORT = process.env.NODE_APP_PORT || 8080;
var corsOptions = {
    origin: "http://localhost:8081",
};
const app = express();
const server = require("http").Server(app);

/** DB Initialization */
const initializeDb = async () => {
    try {
        // In Production, use this:
        await db.sequelize.sync();
        logInfo("Synced db.");

        // Only for dev:
        // await db.sequelize.sync({ force: true });
        // logInfo("Drop and re-sync db.");
    } catch (error) {
        logError("Failed to sync db: " + error.message);
    }
};
initializeDb();

/** Middlewares */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/** Routes */
routes(app);

app.listen(PORT, () => {
    logInfo(`Server is running on port ${PORT}.`);
});

module.exports = {
    server,
    app,
};
