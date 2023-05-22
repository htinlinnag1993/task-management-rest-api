const jwt = require("jsonwebtoken");

const config = require("../config/auth.config");
const { HTTP_ERRORS } = require("../utils/http_utils");
const { logRequest, logResponse } = require("../utils/logger_utils");
const { RESOURCE_TYPES } = require("../utils/resource_utils");

const { UNAUTHORIZED, INTERNAL_SERVER } = HTTP_ERRORS;
const { USER } = RESOURCE_TYPES;

/** User's JWT verification. */
const verifyToken = (req, res, next) => {
    logRequest(req, USER);
    let statusCode;
    let resBody;

    // Invalid Authorization header
    if (!req.headers.authorization) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage();
        logResponse(statusCode, resBody, USER);
        res.status(statusCode).send(resBody);
    }

    const token = req.headers["authorization"].split(" ")[1];
    // Invalid token
    if (!token) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage();
        logResponse(statusCode, resBody, USER);
        res.status(statusCode).send(resBody);
    }

    try {
        const decoded = jwt.verify(token, config.publicKey);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error);
        statusCode = INTERNAL_SERVER.statusCode;
        resBody = error.message || INTERNAL_SERVER.getMessage();
        logResponse(statusCode, resBody, USER);
        res.status(statusCode).send(resBody);
    }
};

const authJwt = {
    verifyToken,
};

module.exports = authJwt;
