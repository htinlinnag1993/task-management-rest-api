const db = require("../models");
const { 
  HTTP_ERRORS, ERROR_TYPES 
} = require("../utils/http_utils");
const { RESOURCE_TYPES } = require("../utils/resource_utils"); 
const {
  logRequest, logRecord, logRecords, logResponse
} = require("../utils/logger_utils");

const UserModel = db.users;
const { USER } = RESOURCE_TYPES;
const { DUPLICATE_USER } = ERROR_TYPES;
const {
  FAILURE_400,
  INTERNAL_SERVER,
} = HTTP_ERRORS;

const checkDuplicateUsername = async (req, res, next) => {
  const { username } = req.body;
  try {
    let user = await UserModel.findOne({
      where: { username }
    });
    if (user) {
      return res.status(FAILURE_400.statusCode).send(FAILURE_400.getMessage(USER, null, DUPLICATE_USER));
    }
    next();
  } catch (error) {
    return res.status(INTERNAL_SERVER.statusCode).send(error.message || INTERNAL_SERVER.getMessage(USER, username));
  }
};

const verifySignUp = {
  checkDuplicateUsername,
};

module.exports = verifySignUp;
