"use strict";
const mockTasks = require("../../mockData/task_mock_data");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    // eslint-disable-next-line no-unused-vars
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert("task", mockTasks, {});
    },

    // eslint-disable-next-line no-unused-vars
    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("task", null, {});
    },
};
