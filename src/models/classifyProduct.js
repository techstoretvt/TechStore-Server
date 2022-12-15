'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class classifyProduct extends Model {

    static associate(models) {
      // define association here
    }
  }
  classifyProduct.init({
    idProduct: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    nameClassifyProduct: DataTypes.STRING


  }, {
    sequelize,
    modelName: 'classifyProduct',
  });
  return classifyProduct;
};