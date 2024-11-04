const sq = require("sequelize");

// create a new sequelize instance
const sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: "./db/musictrack_database.sqlite",
});

module.exports = { DataTypes: sq.DataTypes, sequelize };
