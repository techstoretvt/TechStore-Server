'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class evaluateProduct extends Model {

    static associate(models) {
      // define association here
    }
  }
  evaluateProduct.init({

    idUser: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    starNumber: DataTypes.INTEGER,
    content: DataTypes.TEXT


  }, {
    sequelize,
    modelName: 'evaluateProduct',
  });
  return evaluateProduct;
};