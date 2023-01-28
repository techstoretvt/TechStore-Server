'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class videoEvaluateProduct extends Model {

    static associate(models) {
      // define association here
      videoEvaluateProduct.belongsTo(models.evaluateProduct, { foreignKey: 'idEvaluateProduct' })
    }
  }
  videoEvaluateProduct.init({

    idEvaluateProduct: DataTypes.STRING,
    videobase64: DataTypes.TEXT,


  }, {
    sequelize,
    modelName: 'videoEvaluateProduct',
  });
  return videoEvaluateProduct;
};