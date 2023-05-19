require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./models/");
const authConfig = require("./config/auth.config");
const authRoutes = require("./routes/auth.routes");
const taskRoutes = require("./routes/task.routes");

const PORT = process.env.NODE_DOCKER_PORT || 8080;

/** DB Initialization */
const initializeDb = async () => {
  try {
    // In Production, use this:
    await db.sequelize.sync();
    console.log("Synced db.");

    // Only for dev:
    // await db.sequelize.sync({ force: true });
    // console.log("Drop and re-sync db.");
  } catch (error) {
    console.log("Failed to sync db: " + error.message);
  }
};
initializeDb();

var corsOptions = {
  origin: "http://localhost:8081",
};

const app = express();

/** Middlewares */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({  extended: true }));

/** Routes */
authRoutes(app);
taskRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = {
  server: app,
};
