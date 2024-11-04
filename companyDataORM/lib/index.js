const sq = require("sequelize");

const sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: "./db/company_database.sqlite",
});

module.exports = { sequelize, DataTypes: sq.DataTypes };
