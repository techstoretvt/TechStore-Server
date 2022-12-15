'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class promotionProduct extends Model {

    static associate(models) {
      // define association here
    }
  }
  promotionProduct.init({

    idProduct: DataTypes.INTEGER,
    timePromotion: DataTypes.STRING,
    numberPercent: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'promotionProduct',
  });
  return promotionProduct;
};