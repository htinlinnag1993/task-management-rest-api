const { user: UserModel } = require("../models");
const { HTTP_ERRORS, ERROR_TYPES } = require("../utils/http_utils");
const { RESOURCE_TYPES } = require("../utils/resource_utils");
const {
    logRequest,
    logRecord,
    logResponse,
} = require("../utils/logger_utils");

const { USER } = RESOURCE_TYPES;
const { DUPLICATE_USER } = ERROR_TYPES;
const { FAILURE_400, INTERNAL_SERVER } = HTTP_ERRORS;

/** Check duplicate username. */
const checkDuplicateUsername = async (req, res, next) => {
    logRequest(req, USER);
    let statusCode;
    let resBody;

    const { username } = req.body;
    try {
        let user = await UserModel.findOne({
            where: { username },
        });
        logRecord(user, req.method, USER);
        // username already exists
        if (user) {
            statusCode = FAILURE_400.statusCode;
            resBody = FAILURE_400.getMessage(USER, null, DUPLICATE_USER);
            logResponse(statusCode, resBody, USER);
            res.status(statusCode).send(resBody);
        } else {
            // new user
            next();
        }
    } catch (error) {
        console.error(error);
        statusCode = INTERNAL_SERVER.statusCode;
        resBody = error.message || INTERNAL_SERVER.getMessage(USER, username);
        return res.status(statusCode).send(resBody);
    }
};

const verifySignUp = {
    checkDuplicateUsername,
};

module.exports = verifySignUp;
