/** Constants */
const LINE_BREAK = "--------------------";
const INDENTATION = " --- ";

/** Helpers */
const formatNPrintRequestInfo = ({ method, params, body, originalUrl }, resourceType) => {
  console.log(LINE_BREAK);
  console.log(INDENTATION + `Received: ${method} request to ${originalUrl} on ${resourceType}.`);
  console.log(INDENTATION + `Params: ${JSON.stringify(params)}.`);
  console.log(INDENTATION + `Body: ${JSON.stringify(body)}.`);
};

const formatNPrintResponseInfo = (statusCode, body) => {
  console.log(LINE_BREAK);
  console.log(INDENTATION + "Sending the following back: ");
  console.log(INDENTATION + `Status Code: ${statusCode}.`);
  console.log(INDENTATION + `Body: ${JSON.stringify(body)}.`);
};

/** Logger */
const logRequest = (request, resourceType) => formatNPrintRequestInfo(request, resourceType);

const logResponse = (statusCode, body, resourceType) => formatNPrintResponseInfo(statusCode, body, resourceType);

/** */
const logRecord = (record, method, resourceType) => {
  console.log(`--- Record for ${method} request on ${resourceType}:`, JSON.stringify(record));
}

const logRecords = (list, method, resourceType) => {
  console.log(`--- ${method} request on ${resourceType} has found ${list.length} of records.`);
}


/** ------ */

module.exports = {
  logRequest,
  logRecord,
  logRecords,
  logResponse,
};
