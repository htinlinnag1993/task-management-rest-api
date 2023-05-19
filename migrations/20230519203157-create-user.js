'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user', {
      id: {
        field: 'user_id',
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      username: {
        field: 'username',
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      password: {
        field: 'password',
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      firstName: {
        field: 'first_name',
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      lastName: {
        field: 'last_name',
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      role: {
        field: 'role',
        type: Sequelize.ENUM("manager", "technician"),
        defaultValue: "technician",
        allowNull: false,
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
    await queryInterface.dropTable('user');
  }
};