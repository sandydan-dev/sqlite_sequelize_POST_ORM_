const sq = require("sequelize");

const sequelize = new sq.Sequelize({
  dialect: "sqlite",
  storage: "/db/books_store_database.sqlite",
});

module.exports = { DataTypes: sq.DataTypes, sequelize };
