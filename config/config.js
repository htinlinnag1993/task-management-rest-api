require("dotenv").config();

module.exports = {
    development: {
        username: process.env.MYSQL_DEV_USER,
        password: process.env.MYSQL_DEV_PASSWORD,
        database: process.env.MYSQL_DEV_DB_NAME,
        host: process.env.MYSQL_DEV_HOST,
        port: process.env.MYSQL_DEV_PORT,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    },
    test: {
        username: process.env.MYSQL_TEST_USER,
        password: process.env.MYSQL_TEST_PASSWORD,
        database: process.env.MYSQL_TEST_DB_NAME,
        host: process.env.MYSQL_TEST_HOST,
        port: process.env.MYSQL_TEST_PORT,
        dialect: "mysql",
    },
    production: {
        username: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        host: process.env.MYSQL_HOST,
        port: process.env.MYSQL_PORT,
        dialect: "mysql",
    },
};
