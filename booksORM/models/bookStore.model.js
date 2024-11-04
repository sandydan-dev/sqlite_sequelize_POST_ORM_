const { DataTypes, sequelize } = require("../lib/index");

const book = sequelize.define("book", {
  title: DataTypes.TEXT,
  content: DataTypes.TEXT,
  author: DataTypes.TEXT,
});

module.exports = book;
