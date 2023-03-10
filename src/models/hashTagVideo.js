'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hashTagVideos extends Model {

    static associate(models) {
      // define association here

    }
  }
  hashTagVideos.init({
    idShortVideo: DataTypes.STRING,
    idProduct: DataTypes.STRING,
    stt: DataTypes.INTEGER


  }, {
    sequelize,
    modelName: 'hashTagVideos',
  });
  return hashTagVideos;
};