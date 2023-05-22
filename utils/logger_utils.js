const winston = require("winston");


/** Constants */
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
};


/** Winston Logger Config */
const logger = winston.createLogger({
  levels: LOG_LEVELS,
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.File({ filename: './logs/combined.log' })],
});


/** Helpers */
const formatNPrintRequestInfo = (
    { method, params, body, originalUrl },
    resourceType
) => {
    const logMessage = {
        type: "http request",
        received: `${method} request to ${originalUrl} on ${resourceType}`,
        params,
        body,
    };
    logger.info(JSON.stringify(logMessage));
};

const formatNPrintResponseInfo = (statusCode, body) => {
    const logMessage = {
        type: "responst",
        statusCode,
        body,
    };
    logger.info(JSON.stringify(logMessage));
};

/** Logger */
const logRequest = (request, resourceType) =>
    formatNPrintRequestInfo(request, resourceType);

const logResponse = (statusCode, body, resourceType) =>
    formatNPrintResponseInfo(statusCode, body, resourceType);

/** */
const logRecord = (record, method, resourceType) => {
    const logMessage = {
        method,
        resourceType,
        record: record,
    };
    logger.info(JSON.stringify(logMessage));
};

const logRecords = (list, method, resourceType) => {
    const logMessage = {
        method,
        resourceType,
        recordCount: list.length,
    };
    logger.info(JSON.stringify(logMessage));
};

const logError = (error) => winston.error(error);

const logInfo = (info) => winston.info(info);

/** ------ */

module.exports = {
    logRequest,
    logRecord,
    logRecords,
    logResponse,
    logError,
    logInfo,
};
