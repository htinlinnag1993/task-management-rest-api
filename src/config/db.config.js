require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST || "localhost",
  USER: process.env.DB_USER || "htin-dev",
  PASSWORD: process.env.DB_PASSWORD || "password",
  DB: process.env.DB_NAME || "task_management",
  port: process.env.DB_PORT || "3306",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
