'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {

    static associate(models) {
      // define association here
    }
  }
  product.init({
    nameProduct: DataTypes.STRING,
    priceProduct: DataTypes.STRING,
    idTypeProduct: DataTypes.INTEGER,
    idTrademark: DataTypes.INTEGER,
    contentHTML: DataTypes.TEXT,
    contentMarkdown: DataTypes.TEXT,
    isSell: DataTypes.STRING,
    sold: DataTypes.INTEGER,


  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};