const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { 
  HTTP_ERRORS,
} = require("../utils/http_utils");

const {
  UNAUTHORIZED,
  INTERNAL_SERVER,
} = HTTP_ERRORS;

const verifyToken = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage());
  }
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(UNAUTHORIZED.statusCode).send(UNAUTHORIZED.getMessage());
  }
  try {
    const decoded = jwt.verify(token, config.publicKey);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(INTERNAL_SERVER.statusCode).sende(error.message || INTERNAL_SERVER.getMessage());
  }
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
