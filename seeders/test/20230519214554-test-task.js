'use strict';
const mockTasks = require("../../mockData/task_mock_data");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('task', mockTasks, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('task', null, {});
  }
};
