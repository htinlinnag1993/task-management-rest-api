const sequelize = require("sequelize");

const { task: TaskModel } = require("../models");
const { RESOURCE_TYPES, ROLES } = require("../utils/resource_utils");
const {
    HTTP_SUCCESSES,
    HTTP_ERRORS,
    ERROR_TYPES,
} = require("../utils/http_utils");
const {
    logRequest,
    logRecord,
    logRecords,
    logResponse,
} = require("../utils/logger_utils");

const { TASK } = RESOURCE_TYPES;
const { MANAGER, TECHNICIAN } = ROLES;
const { OK, PERFORM_SUCCESS, UPDATE_SUCCESS, DELETE_SUCCESS } = HTTP_SUCCESSES;
const { FAILURE_400, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER } = HTTP_ERRORS;
const {
    NOT_AN_OWNER_OR_A_MANAGER,
    NOT_A_TECHNICIAN,
    NOT_AN_OWNER,
    NOT_A_MANAGER,
    BAD_REQUEST,
    LIST_ALL_FAIL,
    UPDATE_FAIL,
    DELETE_FAIL,
} = ERROR_TYPES;

const attributesToIncludeInResult = [
    "taskId",
    "name",
    "status",
    "summary",
    "createdBy",
    "performedAt",
    "completedAt",
];

/** Retrieve a task as the task owner technician or a manager. */
const getTask = async (req, res) => {
    logRequest(req, TASK);
    let statusCode;
    let resBody;

    const { taskId } = req.params;
    const { userId, role } = req.user;

    try {
        const { dataValues: task } = await TaskModel.findByPk(taskId, {
            attributes: attributesToIncludeInResult,
        });
        logRecord(task, req.method, TASK);

        // Task Found
        if (task) {
            // Owner of the task or a manager
            if (task.createdBy === userId || role === MANAGER) {
                statusCode = OK.statusCode;
                resBody = { data: task };
            } else {
                statusCode = UNAUTHORIZED.statusCode;
                resBody = UNAUTHORIZED.getMessage(
                    TASK,
                    taskId,
                    NOT_AN_OWNER_OR_A_MANAGER
                );
            }
        } else {
            statusCode = NOT_FOUND.statusCode;
            resBody = NOT_FOUND.getMessage(TASK, taskId);
        }
    } catch (error) {
        console.log(error);
        statusCode = INTERNAL_SERVER.statusCode;
        resBody = error.message || INTERNAL_SERVER.getMessage(TASK, taskId);
    } finally {
        logResponse(statusCode, resBody, TASK);
        res.status(statusCode).send(resBody);
    }
};

/** Retrieve all tasks as the task owner technician or a manager. */
const listTasks = async (req, res) => {
    logRequest(req, TASK);
    let statusCode;
    let resBody;

    const { name, status } = req.query;
    const { userId, role } = req.user;
    const condition = {};

    // Not a manager. Then set the createdBy to the task owner id.
    if (role !== MANAGER) {
        condition.createdBy = userId;
    }

    if (name) {
        condition.name = { [sequelize.Op.like]: `%${name}%` };
    }
    if (status) {
        condition.status = status;
    }

    try {
        const list = await TaskModel.findAll({
            attributes: attributesToIncludeInResult,
            // include: {
            //   model: UserModel,
            //   as: "user"
            // },
            where: condition,
        });
        logRecords(list, req.method, TASK);
        const taskList = list.map(({ dataValues }) => dataValues);
        statusCode = OK.statusCode;
        resBody = { data: taskList };
    } catch (error) {
        console.error(error);
        statusCode = FAILURE_400.statusCode;
        resBody =
            error.message || FAILURE_400.getMessage(TASK, null, LIST_ALL_FAIL);
    } finally {
        logResponse(statusCode, resBody, TASK);
        res.status(statusCode).send(resBody);
    }
};

/** Create & save a new task as a technician. */
const createTask = async (req, res) => {
    logRequest(req, TASK);
    let statusCode;
    let resBody;

    const {
        body: { name, summary },
        user: { userId, role },
    } = req;

    // User is not a technician
    if (role !== TECHNICIAN) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage(null, null, NOT_A_TECHNICIAN);
        res.status(statusCode).send(resBody);
    } else {
        // User is a technician

        if (!name || !summary) {
            // name and summary are empty
            statusCode = FAILURE_400.statusCode;
            resBody = FAILURE_400.getMessage(null, null, BAD_REQUEST);
            logResponse(statusCode, resBody, TASK);
            res.status(statusCode).send(resBody);
        } else {
            const task = { name, summary, createdBy: userId };

            try {
                const data = await TaskModel.create(task, {
                    fields: attributesToIncludeInResult,
                });

                statusCode = OK.statusCode;
                resBody = { data };
            } catch (error) {
                console.error(error);
                statusCode = INTERNAL_SERVER.statusCode;
                resBody = error.message || INTERNAL_SERVER.getMessage(TASK);
            } finally {
                logResponse(statusCode, resBody, TASK);
                res.status(statusCode).send(resBody);
            }
        }
    }
};

/** Update a task by the id in the request as the task owner technician. */
const updateTask = async (req, res) => {
    logRequest(req, TASK);
    let statusCode;
    let resBody;

    const {
        params: { taskId },
        user: { userId, role },
        body,
    } = req;

    // User is not a technician
    if (role !== TECHNICIAN) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage(null, null, NOT_A_TECHNICIAN);
        res.status(statusCode).send(resBody);
    } else {
        try {
            const task = await TaskModel.findByPk(taskId);

            // Task found
            if (task) {
                const taskInfo = task.dataValues;

                // Correct task owner
                if (taskInfo.createdBy === userId) {
                    // Correct task owner
                    const result = await task.update(body);
                    logRecord(result, req.method, TASK);

                    // Update successful
                    if (result) {
                        statusCode = UPDATE_SUCCESS.statusCode;
                        resBody = UPDATE_SUCCESS.getMessage(TASK);
                    } else {
                        // Update not successful
                        statusCode = FAILURE_400.statusCode;
                        resBody = FAILURE_400.getMessage(
                            TASK,
                            taskId,
                            UPDATE_FAIL
                        );
                    }
                } else {
                    // Not an owner of the task
                    statusCode = UNAUTHORIZED.statusCode;
                    resBody = UNAUTHORIZED.getMessage(
                        TASK,
                        taskId,
                        NOT_AN_OWNER
                    );
                }
            } else {
                // Task not found
                statusCode = NOT_FOUND.statusCode;
                resBody = NOT_FOUND.getMessage(TASK, taskId);
            }
        } catch (error) {
            console.error(error);
            statusCode = INTERNAL_SERVER.statusCode;
            resBody = error.message || INTERNAL_SERVER.getMessage(TASK, taskId);
        } finally {
            logResponse(statusCode, resBody, TASK);
            res.status(statusCode).send(resBody);
        }
    }
};

/** Perform a task as the task owner technician. */
const performTask = async (req, res) => {
    logRequest(req, TASK);
    let statusCode;
    let resBody;

    const {
        params: { taskId },
        user: { userId, username, role },
    } = req;

    // User is not a technician
    if (role !== TECHNICIAN) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage(null, null, NOT_A_TECHNICIAN);res.status(statusCode).send(resBody);
    } else {
        const taskPerformed = {
            status: "complete",
            performedAt: sequelize.literal("CURRENT_TIMESTAMP"),
        };
        try {
            const task = await TaskModel.findByPk(taskId);
            logRecord(task, req.method, TASK);

            // Task found
            if (task) {
                const taskInfo = task.dataValues;
                if (taskInfo.createdBy === userId) {
                    // Correct task owner
                    const result = await task.update(taskPerformed);
                    logRecord(result, req.method, TASK);

                    // Perform update successful
                    if (result) {
                        console.log(
                            `Task ${taskId} was performed by technician ${username} at ${taskPerformed.performedAt}.`
                        );

                        statusCode = PERFORM_SUCCESS.statusCode;
                        resBody = PERFORM_SUCCESS.getMessage(TASK);
                    } else {
                        // Perform update not successful
                        statusCode = FAILURE_400.statusCode;
                        resBody = FAILURE_400.getMessage(
                            TASK,
                            taskId,
                            UPDATE_FAIL
                        );
                    }
                } else {
                    // Not an owner of the task
                    statusCode = UNAUTHORIZED.statusCode;
                    resBody = UNAUTHORIZED.getMessage(
                        TASK,
                        taskId,
                        NOT_AN_OWNER
                    );
                }
            } else {
                // Task not found
                statusCode = NOT_FOUND.statusCode;
                resBody = NOT_FOUND.getMessage(TASK, taskId);
            }
        } catch (error) {
            console.error(error);
            statusCode = INTERNAL_SERVER.statusCode;
            resBody = error.message || INTERNAL_SERVER.getMessage(TASK, taskId);
        } finally {
            logResponse(statusCode, resBody, TASK);
            res.status(statusCode).send(resBody);
        }
    }
};

/** Delete a task by the id as a manager. */
const deleteTask = async (req, res) => {
    logRequest(req, TASK);
    let statusCode;
    let resBody;

    const {
        params: { taskId },
        user: { role },
    } = req;

    // User is not a manager
    if (role !== MANAGER) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage(TASK, taskId, NOT_A_MANAGER);
        res.status(statusCode).send(resBody);
    } else {
        try {
            const num = await TaskModel.destroy({
                where: { task_id: taskId },
            });
            logRecord(num, req.method, TASK);

            if (num == 1) {
                statusCode = DELETE_SUCCESS.statusCode;
                resBody = DELETE_SUCCESS.getMessage(TASK);
            } else {
                statusCode = FAILURE_400.statusCode;
                resBody = FAILURE_400.getMessage(TASK, taskId, DELETE_FAIL);
            }
        } catch (error) {
            console.error(error);
            statusCode = INTERNAL_SERVER.statusCode;
            resBody = error.message || INTERNAL_SERVER.getMessage(TASK, taskId);
        } finally {
            logResponse(statusCode, resBody, TASK);
            res.status(statusCode).send(resBody);
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
