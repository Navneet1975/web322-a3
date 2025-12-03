// models/index.js
// Initialize Sequelize with Neon PostgreSQL

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Neon requires SSL settings
const sequelize = new Sequelize(process.env.POSTGRES_URI, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

module.exports = { sequelize };
