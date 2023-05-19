/** Http Successes */
const HTTP_SUCCESSES = {
  /** 200s */
  OK: {
    statusCode: 200,
    getMessage: () => ({
      message: "Ok",
    }),
  },
  USER_REGISTRATION_SUCCESS: {
    statusCode: 200,
    getMessage: () => ({
      message: "User registered successfully!",
    }),
  },
  USER_SIGN_OUT_SUCCESS: {
    statusCode: 200,
    getMessage: () => ({
      message: "You've been signed out!",
    }),
  },
  UPDATE_SUCCESS: {
    statusCode: 200,
    getMessage: (resourceType) => ({
      message: `${resourceType} was updated successfully.`,
    }),
  },
  PERFORM_SUCCESS: {
    statusCode: 200,
    getMessage: (resourceType) => ({
      message: `${resourceType} was performed successfully.`,
    }),
  },
  DELETE_SUCCESS: {
    statusCode: 200,
    getMessage: (resourceType) => ({
      message: `${resourceType} was deleted successfully.`,
    }),
  }
}
/** ------ */

/** Http Errors */
/** 400s */
const ERROR_TYPES = {
  DUPLICATE_USER: "DUPLICATE_USER",
  INVALID_TOKEN: "INVALID_TOKEN",
  NOT_A_MANAGER: "NOT_A_MANAGER",
  NOT_A_TECHNICIAN: "NOT_A_TECHNICIAN",
  NOT_AN_OWNER: "NOT_AN_OWNER",
  NOT_AN_OWNER_OR_A_MANAGER: "NOT_AN_OWNER_OR_A_MANAGER",
  BAD_REQUEST: "BAD_REQUEST",
  LIST_ALL_FAIL: "LIST_ALL_FAIL",
  UPDATE_FAIL: "UPDATE_FAIL",
  DELETE_FAIL: "DELETE_FAIL",
}
const ERROR_MESSAGES = {
  [ERROR_TYPES.DUPLICATE_USER]: {
    getMessage: () => `Username is already in use!`,
  },
  [ERROR_TYPES.INVALID_TOKEN]: {
    getMessage: () => `Invalid token!`,
  },
  [ERROR_TYPES.NOT_AN_OWNER]: {
    getMessage: () => `You are not the owner of this task to update this task.`,
  },
  [ERROR_TYPES.NOT_AN_OWNER_OR_A_MANAGER]: {
    getMessage: () => `You are neither the owner of this task nor a manager to get access to this task.`,
  },
  [ERROR_TYPES.NOT_A_MANAGER]: {
    getMessage: () => `You are not a manager to have access to view or delete tasks.`,
  },
  [ERROR_TYPES.NOT_A_TECHNICIAN]: {
    getMessage: () => `You are not a technician to create, update or perform tasks.`,
  },
  [ERROR_TYPES.UNAUTHORIZED]: {
    getMessage: () => `Unauthorized.`,
  },
  [ERROR_TYPES.BAD_REQUEST]: {
    getMessage: () => `Bad request.`,
  },
  [ERROR_TYPES.LIST_ALL_FAIL]: {
    getMessage: (resourceType) => `Error retrieving a list of ${resourceType}.`,
  },
  [ERROR_TYPES.UPDATE_FAIL]: {
    getMessage: (resourceType, id) => `Cannot update ${resourceType} with ${id}. Maybe ${resourceType} was not found or req.body is empty!`,
  },
  [ERROR_TYPES.DELETE_FAIL]: {
    getMessage: (resourceType, id) => `Cannot delete ${resourceType} with ${id}. Maybe ${resourceType} was not found!`,
  },
};
const HTTP_ERRORS = {
  /** 400s */
  FAILURE_400: {
    statusCode: 400,
    getMessage: (resourceType, id, errorType) => ({
      message: ERROR_MESSAGES[errorType].getMessage(resourceType, id),
    }),
  },
  UNAUTHORIZED: {
    statusCode: 401,
    getMessage: (resourceType, id, errorType) => ({
      message: ERROR_MESSAGES[errorType].getMessage(resourceType, id),
    }),
  },
  FORBIDDEN: {
    statusCode: 403,
    getMessage: () => ({ message: `Forbidden` }),
  },
  NOT_FOUND: {
    statusCode: 404,
    getMessage: (resourceType, id) => ({ message: `Cannot find ${resourceType} with ${id}.` }),
  },
  /** 500s */
  INTERNAL_SERVER: {
    statusCode: 500,
    getMessage: (resourceType, id) => ({ message: `Error retrieving ${resourceType} with ${id}.` }),
  },
}
/** ------ */

module.exports = {
  HTTP_SUCCESSES,
  HTTP_ERRORS,
  ERROR_TYPES,
  ERROR_MESSAGES,
};
