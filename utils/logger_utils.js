/** Logger */
const logRequest = ({ method, params, body }, resourceType) => {
  console.log(`--- ${method} request on ${resourceType} --- has been received.`);
  console.log(`--- The request has these params: `, { params });
  console.log(`--- The request has this body: `, { body });
}

const logRecord = ({ dataValues }, method, resourceType) => {
  console.log(`--- ${method} request on ${resourceType} has found: `, { dataValues });
}

const logRecords = (list, method, resourceType) => {
  console.log(`--- ${method} request on ${resourceType} has found ${list.length} of records.`);
}

const logResponse = (method, resourceType) => {
  console.log(`--- Processing ${method} request on ${resourceType} is done.`);
}
/** ------ */

module.exports = {
  logRequest,
  logRecord,
  logRecords,
  logResponse,
};
