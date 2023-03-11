'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class shortVideos extends Model {

    static associate(models) {
      // define association here
      shortVideos.hasMany(models.hashTagVideos, { foreignKey: 'idShortVideo' })

    }
  }
  shortVideos.init({
    idUser: DataTypes.STRING,
    idDriveVideo: DataTypes.STRING,
    urlImage: DataTypes.STRING,
    content: DataTypes.STRING,
    scope: DataTypes.STRING, //public,private
    stt: DataTypes.INTEGER,
    idCloudinary: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'shortVideos',
  });
  return shortVideos;
};