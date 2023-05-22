const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { user: UserModel } = require("../models");
const config = require("../config/auth.config");
const userSessions = require("../dataStores/userSessionsWithJwt");
const { RESOURCE_TYPES, ROLES_LIST } = require("../utils/resource_utils");
const { HTTP_SUCCESSES, HTTP_ERRORS } = require("../utils/http_utils");
const { logRequest, logRecord, logResponse, logError } = require("../utils/logger_utils");

const { USER } = RESOURCE_TYPES;
const { 
    USER_REGISTRATION_SUCCESS, USER_SIGN_OUT_SUCCESS, 
    OK, USER_ALREADY_SIGNED_IN,
} = HTTP_SUCCESSES;
const { INTERNAL_SERVER, NOT_FOUND, UNAUTHORIZED } = HTTP_ERRORS;

/** New user sign up. */
const signUp = async (req, res) => {
    logRequest(req, USER);
    let statusCode;
    let resBody;

    const { username, firstName, lastName, password, role } = req.body;

    try {
        const user = await UserModel.create({
            username,
            firstName,
            lastName,
            password: bcrypt.hashSync(password, 10),
        });
        logRecord(user, req.method, USER);

        if (role & ROLES_LIST.includes(role)) {
            user.setRole(role);
        }

        statusCode = USER_REGISTRATION_SUCCESS.statusCode;
        resBody = USER_REGISTRATION_SUCCESS.getMessage();
    } catch (error) {
        logError(error);
        statusCode = INTERNAL_SERVER.statusCode;
        resBody = error.message || INTERNAL_SERVER.getMessage(USER);
    } finally {
        logResponse(statusCode, resBody, USER);
        res.status(statusCode).send(resBody);
    }
};

/** Existing user sign in. */
const signIn = async (req, res) => {
    logRequest(req, USER);
    let statusCode;
    let resBody;

    const { username, password } = req.body;
    try {
        const user = await UserModel.findOne({
            where: { username },
        });
        logRecord(user, req.method, USER);

        // User not found
        if (!user) {
            statusCode = NOT_FOUND.statusCode;
            resBody = NOT_FOUND.getMessage(USER, username);
        } else {
            // User found
            const passwordIsValid = bcrypt.compareSync(password, user.password);

            // Incorrect Password
            if (!passwordIsValid) {
                statusCode = UNAUTHORIZED.statusCode;
                resBody = UNAUTHORIZED.getMessage();
            } else {
                // Correct Password
                const signedInUser = {
                    userId: user.dataValues.userId,
                    username: user.dataValues.username,
                    role: user.dataValues.role,
                };

                // User is already signed in
                if (userSessions.userIdToJwt[signedInUser.userId]) {
                    statusCode = USER_ALREADY_SIGNED_IN.statusCode;
                    resBody = {
                        token: userSessions.userIdToJwt[signedInUser.userId],
                        message: USER_ALREADY_SIGNED_IN.getMessage(),
                    };
                } else {
                    const token = jwt.sign(
                        { user: signedInUser },
                        config.privateKey,
                        config.signOptions
                    );
                    // Save JWT token into the key-val session datastore
                    userSessions.jwtToUserId[token] = signedInUser.userId;
                    userSessions.userIdToJwt[signedInUser.userId] = token;
    
                    statusCode = OK.statusCode;
                    resBody = {
                        userId: user.userId,
                        username: user.username,
                        role: user.role,
                        token,
                    };
                }
            }
        }
    } catch (error) {
        logError(error);
        statusCode = INTERNAL_SERVER.statusCode;
        resBody = error.message || INTERNAL_SERVER.getMessage(USER, username);
    } finally {
        logResponse(statusCode, resBody, USER);
        res.status(statusCode).send(resBody);
    }
};

/** User sign out. */
const signOut = async (req, res) => {
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
    if (!token || !userSessions.jwtToUserId[token]) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage();
        logResponse(statusCode, resBody, USER);
        res.status(statusCode).send(resBody);
    } else {
        try {
            // Destroy JWT token from the key-val session datastore.
            const userId = userSessions.jwtToUserId[token];
            delete userSessions.jwtToUserId[token];
            delete userSessions.userIdToJwt[userId];
    
            statusCode = USER_SIGN_OUT_SUCCESS.statusCode;
            resBody = USER_SIGN_OUT_SUCCESS.getMessage();
            logResponse(statusCode, resBody, USER);
            return res.status(statusCode).send(resBody);
        } catch (error) {
            logError(error);
            this.next(error);
        }
    }
};

module.exports = {
    signUp,
    signIn,
    signOut,
};
