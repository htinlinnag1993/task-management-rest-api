const { DataTypes, UUIDV4 } = require("sequelize");
const { ROLE_TYPES } = require("./utils");

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      field: 'user_id',
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    username: {
      field: 'username',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      field: 'password',
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    firstName: {
      field: 'first_name',
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    lastName: {
      field: 'last_name',
      type: DataTypes.STRING(300),
      allowNull: false,
    },
    role: {
      field: 'role',
      type: DataTypes.ENUM(ROLE_TYPES.MANAGER, ROLE_TYPES.TECHNICIAN),
      defaultValue: ROLE_TYPES.TECHNICIAN,
      allowNull: false,
    },
  },{
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  });

  return User;
};
