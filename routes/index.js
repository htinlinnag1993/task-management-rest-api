const authRoutes = require("./auth.routes");
const taskRoutes = require("./task.routes");

module.exports = (app) => {
  authRoutes(app);
  taskRoutes(app);
};
