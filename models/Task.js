// models/Task.js
// Sequelize model for user tasks

const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Task = sequelize.define("Task", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  dueDate: DataTypes.DATEONLY,
  status: { type: DataTypes.STRING, defaultValue: "pending" },
  userId: { type: DataTypes.STRING, allowNull: false } // MongoDB ObjectId as string
});

module.exports = Task;
