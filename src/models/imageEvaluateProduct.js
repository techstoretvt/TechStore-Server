'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class imageEvaluateProduct extends Model {

    static associate(models) {
      // define association here
    }
  }
  imageEvaluateProduct.init({

    idEvaluateProduct: DataTypes.INTEGER,
    imagebase64: DataTypes.TEXT,


  }, {
    sequelize,
    modelName: 'imageEvaluateProduct',
  });
  return imageEvaluateProduct;
};