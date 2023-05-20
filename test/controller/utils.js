const dataBaseColName2ModelFieldName = (colName) => {
  const arr = colName.split("_");
  let fieldName = arr[0];
  for (let i=1; i<arr.length; i++) {
    fieldName += arr[i].slice(0,1).toUpperCase() + arr[i].slice(1,arr[i].length);
  }
  return fieldName;
}

const getTasksListAsThisUser = (tasks, userId = null) => {
  return tasks
    .filter(({created_by}) => (!userId || (userId && userId === created_by)))
    .map((mockTask => getATaskAsThisUser(mockTask, userId)));
}

const getATaskAsThisUser = (task, userId = null) => {
  const expected = {};
  Object.entries(task).forEach(([key, val]) => {
    let newVal = val;
    if (["created_at", "updated_at"].includes(key)) {
      return;
    }
    const fieldName = dataBaseColName2ModelFieldName(key);
    expected[fieldName] = newVal;
  });
  return expected;
}

module.exports = {
  dataBaseColName2ModelFieldName,
  getTasksListAsThisUser,
  getATaskAsThisUser,
};
