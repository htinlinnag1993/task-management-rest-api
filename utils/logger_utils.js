/** Constants */
const LINE_BREAK = "--------------------";
const INDENTATION = " --- ";

/** Helpers */
const formatNPrintRequestInfo = (
    { method, params, body, originalUrl },
    resourceType
) => {
    console.info(LINE_BREAK);
    console.info(
        INDENTATION +
            `Received: ${method} request to ${originalUrl} on ${resourceType}.`
    );
    console.info(INDENTATION + `Params: ${JSON.stringify(params)}.`);
    console.info(INDENTATION + `Body: ${JSON.stringify(body)}.`);
};

const formatNPrintResponseInfo = (statusCode, body) => {
    console.info(LINE_BREAK);
    console.info(INDENTATION + "Sending the following back: ");
    console.info(INDENTATION + `Status Code: ${statusCode}.`);
    console.info(INDENTATION + `Body: ${JSON.stringify(body)}.`);
};

/** Logger */
const logRequest = (request, resourceType) =>
    formatNPrintRequestInfo(request, resourceType);

const logResponse = (statusCode, body, resourceType) =>
    formatNPrintResponseInfo(statusCode, body, resourceType);

/** */
const logRecord = (record, method, resourceType) => {
    console.info(
        `--- Record for ${method} request on ${resourceType}:`,
        JSON.stringify(record)
    );
};

const logRecords = (list, method, resourceType) => {
    console.info(
        `--- ${method} request on ${resourceType} has found ${list.length} of records.`
    );
};

/** ------ */

module.exports = {
    logRequest,
    logRecord,
    logRecords,
    logResponse,
};
