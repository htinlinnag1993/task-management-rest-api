const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "local";
const dbConfig = require(`${__dirname}/../config/config`)[env];
const UserModel = require("./user.model.js");
const TaskModel = require("./task.model.js");


const db = {};
let sq;

if (dbConfig.use_env_variable) {
  sq = new Sequelize(process.env[dbConfig.use_env_variable], dbConfig);
} else {
  sq = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password, {
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      operatorAliases: false,
      pool: dbConfig.pool,
    });
}

sq.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch((error) => {
  console.error('Unable to connect to the database: ', error);
});

/** Model reader */
// fs.readdirSync(__dirname)
//   .filter(
//     (file) =>
//       file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
//   )
//   .forEach((file) => {
//     const model = require(path.join(__dirname, file))(
//       sequelize,
//       Sequelize.DataTypes
//     );
//     db[model.name] = model;
//   });
// Object.keys(db).forEach((modelName) => {
//   if (db[modelName].associate) {
//     db[modelName].associate(db);
//   }
// });

const User = UserModel(sq, Sequelize);
const Task = TaskModel(sq, Sequelize);
db.users = User;
db.tasks = Task;
db.sequelize = sq;
db.Sequelize = Sequelize;

module.exports = db;
