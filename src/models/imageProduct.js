'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageProduct extends Model {

    static associate(models) {
      // define association here
    }
  }
  imageProduct.init({
    idProduct: DataTypes.INTEGER,
    imagebase64: DataTypes.TEXT


  }, {
    sequelize,
    modelName: 'imageProduct',
  });
  return imageProduct;
};