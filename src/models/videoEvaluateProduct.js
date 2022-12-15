'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class videoEvaluateProduct extends Model {

    static associate(models) {
      // define association here
    }
  }
  videoEvaluateProduct.init({

    idEvaluateProduct: DataTypes.INTEGER,
    videobase64: DataTypes.TEXT,


  }, {
    sequelize,
    modelName: 'videoEvaluateProduct',
  });
  return videoEvaluateProduct;
};