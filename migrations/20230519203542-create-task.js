'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('task', {
      id: {
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
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      completedAt: {
        field: 'completed_at',
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      createdAt: {
        field: 'completed_at',
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('task');
  }
};