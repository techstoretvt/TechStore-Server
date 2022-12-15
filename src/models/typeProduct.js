'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class typeProduct extends Model {

    static associate(models) {
      // define association here
    }
  }
  typeProduct.init({
    nameTypeProduct: DataTypes.STRING,

  }, {
    sequelize,
    modelName: 'typeProduct',
  });
  return typeProduct;
};