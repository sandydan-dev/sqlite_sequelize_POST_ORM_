const sq = require("sequelize");

const sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: "/db/employee_data_database.sqlite",
});

module.exports = { sequelize, DataTypes: sq.DataTypes };
