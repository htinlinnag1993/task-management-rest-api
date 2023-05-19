const { Model, UUIDV4 } = require("sequelize");
const { TASK_STATUSES } = require("../utils/model_utils");

module.exports = (sequelize, {DataTypes}) => {
  class Task extends Model {
    /** ManyToOne association with User */
    static associate({user}) {
      this.belongsTo(user, {
        foreignKey: "createdBy",
        as: "user",
      });
    }
  }

  Task.init({
    id: {
      field: 'task_id',
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    name: {
      field: 'name',
      type: DataTypes.STRING(300),
    },
    status: {
      field: 'status',
      type: DataTypes.ENUM(TASK_STATUSES.NEW, TASK_STATUSES.IN_PROGRESS, TASK_STATUSES.COMPLETE),
      defaultValue: TASK_STATUSES.NEW,
      allowNull: false,
    },
    summary: {
      field: 'summary',
      type: DataTypes.STRING(2500),
      allowNull: false,
    },
    createdBy: {
      field: 'created_by',
      type: DataTypes.UUID,
      allowNull: false,
      get() {
        return this.get('created_by');
      },
    },
    performedAt: {
      field: 'performed_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    completedAt: {
      field: 'completed_at',
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },{
    sequelize, // connection
    modelName: 'task',
    freezeTableName: true,
    timestamps: true,
    underscored: true,
  });
  
  return Task;
}
