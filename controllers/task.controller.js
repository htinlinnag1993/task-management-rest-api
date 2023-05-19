const sequelize = require("sequelize");

const { task: TaskModel } = require("../models");
const { 
  RESOURCE_TYPES, ROLES,
} = require("../utils/resource_utils");
const {
  HTTP_SUCCESSES, HTTP_ERRORS, ERROR_TYPES,
} = require("../utils/http_utils");
const {
  logRequest, logRecord, logRecords, logResponse,
} = require("../utils/logger_utils");

const { TASK } = RESOURCE_TYPES;
const { MANAGER, TECHNICIAN } = ROLES;
const { 
  OK, PERFORM_SUCCESS, UPDATE_SUCCESS, DELETE_SUCCESS,
} = HTTP_SUCCESSES;
const { 
  FAILURE_400, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER,
} = HTTP_ERRORS;
const {
  NOT_AN_OWNER_OR_A_MANAGER, NOT_A_TECHNICIAN, NOT_AN_OWNER, NOT_A_MANAGER, 
  BAD_REQUEST, LIST_ALL_FAIL, UPDATE_FAIL, DELETE_FAIL,
} = ERROR_TYPES;


/** Retrieve a task as the task owner technician or a manager. */
const getTask = async (req, res) => {
  const { taskId } = req.params;
  const { id: userId, role } = req.user;
  logRequest(req, TASK);
  try {
    const { dataValues: task } = await TaskModel.findByPk(taskId);
    logRecord(task, req.method, TASK);
    // Task Found 
    if (task) {
      // Owner of the task or a manager
      if (task.createdBy === userId || role === MANAGER) {
        res.status(OK.statusCode).send(task);
      }
      else {
        res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage(TASK, taskId, NOT_AN_OWNER_OR_A_MANAGER));
      }
    } else {
      res.status(NOT_FOUND.statusCode).send(NOT_FOUND.getMessage(TASK, taskId));
    }
  } catch (error) {
    res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(TASK, taskId));
  } finally {
    logResponse(req.method, TASK);
  }
};


/** Retrieve all tasks as the task owner technician or a manager. */
const listTasks = async(req, res) => {
  const { name, status } = req.query;
  const { id: userId, role } = req.user;
  logRequest(req, TASK);
  const condition = {};

  // Not a manager. Then set the createdBy to the task owner id.
  if (role !== MANAGER) {
    condition.createdBy = userId;
  }

  if (name) {
    condition.name = { [Op.like]: `%${name}%` };
  }
  if (status) {
    condition.status = status;
  }

  try {
    const list = await TaskModel.findAll({ 
      where: condition
    });
    logRecords(list, req.method, TASK);
    res.status(OK.statusCode).send(list);
  } catch (error) {
    res.status(FAILURE_400.statusCode).send(error.message || FAILURE_400.getMessage(TASK, null, LIST_ALL_FAIL));
  } finally {
    logResponse(req.method, TASK);
  }
};


/** Create & save a new task as a technician. */
const createTask = async (req, res) => {
  const { 
    body: { 
      name, 
      summary
    },
    user: { 
      id: userId, 
      role,
    }
  } = req;
  logRequest(req, TASK);

  if (role !== TECHNICIAN) {
    res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage(null, null, NOT_A_TECHNICIAN));
  } else {
    if (!name || !summary) {
      res.status(FAILURE_400.statusCode).send(FAILURE_400.getMessage(null, null, BAD_REQUEST));
      return;
    }
  
    const task = { name, summary, createdBy: userId };
    try {
      const data = await TaskModel.create(task);
      res.send(data);
    } catch (error) {
      res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(TASK));
    } finally {
      logResponse(req.method, TASK);
    }
  }
};


/** Update a task by the id in the request as the task owner technician. */
const updateTask = async (req, res) => {
  const {
    params: { taskId },
    user: {
      id: userId,
      role,
    },
    body,
  } = req;
  logRequest(req, TASK);
  if (role !== TECHNICIAN) {
    res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage(null, null, NOT_A_TECHNICIAN));
  } else {
    try {
      const task = await TaskModel.findByPk(taskId);
      // Task found
      if (task) {
        const taskInfo = task.dataValues;
        if (taskInfo.createdBy === userId) { // Correct task owner
          const result = await task.update(body);
          // Update successful
          if (result) {
            res.status(UPDATE_SUCCESS.statusCode).send(UPDATE_SUCCESS.getMessage(TASK));
          } else { // Update not successful
            res.status(FAILURE_400.statusCode).send(FAILURE_400.getMessage(TASK, taskId, UPDATE_FAIL));
          }
        } else { // Not an owner of the task
          res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage(TASK, taskId, NOT_AN_OWNER));
        }
      } else { // Task not found
        res.status(NOT_FOUND.statusCode).send(NOT_FOUND.getMessage(TASK, taskId));
      }
    } catch (error) {
      res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(TASK, taskId));
    } finally {
      logResponse(req.method, TASK);
    }
  }
};


/** Perform a task as the task owner technician. */
const performTask = async (req, res) => {
  const { 
    params: {
      taskId 
    },
    user: {
      id: userId,
      username,
      role,
    }
  } = req;
  logRequest(req, TASK);
  if (role !== TECHNICIAN) {
    res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage(null, null, NOT_A_TECHNICIAN));
  } else {
    const taskPerformed = {
      status: "complete",
      performedAt: sequelize.literal('CURRENT_TIMESTAMP'),
    };
    try {
      const task = await TaskModel.findByPk(taskId);
      // Task found
      if (task) {
        const taskInfo = task.dataValues;
        if (taskInfo.createdBy === userId) { // Correct task owner
          const result = await task.update(taskPerformed);
          // Perform update successful
          if (result) {
            console.log(`Task ${taskId} was performed by technician ${username} at ${taskPerformed.performedAt}.`);

            res.status(PERFORM_SUCCESS.statusCode).send(PERFORM_SUCCESS.getMessage(TASK));
          } else { // Perform update not successful
            res.status(FAILURE_400.statusCode).send(FAILURE_400.getMessage(TASK, taskId, UPDATE_FAIL));
          }
        } else { // Not an owner of the task
          res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage(TASK, taskId, NOT_AN_OWNER));
        }
      } else { // Task not found
        res.status(NOT_FOUND.statusCode).send(NOT_FOUND.getMessage(TASK, taskId));
      }
    } catch (error) {
      res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(TASK, taskId));
    } finally {
      logResponse(req.method, TASK);
    }
  }
};


/** Delete a task by the id as a manager. */
const deleteTask = async (req, res) => {
  const { 
    params: { taskId },
    user: { 
      role,
    }
  } = req;
  logRequest(req, TASK);
  if (role !== MANAGER) {
    res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage(TASK, taskId, NOT_A_MANAGER));
  } else {
    try {
      const num = await TaskModel.destroy({
        where: { task_id: taskId },
      });
      if (num == 1) {
        res.status(DELETE_SUCCESS.statusCode).send(DELETE_SUCCESS.getMessage(TASK));
      } else {
        res.status(FAILURE_400.statusCode).send(FAILURE_400.getMessage(TASK, taskId, DELETE_FAIL));
      }
    } catch (error) {
      res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(TASK, taskId));
    } finally {
      logResponse(req.method, TASK);
    }
  }
};

module.exports = {
  getTask,
  listTasks,
  createTask,
  updateTask,
  performTask,
  deleteTask,
};
