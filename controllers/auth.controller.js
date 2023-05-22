const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { user: UserModel } = require("../models");
const config = require("../config/auth.config");
const { 
  RESOURCE_TYPES, ROLES_LIST,
 } = require("../utils/resource_utils");
const {
  HTTP_SUCCESSES, HTTP_ERRORS,
} = require("../utils/http_utils");
const {
  logRequest, logRecord, logRecords, logResponse,
} = require("../utils/logger_utils");

const { USER } = RESOURCE_TYPES;
const {
  USER_REGISTRATION_SUCCESS,
  USER_SIGN_OUT_SUCCESS,
  OK,
} = HTTP_SUCCESSES;
const {
  INTERNAL_SERVER, NOT_FOUND, UNAUTHORIZED,
} = HTTP_ERRORS;


/** New user sign up. */
const signUp = async (req, res) => {
  logRequest(req, USER);
  let statusCode;
  let resBody;

  const { username, firstName, lastName, password, role, route } = req.body;
  
  try {
    const user = await UserModel.create({
      username,
      firstName, lastName,
      password: bcrypt.hashSync(password, 10),
    });
    logRecord(user, req.method, USER);
    
    if (role & ROLES_LIST.includes(role)) {
      const result = user.setRole(role);
    }

    statusCode = USER_REGISTRATION_SUCCESS.statusCode;
    resBody = USER_REGISTRATION_SUCCESS.getMessage();
  } catch (error) {
    console.error(error);
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
    } else { // User found
      const passwordIsValid = bcrypt.compareSync(
        password,
        user.password
      );

      // Incorrect Password
      if (!passwordIsValid) {
        statusCode = UNAUTHORIZED.statusCode;
        resBody = UNAUTHORIZED.getMessage();
      } else { // Correct Password
        const signedInUser = {
          userId: user.dataValues.userId,
          username: user.dataValues.username,
          role: user.dataValues.role,
        };
    
        const token = jwt.sign({ user: signedInUser }, config.privateKey, config.signOptions);
        // Save JWT token into the key-val session datastore
    
        statusCode = OK.statusCode;
        resBody = {
          userId: user.userId,
          username: user.username,
          role: user.role,
          token,
        };
      }
    }
  } catch (error) {
    console.error(error);
    statusCode = INTERNAL_SERVER.statusCode;
    resBody = error.message || INTERNAL_SERVER.getMessage(USER, username);
  } finally {
    logResponse(statusCode, resBody, USER);
    return res.status(statusCode).send(resBody);
  }
};


/** User sign out. */
const signOut = async (req, res) => {
  logRequest(req, USER);
  let statusCode;
  let resBody;
  
  try {
    // Destroy JWT token from the key-val session datastore.

    statusCode = USER_SIGN_OUT_SUCCESS.statusCode;
    resBody = USER_SIGN_OUT_SUCCESS.getMessage();
    logResponse(statusCode, resBody, USER);
    return res.status(statusCode).send(resBody);
  } catch (error) {
    console.error(error);
    this.next(error);
  }
}


module.exports = {
  signUp,
  signIn,
  signOut,
};
