const { DataTypes, sequelize } = require("../lib/index");

// Define the Product model

const musicTrack =  sequelize.define("musictrack", {
  name: DataTypes.TEXT,
  genre: DataTypes.TEXT,
  release_year: DataTypes.INTEGER,
  artist: DataTypes.TEXT,
  album: DataTypes.TEXT,
  duration: DataTypes.INTEGER,
});

module.exports = musicTrack;
