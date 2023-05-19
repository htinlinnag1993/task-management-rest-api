const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { users: UserModel } = require("../models");
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
  const { username, firstName, lastName, password, role } = req.body;
  try {
    const user = await UserModel.create({
      username,
      firstName, lastName,
      password: bcrypt.hashSync(password, 10),
    });
    if (role & ROLES_LIST.includes(role)) {
      const result = user.setRole(role);
    }
    res.status(USER_REGISTRATION_SUCCESS.statusCode).send(USER_REGISTRATION_SUCCESS.getMessage());
  } catch (error) {
    res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(USER));
  }
};


/** Existing user sign in. */
const signIn = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ 
      where: { username },
    });
    if (!user) {
      return res.status(NOT_FOUND.statusCode).send(NOT_FOUND.getMessage(USER, username));
    }
    const passwordIsValid = bcrypt.compareSync(
      password,
      user.password
    );
    if (!passwordIsValid) {
      return res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage());
    }

    const signedInUser = {
      id: user.dataValues.id,
      username: user.dataValues.username,
      role: user.dataValues.role,
    };

    const token = jwt.sign({ user: signedInUser }, config.privateKey, config.signOptions);
    // Save JWT token into the key-val session datastore

    return res.status(OK.statusCode).send({
      id: user.id,
      username: user.username,
      role: user.role,
      token,
    });
  } catch (error) {
    return res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(USER, username));
  }
};


/** User sign out. */
const signOut = async (req, res) => {
  try {
    // Destroy JWT token from the key-val session datastore.

    return res.status(USER_SIGN_OUT_SUCCESS.statusCode).send(USER_SIGN_OUT_SUCCESS.getMessage());
  } catch (error) {
    this.next(error);
    console.log(error);
  }
}

module.exports = {
  signUp,
  signIn,
  signOut,
};
