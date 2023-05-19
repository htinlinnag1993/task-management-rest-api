const express = require("express");
const tasks = require("../controllers/task.controller.js");
const { verifyToken } = require("../middlewares/authJwt.js");


module.exports = app => {
  let router = express.Router();

  // Retrieve a single Task with id as a the task owner technician or a manager.
  router.get("/:taskId", [verifyToken], tasks.getTask);

  // Update a task with id as the task owner technician
  router.put("/:taskId", [verifyToken], tasks.updateTask);

  // Create a new Task as a techinician
  router.post("/", [verifyToken], tasks.createTask);

  // Delete a Task with id as a manager
  router.delete("/:taskId", [verifyToken], tasks.deleteTask);

  // Retrieve all tasks as a manager or all his/her tasks a technician
  router.get("/", [verifyToken], tasks.listTasks);

  // Perform a task with id as the task owner technician
  router.put("/perform/:taskId", [verifyToken], tasks.performTask);

  app.use('/api/tasks', router);
};
