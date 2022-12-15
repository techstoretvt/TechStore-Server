'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {

    static associate(models) {
      // define association here
    }
  }
  cart.init({
    idUser: DataTypes.INTEGER,
    idProduct: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    idClassifyProduct: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};