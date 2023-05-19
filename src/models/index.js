const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");
const UserModel = require("./user.model.js");
const TaskModel = require("./task.model.js");

const sq = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sq;

const User = UserModel(sq, Sequelize);
const Task = TaskModel(sq, Sequelize);

/** Relationships between tables/models */
User.hasMany(Task, {
  foreignKey: "createdBy",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Task.belongsTo(User, {
  foreignKey: "createdBy",
});

db.users = User;
db.tasks = Task;

module.exports = db;
