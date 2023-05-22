const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const dbConfig = require(`${__dirname}/../config/config.js`)[env];
const { logInfo, logError } = require("../utils/logger_utils");

const db = {};
let sq;

if (dbConfig.use_env_variable) {
    sq = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
    sq = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig
    );
}

sq.authenticate()
    .then(() => {
        logInfo("Connection has been established successfully.");
    })
    .catch((error) => {
        logError("Unable to connect to the database: ", error);
    });

/** Models reader
 * Example:
 * const UserModel = require("./user.js");
 * const TaskModel = require("./task.js");
 * const User = UserModel(sq, Sequelize);
 * const Task = TaskModel(sq, Sequelize);
 * db.users = User;
 * db.tasks = Task;
 */
fs.readdirSync(__dirname)
    .filter(
        (file) =>
            file.indexOf(".") !== 0 &&
            file !== basename &&
            file.slice(-3) === ".js"
    )
    .forEach((file) => {
        logInfo(path.join(__dirname, file));
        const model = require(path.join(__dirname, file))(
            sq,
            // Sequelize.DataTypes
            Sequelize
        );
        db[model.name] = model;
    });
Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sq;
db.Sequelize = Sequelize;

module.exports = db;
