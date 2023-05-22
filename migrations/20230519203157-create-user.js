"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("user", {
            userId: {
                field: "user_id",
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                defaultValue: Sequelize.UUIDV4,
            },
            username: {
                field: "username",
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            password: {
                field: "password",
                type: Sequelize.STRING(100),
                allowNull: false,
            },
            firstName: {
                field: "first_name",
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            lastName: {
                field: "last_name",
                type: Sequelize.STRING(300),
                allowNull: false,
            },
            role: {
                field: "role",
                type: Sequelize.ENUM("manager", "technician"),
                defaultValue: "technician",
                allowNull: false,
            },
            createdAt: {
                field: "created_at",
                allowNull: false,
                type: "TIMESTAMP",
                defaultValue: new Date(),
            },
            updatedAt: {
                field: "updated_at",
                allowNull: false,
                type: "TIMESTAMP",
                defaultValue: new Date(),
            },
        });
    },
    // eslint-disable-next-line no-unused-vars
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("user");
    },
};
