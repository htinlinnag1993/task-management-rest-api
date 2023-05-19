require("dotenv").config();
const express = require("express");
const cors = require("cors");

const PORT = process.env.NODE_DOCKER_PORT || 8080;

const app = express();

var corsOptions = {
  origin: "http://localhost:8081",
};

/** Middlewares */
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({  extended: true }));

/** Routes */

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
