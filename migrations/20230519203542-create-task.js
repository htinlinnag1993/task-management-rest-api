'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task', {
      taskId: {
        field: 'task_id',
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      name: {
        field: 'name',
        type: Sequelize.STRING(300),
      },
      status: {
        field: 'status',
        type: Sequelize.ENUM("new", "in progress", "complete"),
        defaultValue: "new",
        allowNull: false,
      },
      summary: {
        field: 'summary',
        type: Sequelize.STRING(2500),
        allowNull: false,
      },
      createdBy: {
        field: 'created_by',
        type: Sequelize.UUID,
        allowNull: false,
        get() {
          return this.get('created_by');
        },
      },
      performedAt: {
        field: 'performed_at',
        type: "TIMESTAMP",
        allowNull: true,
        defaultValue: null,
      },
      completedAt: {
        field: 'completed_at',
        type: "TIMESTAMP",
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        field: 'created_at',
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: new Date(),
      },
      updatedAt: {
        field: 'updated_at',
        allowNull: false,
        type: "TIMESTAMP",
        defaultValue: new Date(),
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task');
  }
};